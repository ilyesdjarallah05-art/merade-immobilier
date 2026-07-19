const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 3;
const recentSubmissions = new Map();

function env(name){
  return String(Deno.env.get(name) || '').trim();
}

function allowedOrigins(){
  const configured = env('SITE_ORIGINS').split(',').map(value=>value.trim().replace(/\/$/,'')).filter(Boolean);
  return new Set([
    ...configured,
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ]);
}

function corsHeaders(origin){
  return {
    'Access-Control-Allow-Origin':origin,
    'Access-Control-Allow-Headers':'apikey, content-type',
    'Access-Control-Allow-Methods':'POST, OPTIONS',
    'Access-Control-Max-Age':'86400',
    'Content-Type':'application/json; charset=utf-8',
    'Vary':'Origin'
  };
}

function json(body, status, origin=''){
  return new Response(JSON.stringify(body), {
    status,
    headers:origin ? corsHeaders(origin) : { 'Content-Type':'application/json; charset=utf-8', 'Vary':'Origin' }
  });
}

function clean(value, maxLength){
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g,' ').replace(/\s+/g,' ').trim().slice(0,maxLength);
}

function publicKeys(){
  const keys = [];
  const legacy = env('SUPABASE_ANON_KEY');
  if(legacy) keys.push(legacy);
  try{
    const configured = JSON.parse(env('SUPABASE_PUBLISHABLE_KEYS') || '{}');
    Object.values(configured).forEach(value=>{ if(value) keys.push(String(value)); });
  }catch{}
  return keys;
}

function hasValidPublicKey(req){
  const presented = String(req.headers.get('apikey') || '');
  return Boolean(presented && publicKeys().includes(presented));
}

function clientIp(req){
  return clean(req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || '', 80);
}

function isRateLimited(req){
  const ip = clientIp(req);
  if(!ip) return false;
  const now = Date.now();
  const recent = (recentSubmissions.get(ip) || []).filter(timestamp=>now - timestamp < RATE_WINDOW_MS);
  if(recent.length >= RATE_LIMIT){
    recentSubmissions.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentSubmissions.set(ip, recent);
  if(recentSubmissions.size > 2000){
    for(const [key,timestamps] of recentSubmissions){
      if(!timestamps.some(timestamp=>now - timestamp < RATE_WINDOW_MS)) recentSubmissions.delete(key);
    }
  }
  return false;
}

Deno.serve(async req=>{
  const origin = String(req.headers.get('origin') || '').replace(/\/$/,'');
  const originAllowed = allowedOrigins().has(origin);

  if(req.method === 'OPTIONS'){
    return originAllowed ? new Response(null, { status:204, headers:corsHeaders(origin) }) : json({ ok:false }, 403);
  }
  if(req.method !== 'POST') return json({ ok:false, error:'Method not allowed.' }, 405, originAllowed ? origin : '');
  if(!originAllowed) return json({ ok:false, error:'Origin not allowed.' }, 403);
  if(!hasValidPublicKey(req)) return json({ ok:false, error:'Invalid client key.' }, 401, origin);

  const contentLength = Number(req.headers.get('content-length') || 0);
  if(contentLength > 10_000) return json({ ok:false, error:'Request is too large.' }, 413, origin);

  let body;
  try{ body = await req.json(); }
  catch{ return json({ ok:false, error:'Invalid request.' }, 400, origin); }

  // Honeypot fields are invisible to people but commonly filled by form bots.
  if(clean(body?.company, 200)) return json({ ok:true }, 200, origin);

  const name = clean(body?.name, 100);
  const phone = clean(body?.phone, 30);
  const subject = clean(body?.subject, 120);
  const message = clean(body?.message, 2000);
  const language = clean(body?.language, 8);
  const page = clean(body?.page, 500);

  if(name.length < 2 || message.length < 1 || !/^[+0-9\s().-]{5,30}$/.test(phone) || !subject){
    return json({ ok:false, error:'Please check the form fields.' }, 400, origin);
  }
  if(isRateLimited(req)) return json({ ok:false, error:'Too many requests. Please wait one minute.' }, 429, origin);

  const botToken = env('TELEGRAM_BOT_TOKEN');
  const chatId = env('TELEGRAM_CHAT_ID');
  if(!botToken || !chatId){
    console.error('Telegram delivery is missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.');
    return json({ ok:false, error:'Contact service is not configured.' }, 503, origin);
  }

  const telegramText = [
    'New website request',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Subject: ${subject}`,
    `Language: ${language || 'unknown'}`,
    '',
    'Message:',
    message,
    '',
    `Page: ${page || origin}`,
    `Received: ${new Date().toISOString()}`
  ].join('\n');

  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), 10_000);
  try{
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify({
        chat_id:chatId,
        text:telegramText,
        disable_web_page_preview:true
      }),
      signal:controller.signal
    });
    const telegramResult = await telegramResponse.json().catch(()=>null);
    if(!telegramResponse.ok || !telegramResult?.ok){
      console.error('Telegram sendMessage failed.', telegramResponse.status, telegramResult?.description || 'Unknown error');
      return json({ ok:false, error:'Message delivery failed.' }, 502, origin);
    }
    return json({ ok:true }, 200, origin);
  }catch(error){
    console.error('Telegram request failed.', error?.name || 'Error');
    return json({ ok:false, error:'Message delivery failed.' }, 502, origin);
  }finally{
    clearTimeout(timeout);
  }
});
