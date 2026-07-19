const assert = require('node:assert/strict');

const secrets = {
  SITE_ORIGINS:'https://merade.test',
  SUPABASE_ANON_KEY:'test-public-key',
  SUPABASE_PUBLISHABLE_KEYS:'{}',
  TELEGRAM_BOT_TOKEN:'test-bot-token',
  TELEGRAM_CHAT_ID:'-100123456'
};

let handler;
let telegramPayload;
global.Deno = {
  env:{ get:name=>secrets[name] || '' },
  serve:value=>{ handler = value; }
};
global.fetch = async (_url, options)=>{
  telegramPayload = JSON.parse(options.body);
  return new Response(JSON.stringify({ ok:true, result:{ message_id:1 } }), {
    status:200,
    headers:{ 'Content-Type':'application/json' }
  });
};

require('./index.js');

function request(body, origin='https://merade.test', ip='203.0.113.10'){
  return new Request('https://project.supabase.co/functions/v1/contact-telegram', {
    method:'POST',
    headers:{ origin, apikey:'test-public-key', 'content-type':'application/json', 'x-forwarded-for':ip },
    body:JSON.stringify(body)
  });
}

(async()=>{
  const valid = await handler(request({
    name:'Test Client',
    phone:'+213 555 123 456',
    subject:'Ask for visit',
    message:'Please contact me.',
    language:'en',
    page:'https://merade.test/pages/contact.html'
  }));
  assert.equal(valid.status, 200);
  assert.equal((await valid.json()).ok, true);
  assert.equal(telegramPayload.chat_id, '-100123456');
  assert.match(telegramPayload.text, /Test Client/);

  const blockedOrigin = await handler(request({ name:'Test', phone:'+213555123456', subject:'Visit', message:'Hello' }, 'https://evil.test', '203.0.113.11'));
  assert.equal(blockedOrigin.status, 403);

  const invalid = await handler(request({ name:'T', phone:'bad', subject:'', message:'' }, 'https://merade.test', '203.0.113.12'));
  assert.equal(invalid.status, 400);

  telegramPayload = null;
  const honeypot = await handler(request({ name:'Bot', phone:'+213555123456', subject:'Visit', message:'Spam', company:'Filled by bot' }, 'https://merade.test', '203.0.113.13'));
  assert.equal(honeypot.status, 200);
  assert.equal(telegramPayload, null);

  process.stdout.write('contact-telegram tests passed\n');
})().catch(error=>{
  console.error(error);
  process.exitCode = 1;
});

