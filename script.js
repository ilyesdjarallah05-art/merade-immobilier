const STORAGE_KEY = 'meradeImmobilierPropertiesV1';
const HIDDEN_DEFAULTS_KEY = 'meradeHiddenDefaultPropertiesV1';
const ADMIN_FLAG = 'meradeAdminUnlocked';
const ADMIN_CODE = 'Merade2026';
const ROOT = location.pathname.includes('/pages/') || location.pathname.includes('/admin/') ? '../' : './';
let LOCATION_DATA = fallbackLocationData();
let REMOTE_PROPERTIES = null;
let DB_STATUS = 'local';
let ADMIN_EDITING_ID = '';
let ADMIN_EXISTING_IMAGES = [];
let ADMIN_TOUR_ROOMS = [];
let ADMIN_HOTSPOT_ROOM_INDEX = 0;
let ADMIN_SELECTED_POINT = null;
let ADMIN_VIEWER = null;
let ADMIN_ROOM_URLS = [];
let HERO_AUTOPLAY_TIMER = null;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const EXTRA_TRANSLATIONS = {
  en: {
    'search.keyword':'Keyword','search.offerType':'Offer Type','search.type':'Type','search.state':'State','search.price':'Price','search.placeholder':'Search by keyword','search.allTypes':'All types','search.anyPrice':'Any price','cat.land':'Land','cat.offices':'Offices','cat.commercial':'Commercial','section.mustSee.title':'Must-See Properties','section.mustSee.sub':'Explore the most sought-after properties, carefully selected for you.','admin.heroFeatured':'Show in homepage top slider','admin.heroOrder':'Top slider order (1–8)','home.bottom.kicker':'Need help choosing?','home.bottom.title':'Tell us what you need.','home.bottom.sub':'Share your budget, location and property type. Merade Immobilier will guide you to the right option with a clean, direct process.','home.bottom.primary':'Contact us','home.bottom.secondary':'Browse properties'
  },
  fr: {
    'search.keyword':'Mot-clé','search.offerType':'Type d’offre','search.type':'Type','search.state':'Wilaya','search.price':'Prix','search.placeholder':'Rechercher par mot-clé','search.allTypes':'Tous les types','search.anyPrice':'Tous les prix','cat.land':'Terrain','cat.offices':'Bureaux','cat.commercial':'Commercial','section.mustSee.title':'Biens incontournables','section.mustSee.sub':'Découvrez les biens les plus demandés, sélectionnés avec soin pour vous.','admin.heroFeatured':'Afficher dans le slider principal de la page d’accueil','admin.heroOrder':'Ordre du slider principal (1–8)','home.bottom.kicker':'Besoin d’aide pour choisir ?','home.bottom.title':'Dites-nous ce qu’il vous faut.','home.bottom.sub':'Partagez votre budget, la localisation et le type de bien. Merade Immobilier vous guide vers la bonne option avec une démarche simple et directe.','home.bottom.primary':'Contactez-nous','home.bottom.secondary':'Voir les biens'
  },
  ar: {
    'search.keyword':'كلمة البحث','search.offerType':'نوع العرض','search.type':'النوع','search.state':'الولاية','search.price':'السعر','search.placeholder':'ابحث بكلمة مفتاحية','search.allTypes':'كل الأنواع','search.anyPrice':'كل الأسعار','cat.land':'أرض','cat.offices':'مكاتب','cat.commercial':'تجاري','section.mustSee.title':'عقارات لا تفوّت','section.mustSee.sub':'اكتشف أكثر العقارات طلبًا، مختارة بعناية من أجلك.','admin.heroFeatured':'إظهار العقار في السلايدر الرئيسي للصفحة الرئيسية','admin.heroOrder':'ترتيب السلايدر الرئيسي (1–8)','home.bottom.kicker':'تحتاج مساعدة في الاختيار؟','home.bottom.title':'أخبرنا ماذا تحتاج.','home.bottom.sub':'أرسل الميزانية، المكان ونوع العقار. روستم للعقارات يوجهك للخيار المناسب بطريقة بسيطة ومباشرة.','home.bottom.primary':'تواصل معنا','home.bottom.secondary':'تصفح العقارات'
  }
};

Object.assign(EXTRA_TRANSLATIONS.en, {
  'hero.intent.label':'Property actions',
  'hero.intent.buy':'Buy',
  'hero.intent.sell':'Sell',
  'hero.intent.rent':'Rent',
  'section.mustSee.categoriesLabel':'Must-see property categories',
  'home.cities.kicker':'Popular cities',
  'home.cities.title':'Find properties in these cities',
  'home.cities.sub':'Explore properties in the main locations we serve. Choose a city and start browsing.',
  'home.cities.properties':'Properties',
  'home.why.kicker':'Why choose us',
  'home.why.title':'Why choose Merade Immobilier?',
  'home.why.trust.title':'Trusted expertise',
  'home.why.trust.sub':'Clear guidance to connect buyers, renters and owners with confidence.',
  'home.why.offer.title':'A diverse offer',
  'home.why.offer.sub':'Houses, apartments, villas, land and more options for every need.',
  'home.why.personal.title':'Personalized experience',
  'home.why.personal.sub':'Simple tools, useful filters and direct contact for faster decisions.'
});
Object.assign(EXTRA_TRANSLATIONS.fr, {
  'hero.intent.label':'Actions immobilières',
  'hero.intent.buy':'Acheter',
  'hero.intent.sell':'Vendre',
  'hero.intent.rent':'Louer',
  'section.mustSee.categoriesLabel':'Catégories des biens incontournables',
  'home.cities.kicker':'Villes populaires',
  'home.cities.title':'Trouvez des propriétés dans ces villes',
  'home.cities.sub':'Découvrez des biens immobiliers dans les principales localités que nous desservons. Choisissez votre ville et commencez votre exploration.',
  'home.cities.properties':'Propriétés',
  'home.why.kicker':'Pourquoi nous choisir',
  'home.why.title':'Pourquoi choisir Merade Immobilier ?',
  'home.why.trust.title':'Une expertise de confiance',
  'home.why.trust.sub':'Un accompagnement clair pour connecter acheteurs, locataires et propriétaires en confiance.',
  'home.why.offer.title':'Une offre diversifiée',
  'home.why.offer.sub':'Maisons, appartements, villas, terrains et plus d’options pour chaque besoin.',
  'home.why.personal.title':'Une expérience personnalisée',
  'home.why.personal.sub':'Des outils simples, des filtres utiles et un contact direct pour décider plus vite.'
});
Object.assign(EXTRA_TRANSLATIONS.ar, {
  'hero.intent.label':'خدمات العقار',
  'hero.intent.buy':'شراء',
  'hero.intent.sell':'بيع',
  'hero.intent.rent':'كراء',
  'section.mustSee.categoriesLabel':'فئات العقارات التي لا تفوّت',
  'home.cities.kicker':'مدن رائجة',
  'home.cities.title':'اعثر على عقارات في هذه المدن',
  'home.cities.sub':'اكتشف عقارات في أهم المناطق التي نخدمها. اختر المدينة وابدأ التصفح.',
  'home.cities.properties':'عقارات',
  'home.why.kicker':'لماذا تختارنا',
  'home.why.title':'لماذا تختار روستم للعقارات؟',
  'home.why.trust.title':'خبرة موثوقة',
  'home.why.trust.sub':'توجيه واضح يربط المشترين والمستأجرين والمالكين بثقة.',
  'home.why.offer.title':'عروض متنوعة',
  'home.why.offer.sub':'منازل، شقق، فيلات، أراضٍ وخيارات أخرى لكل حاجة.',
  'home.why.personal.title':'تجربة شخصية',
  'home.why.personal.sub':'أدوات بسيطة، فلاتر مفيدة وتواصل مباشر لقرارات أسرع.'
});


Object.assign(EXTRA_TRANSLATIONS.en, {
  'home.latest.kicker':'Latest properties',
  'home.latest.title':'Explore our latest properties',
  'home.latest.sub':'Discover a selection of our latest available properties.',
  'home.latest.view':'View all properties',
  'home.latest.viewSub':'Explore all our offers in one click.',
  'home.handpicked.kicker':'Selected for you',
  'home.handpicked.title':'Discover our handpicked properties',
  'home.handpicked.sub':'A carefully selected collection to meet your real estate expectations. Scroll to explore the best deals.',
  'home.about.kicker':'About us',
  'home.about.titleA':'About',
  'home.about.sub':'Merade Immobilier helps clients in Algeria find clear, verified and well-presented properties with fast contact, modern browsing and simple guidance.',
  'home.about.point1':'Clean property cards',
  'home.about.point2':'Fast filtering',
  'home.about.point3':'360° tours when available',
  'ai.nudge':'Can I help you?',
  'ai.title':'Merade AI',
  'ai.subtitle':'Ask me about buying, renting, budget, location or available listings.',
  'ai.welcome':'Hello! I can help you find a property, compare options, or answer questions about buying and renting in Algeria. Tell me your budget, city and property type.',
  'ai.placeholder':'Write your need…',
  'ai.send':'Send',
  'ai.clear':'Clear',
  'ai.results':'I found these options from our website:',
  'ai.noResults':'I did not find a strong match inside the current website listings. Try adding the city, budget, property type or number of rooms.',
  'ai.onlySite':'No visitor sign-up needed. Property suggestions stay based on this website’s listings.'
});
Object.assign(EXTRA_TRANSLATIONS.fr, {
  'home.latest.kicker':'Dernières annonces',
  'home.latest.title':'Découvrez nos derniers biens',
  'home.latest.sub':'Une sélection de nos biens immobiliers les plus récents.',
  'home.latest.view':'Voir tous les biens',
  'home.latest.viewSub':'Explorez toutes nos offres en un clic.',
  'home.handpicked.kicker':'Sélection pour vous',
  'home.handpicked.title':'Découvrez nos biens sélectionnés',
  'home.handpicked.sub':'Une collection soigneusement choisie pour répondre à vos attentes immobilières. Faites défiler pour voir les meilleures offres.',
  'home.about.kicker':'À propos',
  'home.about.titleA':'À propos de',
  'home.about.sub':'Merade Immobilier aide les clients en Algérie à trouver des biens clairs, vérifiés et bien présentés avec un contact rapide, une navigation moderne et un accompagnement simple.',
  'home.about.point1':'Cartes de biens claires',
  'home.about.point2':'Filtres rapides',
  'home.about.point3':'Visites 360° disponibles',
  'ai.nudge':'Puis-je vous aider ?',
  'ai.title':'Merade AI',
  'ai.subtitle':'Demandez-moi un achat, une location, un budget, une ville ou les annonces disponibles.',
  'ai.welcome':'Bonjour ! Je peux vous aider à trouver un bien, comparer des options ou répondre sur l’achat et la location en Algérie. Indiquez votre budget, la ville et le type de bien.',
  'ai.placeholder':'Écrivez votre besoin…',
  'ai.send':'Envoyer',
  'ai.clear':'Effacer',
  'ai.results':'J’ai trouvé ces options sur notre site :',
  'ai.noResults':'Je n’ai pas trouvé de correspondance forte dans les annonces actuelles. Ajoutez la ville, le budget, le type de bien ou le nombre de pièces.',
  'ai.onlySite':'Aucune inscription visiteur n’est nécessaire. Les suggestions restent basées sur les annonces du site.'
});
Object.assign(EXTRA_TRANSLATIONS.ar, {
  'home.latest.kicker':'أحدث العقارات',
  'home.latest.title':'اكتشف أحدث العقارات لدينا',
  'home.latest.sub':'مجموعة من أحدث العقارات المتوفرة عندنا.',
  'home.latest.view':'عرض كل العقارات',
  'home.latest.viewSub':'تصفح كل العروض بنقرة واحدة.',
  'home.handpicked.kicker':'مختارة لك',
  'home.handpicked.title':'اكتشف عقارات مختارة بعناية',
  'home.handpicked.sub':'مجموعة مختارة لتناسب احتياجاتك العقارية. اسحب لاكتشاف أفضل العروض.',
  'home.about.kicker':'من نحن',
  'home.about.titleA':'حول',
  'home.about.sub':'روستم للعقارات يساعد الزبائن في الجزائر على إيجاد عقارات واضحة، موثوقة ومعروضة بطريقة حديثة مع تواصل سريع وتوجيه بسيط.',
  'home.about.point1':'بطاقات عقارات واضحة',
  'home.about.point2':'فلاتر سريعة',
  'home.about.point3':'جولات 360° عند توفرها',
  'ai.nudge':'هل يمكنني مساعدتك؟',
  'ai.title':'Merade AI',
  'ai.subtitle':'اسألني عن الشراء، الكراء، الميزانية، المدينة أو العقارات المتوفرة.',
  'ai.welcome':'مرحبا! يمكنني مساعدتك في إيجاد عقار، مقارنة الخيارات أو الإجابة عن الشراء والكراء في الجزائر. اكتب الميزانية، المدينة ونوع العقار.',
  'ai.placeholder':'اكتب طلبك…',
  'ai.send':'إرسال',
  'ai.clear':'مسح',
  'ai.results':'وجدت لك هذه الخيارات من موقعنا:',
  'ai.noResults':'لم أجد تطابقًا قويًا داخل العقارات الحالية. أضف المدينة، الميزانية، نوع العقار أو عدد الغرف.',
  'ai.onlySite':'لا يحتاج الزائر إلى تسجيل الدخول. اقتراحات العقارات تبقى مبنية على إعلانات الموقع.'
});

Object.assign(EXTRA_TRANSLATIONS.en, {'home.latest.more':'See more'});
Object.assign(EXTRA_TRANSLATIONS.fr, {'home.latest.more':'Voir plus'});
Object.assign(EXTRA_TRANSLATIONS.ar, {'home.latest.more':'عرض المزيد'});

function extraText(key){
  const lang = typeof currentLang === 'function' ? currentLang() : 'en';
  return EXTRA_TRANSLATIONS[lang]?.[key] || EXTRA_TRANSLATIONS.en[key] || key;
}
function applyExtraTranslations(){
  $$('[data-home-i18n]').forEach(el => { el.textContent = extraText(el.dataset.homeI18n); });
  $$('[data-home-i18n-placeholder]').forEach(el => { el.setAttribute('placeholder', extraText(el.dataset.homeI18nPlaceholder)); });
  $$('[data-home-i18n-aria-label]').forEach(el => { el.setAttribute('aria-label', extraText(el.dataset.homeI18nAriaLabel)); });
}
function bindExtraTranslationRefresh(){
  $$('.language-select').forEach(sel => {
    if(sel.dataset.extraTranslationBound) return;
    sel.dataset.extraTranslationBound = 'yes';
    sel.addEventListener('change', () => setTimeout(applyExtraTranslations, 0));
  });
}


function showPageLoader(){
  if($('#pageLoader')) return;
  const loader = document.createElement('div');
  loader.id = 'pageLoader';
  loader.className = 'page-loader';
  loader.setAttribute('role','status');
  loader.setAttribute('aria-live','polite');
  loader.innerHTML = '<div class="page-loader-inner"><span class="loader-spinner" aria-hidden="true"></span></div>';
  document.body.appendChild(loader);
}
function hidePageLoader(){
  const loader = $('#pageLoader');
  if(!loader) return;
  loader.classList.add('is-hidden');
  setTimeout(()=>loader.remove(), 260);
}

function savedProperties(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function setSavedProperties(items){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function hiddenDefaultIds(){ try { return JSON.parse(localStorage.getItem(HIDDEN_DEFAULTS_KEY)) || []; } catch { return []; } }
function setHiddenDefaultIds(items){ localStorage.setItem(HIDDEN_DEFAULTS_KEY, JSON.stringify(Array.from(new Set(items)))); }
function defaultProperties(){ const hidden = new Set(hiddenDefaultIds()); return MERADE_DEFAULT_PROPERTIES.filter(p => !hidden.has(p.id)); }
function localProperties(){ return [...savedProperties(), ...defaultProperties()].sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)); }
function allProperties(){ return (Array.isArray(REMOTE_PROPERTIES) ? REMOTE_PROPERTIES : localProperties()).sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)); }
function isAdminScreen(){ return Boolean($('#adminList') || $('#loginScreen') || $('#adminApp')); }
async function refreshAdminProperties(){
  if(!window.MeradeDB?.enabled || !window.MeradeDB?.isSignedIn?.()) return false;
  try{
    REMOTE_PROPERTIES = window.MeradeDB.listAdminProperties
      ? await window.MeradeDB.listAdminProperties()
      : await window.MeradeDB.listProperties({ published:false, limit:1000 });
    DB_STATUS = 'connected';
    return true;
  }catch(err){
    console.warn('Supabase admin list failed:', err);
    return false;
  }
}
async function loadDatabaseProperties(){
  if(!window.MeradeDB?.enabled){ DB_STATUS = 'local'; return; }
  try{
    const detailId = $('#propertyDetail') ? new URL(location.href).searchParams.get('id') : '';
    if(detailId && window.MeradeDB.getProperty){
      const one = await window.MeradeDB.getProperty(detailId);
      REMOTE_PROPERTIES = one ? [one] : [];
    } else if(isAdminScreen() && window.MeradeDB.isSignedIn?.()) {
      await refreshAdminProperties();
    } else {
      REMOTE_PROPERTIES = await window.MeradeDB.listProperties({ limit:1000 });
      DB_STATUS = 'connected';
    }
  }catch(err){
    console.warn('Supabase read failed:', err);
    REMOTE_PROPERTIES = null;
    DB_STATUS = 'offline';
  }
}
function usingDatabase(){ return Array.isArray(REMOTE_PROPERTIES) && window.MeradeDB?.enabled; }
function clean(v){ return String(v || '').trim(); }
function safeText(v){ return clean(v).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function safeUrl(v){ const url = clean(v); return /^https?:\/\//i.test(url) ? url.replace(/"/g,'%22') : ''; }
function imageSrc(v){
  let url = clean(v);
  if(!url) return '';
  if(/^(javascript:|vbscript:|data:(?!image\/))/i.test(url)) return '';
  if(window.MeradeDB?.enabled && /^(photos|tours)\//i.test(url)){
    url = window.MeradeDB.publicStorageUrl(url);
  }
  return url.replace(/"/g,'%22');
}
function extractImageList(value){
  if(!value) return [];
  if(Array.isArray(value)) return value.flatMap(extractImageList);
  if(typeof value === 'object') return extractImageList(value.url || value.src || value.publicUrl || value.path || value.image);
  const raw = clean(value);
  if(!raw) return [];
  if((raw.startsWith('[') || raw.startsWith('{'))){
    try { return extractImageList(JSON.parse(raw)); } catch {}
  }
  return raw.split(/\s*,\s*/).filter(Boolean);
}
function firstImage(p){
  const candidates = [p?.images, p?.image, p?.mainImage, p?.coverImage, p?.photo, p?.photos, p?.gallery].flatMap(extractImageList);
  return imageSrc(candidates.find(Boolean) || '');
}
function cssUrl(v){ return imageSrc(v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n|\r/g,''); }
function propertyUrl(id){ return `${ROOT}pages/property.html?id=${encodeURIComponent(id)}`; }
function langLocale(){ return currentLang()==='ar' ? 'ar-DZ' : currentLang()==='fr' ? 'fr-DZ' : 'en-DZ'; }
function formatPrice(p){ const n = Number(String(p||'').replace(/\s/g,'')); return Number.isNaN(n) ? safeText(p) : new Intl.NumberFormat(langLocale()).format(n); }
const STANDARD_FEATURE_GROUPS = [
  { key:'amenities', items:[
    {key:'semiFurnished',icon:'sofa',aliases:['Semi-Furnished','Semi-meublé','شبه مفروش','نصف مفروشة']},
    {key:'heating',icon:'heating',aliases:['Chauffage central','Central heating','التدفئة المركزية']},
    {key:'airConditioning',icon:'airConditioning',aliases:['Climatiseur','Climatiseurs','Air conditioner','تكييف','مكيفات الهواء']},
    {key:'intercom',aliases:['Interphone','هاتف داخلي']},
    {key:'elevator',icon:'elevator',aliases:['Ascenseur','Lift','مصعد']},
    {key:'parking',icon:'parking',aliases:['Car park','Stationnement','موقف سيارات']},
    {key:'garage',icon:'garage',aliases:['Garage','مرآب']},
    {key:'equippedKitchen',aliases:['Cuisine équipée','Fitted kitchen','مطبخ مجهز']},
    {key:'balcony',aliases:['Balcon','Terrasse','Balcony','شرفة']},
    {key:'garden',aliases:['Jardin','Garden','حديقة']}
  ]},
  { key:'security', items:[
    {key:'alarm',aliases:['Alarme','Alarm','نظام إنذار']},
    {key:'gatedResidence',icon:'security',aliases:['Résidence fermée','Gated community','إقامة مغلقة']},
    {key:'videoSurveillance',icon:'camera',aliases:['Vidéo surveillance','CCTV','Caméras de surveillance','مراقبة بالفيديو','كاميرات المراقبة']},
    {key:'guard',icon:'guard',aliases:['Gardien','Gardiennage','Caretaker','حراسة','حارس']}
  ]},
  { key:'building', items:[
    {key:'modernBuilding',aliases:['Bâtiment moderne','Modern building','مبنى حديث']},
    {key:'thermalInsulation',aliases:['Isolation thermique','Thermal insulation','عزل حراري','العزل الحراري']},
    {key:'acousticInsulation',aliases:['Isolation acoustique','Acoustic insulation','Sound insulation','عزل صوتي','العزل الصوتي']}
  ]}
];
const STANDARD_FEATURES = STANDARD_FEATURE_GROUPS.flatMap(group => group.items);
const STANDARD_FEATURE_BY_KEY = Object.fromEntries(STANDARD_FEATURES.map(item => [item.key,item]));
function normalizeFeatureText(value){
  return clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’'\-_/]+/g,' ').replace(/\s+/g,' ').trim();
}
function standardFeatureKeyForText(value){
  const normalized = normalizeFeatureText(value);
  if(!normalized) return '';
  return STANDARD_FEATURES.find(item => {
    const labels = [...(item.aliases || []), ...['en','fr','ar'].map(lang => I18N?.[lang]?.[`feature.${item.key}`])];
    return labels.some(label => normalizeFeatureText(label) === normalized);
  })?.key || '';
}
function propertyFeatureKeys(p){
  const explicit = Array.isArray(p?.featureKeys) ? p.featureKeys : [];
  const translated = Object.values(p?.translations || {}).flatMap(value => Array.isArray(value?.features) ? value.features : []);
  const inferred = [...(p?.features || []),...translated].map(standardFeatureKeyForText).filter(Boolean);
  return Array.from(new Set([...explicit,...inferred])).filter(key => STANDARD_FEATURE_BY_KEY[key]);
}
function localizedStandardFeature(key){ return t(`feature.${key}`); }
function localizedCustomFeatures(p){
  const localized = localizedPropertyValue(p, 'features');
  const source = Array.isArray(p?.features) ? p.features : [];
  return (Array.isArray(localized) ? localized : []).filter((value,index) => !standardFeatureKeyForText(value) && !standardFeatureKeyForText(source[index]));
}
function localizedPropertyValue(p, field){
  const translated = p?.translations?.[currentLang()]?.[field];
  if(field === 'features') return Array.isArray(translated) && translated.length ? translated : (Array.isArray(p?.features) ? p.features : []);
  return clean(translated) || clean(p?.[field]);
}
function propertyTitle(p){ return localizedPropertyValue(p, 'title') || 'Property'; }
function propertyDescription(p){ return localizedPropertyValue(p, 'description'); }
function propertyFeatures(p){
  const combined = [...propertyFeatureKeys(p).map(localizedStandardFeature),...localizedCustomFeatures(p)];
  const seen = new Set();
  return combined.filter(value => { const key = normalizeFeatureText(value); if(!key || seen.has(key)) return false; seen.add(key); return true; });
}
function propertySearchText(p){
  const translated = Object.values(p?.translations || {}).flatMap(value => [value?.title, value?.description, ...(Array.isArray(value?.features) ? value.features : [])]);
  const standardLabels = propertyFeatureKeys(p).flatMap(key => ['en','fr','ar'].map(lang => I18N?.[lang]?.[`feature.${key}`]));
  return [p?.title,p?.description,...(p?.features || []),...translated,...standardLabels].filter(Boolean).join(' ');
}
function compactPriceParts(p){
  const raw = Number(String(p?.price ?? '').replace(/\s/g,''));
  if(!Number.isFinite(raw)) return { amount:p?.price || '', unit:clean(p?.currency) || 'Md', dzd:0 };
  const currency = clean(p?.currency);
  if(currency === 'Md') return { amount:raw, unit:'Md', dzd:raw * 10000000 };
  if(currency === 'm') return { amount:raw, unit:'m', dzd:raw * 10000 };
  // Legacy DZD records are converted for display without changing stored data.
  if(/^DZD/i.test(currency) || !currency){
    return raw >= 10000000
      ? { amount:raw / 10000000, unit:'Md', dzd:raw }
      : { amount:raw / 10000, unit:'m', dzd:raw };
  }
  return { amount:raw, unit:currency, dzd:raw };
}
function propertyPriceText(p){
  if(clean(p?.price) === '') return '';
  const parts = compactPriceParts(p);
  const price = `${formatPrice(parts.amount)} ${safeText(parts.unit === 'Md' ? 'Md' : 'm')}`;
  const period = rentalPeriodLabel(p);
  return period ? `${price} / ${safeText(period)}` : price;
}
function rentalPeriodValue(p){
  if(clean(p?.status).toLowerCase() !== 'rent') return '';
  const period = clean(p?.rentPeriod || p?.rentalPeriod || p?.rental_period).toLowerCase();
  return ['night','day','month','year'].includes(period) ? period : 'month';
}
function rentalPeriodLabel(p){
  const period = rentalPeriodValue(p);
  return period ? t(`rent.period.${period}.short`) : '';
}
function propertyPriceInDzd(p){ return compactPriceParts(p).dzd; }
function statusLabel(status){ return status === 'rent' ? t('card.forRent') : status === 'new' ? t('card.new') : t('card.forSale'); }
function catLabel(cat){
  const keys = {
    estates:'cat.estates', houses:'cat.houses', apartments:'cat.apartments', villas:'cat.villas',
    land:'cat.land', offices:'cat.offices', commercial:'cat.commercial', studio:'cat.studio',
    loft:'cat.loft', building:'cat.building', duplex:'cat.duplex',
    'country-property':'cat.countryProperty', triplex:'cat.triplex',
    'commercial-premises':'cat.commercialPremises', ranch:'cat.ranch',
    'commercial-apartment':'cat.commercialApartment',
    'commercial-building':'cat.commercialBuilding', hotel:'cat.hotel',
    'tourist-complex':'cat.touristComplex'
  };
  return t(keys[cat] || 'cat.estates');
}
function statusTypeLabel(p){ return `${statusLabel(p?.status)} · ${catLabel(p?.category)}`; }
function propertyLocation(p){ return [p?.commune, wilayaDisplay(p?.wilaya)].filter(Boolean).map(safeText).join(', ') || safeText(p?.address || 'Algeria'); }
function cardIcon(name){
  const icons = {
    pin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Zm0-8.5A3.5 3.5 0 1 1 12 6a3.5 3.5 0 0 1 0 7.5Z"/></svg>',
    bed:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11V5h2v5h6V7h6a4 4 0 0 1 4 4v7h-2v-3H5v3H3v-7Zm2 2h14v-2a2 2 0 0 0-2-2h-4v3H5v1Z"/></svg>',
    bath:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4a3 3 0 0 1 6 0v5h8v2h-1l-1 5a5 5 0 0 1-4.9 4H9.9A5 5 0 0 1 5 16l-1-5H3V9h8V4a1 1 0 1 0-2 0v1H7V4Zm-.9 7 .8 4.6A3 3 0 0 0 9.9 18h4.2a3 3 0 0 0 3-2.4l.8-4.6H6.1Z"/></svg>',
    area:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v2H6v5H4V4Zm14 2h-5V4h7v7h-2V6ZM6 13v5h5v2H4v-7h2Zm14 0v7h-7v-2h5v-5h2Z"/></svg>'
  };
  return icons[name] || '';
}
function featureIcon(name){
  const icons = {
    sofa:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M4 11a2 2 0 0 0-2 2v5h20v-5a2 2 0 0 0-4 0v1H6v-1a2 2 0 0 0-2-2Zm1 7v2m14-2v2"/></svg>',
    heating:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-4-2.4-7.3-6.2-11.8.2 3-1.1 5.1-3 7.1C8.3 12 7 13.5 7 16a5 5 0 0 0 5 6Zm0-3a2.7 2.7 0 0 1-2.7-2.7c0-1.3.7-2.2 1.6-3.2.8-.9 1.5-1.8 1.5-3.1 1.6 2 2.4 3.7 2.4 5.5A2.8 2.8 0 0 1 12 19Z"/></svg>',
    airConditioning:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M4.2 6.5l15.6 11M19.8 6.5l-15.6 11M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4 1-1-4m13 7-4-1 1 4m3-7-4 1 1-4M4 14l4-1-1 4"/></svg>',
    elevator:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 22V2h14v20M9 18V8h6v10M8 6l4-3 4 3M8 20l4 3 4-3"/></svg>',
    parking:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V3h7a5 5 0 0 1 0 10H6m0-8h7a3 3 0 0 1 0 6H6"/></svg>',
    garage:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V8l9-5 9 5v13M6 21V10h12v11M6 14h12M9 17h6"/></svg>',
    security:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm-3-11 2 2 4-4"/></svg>',
    camera:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h13v11H3zM16 10l5-3v11l-5-3M7 11h5"/></svg>',
    guard:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 12.5-6.6M18 22s4-2 4-5.5V14l-4-1.5-4 1.5v2.5C14 20 18 22 18 22Z"/></svg>'
  };
  return icons[name] || '';
}
function propertyFeatureListItem(value){
  const key = standardFeatureKeyForText(value);
  const icon = featureIcon(STANDARD_FEATURE_BY_KEY[key]?.icon);
  return `<li class="property-feature-item${icon ? ' has-feature-icon' : ''}">${icon ? `<span class="property-feature-icon">${icon}</span>` : ''}<span>${safeText(value)}</span></li>`;
}
function wilayaDisplay(value){
  const code = clean(value).split(' - ')[0];
  const w = LOCATION_DATA.wilayas.find(x => x.code === code);
  return w ? `${w.code} - ${locationLabel(w, currentLang())}` : safeText(value);
}


function roomHotspotTooltip(hotSpotDiv, args){
  hotSpotDiv.classList.add('room-hotspot');
  const label = document.createElement('span');
  label.className = 'room-hotspot-label';
  label.textContent = clean(args?.text || args || 'Room');
  hotSpotDiv.appendChild(label);
}

function normalizeHotspots(list){
  return (Array.isArray(list) ? list : []).map(h => {
    const pitch = Number(h.pitch), yaw = Number(h.yaw), targetRoom = Number(h.targetRoom);
    return { pitch, yaw, text: clean(h.text) || 'Go', targetRoom: Number.isFinite(targetRoom) ? targetRoom : 0 };
  }).filter(h => Number.isFinite(h.pitch) && Number.isFinite(h.yaw));
}
function normalizeTourRooms(p){
  const rawRooms = Array.isArray(p?.virtualTourRooms) ? p.virtualTourRooms : (Array.isArray(p?.virtual_tour_rooms) ? p.virtual_tour_rooms : []);
  const translatedNames = Array.isArray(p?.translations?.[currentLang()]?.tourRooms) ? p.translations[currentLang()].tourRooms : [];
  return rawRooms.map((r,i)=>({
    room:clean(translatedNames[i]) || clean(r.room) || `${t('detail.tourRoom')} ${i+1}`,
    image: imageSrc(r.image),
    hotspots: normalizeHotspots(r.hotspots)
  })).filter(r=>r.image);
}
function hasVirtualTour(p){
  return Boolean(
    truthyFlag(p?.hasVirtualTour) ||
    truthyFlag(p?.has_virtual_tour) ||
    clean(p?.virtualTourUrl) ||
    clean(p?.virtual_tour_url) ||
    normalizeTourRooms(p).length
  );
}
function roomNamesFromText(text){ return clean(text).split(/\n|,/).map(clean).filter(Boolean); }
function fileToDataUrl(file){ return new Promise((resolve,reject)=>{ const reader = new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=reject; reader.readAsDataURL(file); }); }
async function filesToUrls(files, folder){
  const list = Array.from(files || []);
  if(!list.length) return [];
  if(window.MeradeDB?.enabled && window.MeradeDB?.isSignedIn?.()){
    const uploaded = await window.MeradeDB.uploadFiles(list, folder);
    return uploaded.map(item => item.publicUrl);
  }
  return Promise.all(list.map(fileToDataUrl));
}
async function roomImageToUrl(room){
  if(room.file){
    if(window.MeradeDB?.enabled && window.MeradeDB?.isSignedIn?.()){
      const uploaded = await window.MeradeDB.uploadFile(room.file, 'tours');
      return uploaded.publicUrl;
    }
    return await fileToDataUrl(room.file);
  }
  return imageSrc(room.image);
}

function populateWilayaSelect(sel){
  const first = sel.querySelector('option')?.outerHTML || '';
  const current = sel.value;
  sel.innerHTML = first + LOCATION_DATA.wilayas.map(w=>`<option value="${safeText(wilayaValue(w))}">${safeText(w.code)} - ${safeText(locationLabel(w,currentLang()))}</option>`).join('');
  if(current) sel.value = current;
}
function fillWilayaSelects(){ $$('[data-wilayas]').forEach(populateWilayaSelect); }
function communeListForWilaya(wilaya){ return LOCATION_DATA.communesByWilaya[wilaya] || []; }
function fillCommuneControl(control, wilaya, selected=''){
  if(!control) return;
  const list = communeListForWilaya(wilaya);
  const isDatalist = control.tagName === 'DATALIST';
  if(isDatalist){
    control.innerHTML = list.map(c=>`<option value="${safeText(c.fr)}">${safeText(locationLabel(c,currentLang()))}</option>`).join('');
    return;
  }
  const firstLabel = wilaya ? t('search.allAreas') : t('filter.areaDisabled');
  control.innerHTML = `<option value="">${safeText(firstLabel)}</option>` + list.map(c=>`<option value="${safeText(c.fr)}">${safeText(locationLabel(c,currentLang()))}</option>`).join('');
  control.disabled = !wilaya;
  if(selected) control.value = selected;
}
function bindLocationControls(){
  $$('[data-wilaya-source]').forEach(wilayaSel => {
    const target = $(wilayaSel.dataset.wilayaSource);
    const update = () => fillCommuneControl(target, wilayaSel.value, target?.dataset.keepValue || '');
    if(target) { update(); wilayaSel.addEventListener('change', update); }
  });
  $$('[data-communes-for]').forEach(control => {
    const source = $(control.dataset.communesFor);
    if(source) fillCommuneControl(control, source.value);
  });
}

function initNav(){
  const nav = $('#nav');
  if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});
  const menu = $('#menuBtn');
  const links = $('#navLinks');
  if(menu && links) menu.addEventListener('click',()=>{
    links.classList.toggle('open');
    menu.classList.toggle('open');
    menu.textContent = links.classList.contains('open') ? t('nav.close') : t('nav.menu');
  });
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('[data-page]').forEach(a => { if(a.dataset.page === current || (current === 'index.html' && a.dataset.page === 'home')) a.classList.add('active'); });
}
function initReveal(){
  const items = $$('.reveal');
  if(!items.length) return;
  const obs = new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); }),{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  items.forEach((el,i)=>{ el.style.transitionDelay = `${Math.min(i%8,5)*55}ms`; obs.observe(el); });
}
function initCardMotion(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  $$('.property-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX-r.left)/r.width)*100}%`);
      card.style.setProperty('--my', `${((e.clientY-r.top)/r.height)*100}%`);
    });
  });
}

function initStatCounters(){
  const counters = $$('[data-count-to]');
  if(!counters.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const valueText = (counter, value) => `${counter.dataset.countPrefix || ''}${value}${counter.dataset.countSuffix || ''}`;
  const finish = counter => {
    counter.textContent = valueText(counter, Number(counter.dataset.countTo || 0));
    counter.classList.remove('is-counting');
    counter.dataset.counted = 'yes';
  };
  const run = counter => {
    if(counter.dataset.counted === 'yes') return;
    const from = Number(counter.dataset.countFrom || 0);
    const to = Number(counter.dataset.countTo || 0);
    if(reducedMotion){ finish(counter); return; }
    counter.dataset.counted = 'yes';
    counter.classList.add('is-counting');
    const startedAt = performance.now();
    const duration = 1100;
    const tick = now => {
      const progress = clampUnit((now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(from + (to - from) * eased);
      counter.textContent = valueText(counter, value);
      if(progress < 1) requestAnimationFrame(tick);
      else finish(counter);
    };
    requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      $$('.stat-count', entry.target).forEach(run);
      observer.unobserve(entry.target);
    });
  }, { threshold:.3 });
  if(!reducedMotion) counters.forEach(counter => { counter.textContent = valueText(counter, Number(counter.dataset.countFrom || 0)); });
  const stats = $('.stats');
  if(stats) observer.observe(stats);
  else counters.forEach(run);
}

let PANNELLUM_LOAD_PROMISE = null;
function loadPannellumAssets(){
  if(window.pannellum) return Promise.resolve(true);
  if(PANNELLUM_LOAD_PROMISE) return PANNELLUM_LOAD_PROMISE;
  PANNELLUM_LOAD_PROMISE = new Promise((resolve, reject)=>{
    if(!document.querySelector('link[data-pannellum-css]')){
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      link.dataset.pannellumCss = 'true';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Could not load 360 viewer. Check your internet connection.'));
    document.body.appendChild(script);
  });
  return PANNELLUM_LOAD_PROMISE;
}

function buildCard(p){
  const img = firstImage(p);
  const price = propertyPriceText(p);
  const roomsValue = p.bedrooms || p.rooms;
  const areaValue = p.surface || p.landSurface;
  const has360 = hasVirtualTour(p);
  const meta = [
    roomsValue && { icon:'bed', text: safeText(roomsValue) },
    p.bathrooms && { icon:'bath', text: safeText(p.bathrooms) },
    areaValue && { icon:'area', text: `${safeText(areaValue)} ${safeText(t('card.surface'))}` }
  ].filter(Boolean).map(m=>`<span>${cardIcon(m.icon)}${m.text}</span>`).join('');
  return `<article class="property-card reveal ${has360 ? 'has-360' : ''}" data-category="${safeText(p.category)}" data-status="${safeText(p.status)}" data-wilaya="${safeText(p.wilaya)}" data-commune="${safeText(p.commune)}">
    <a href="${propertyUrl(p.id)}" class="prop-media" aria-label="${safeText(t('card.details'))}">
      ${img ? `<img src="${img}" alt="${safeText(propertyTitle(p))}" loading="lazy">` : '<div class="no-img"></div>'}
      <span class="badge ${p.status==='rent'?'rent':p.status==='new'?'new':''}">${safeText(statusTypeLabel(p))}</span>
      ${has360 ? `<span class="tour-pill" aria-label="${safeText(t('card.tour'))}">${safeText(t('card.tour'))}</span>` : ''}
      <span class="explore-dot">${safeText(t('card.details'))} →</span>
    </a>
    <div class="prop-body">
      <div class="prop-topline"><span>${safeText(statusTypeLabel(p))}</span><span>${safeText(wilayaDisplay(p.wilaya))}</span></div>
      <h3 class="prop-title">${safeText(propertyTitle(p))}</h3>
      <p class="location prop-location-line">${cardIcon('pin')}<span>${propertyLocation(p)}</span></p>
      ${price ? `<p class="price">${price}</p>` : ''}
      ${meta ? `<div class="meta icon-meta">${meta}</div>` : ''}
    </div>
  </article>`;
}
function renderCards(container, properties){
  if(!container) return;
  container.innerHTML = properties.length ? properties.map(buildCard).join('') : `<div class="empty">${safeText(t('empty'))}</div>`;
  initReveal(); initCardMotion();
}


function truthyFlag(v){
  return v === true || v === 1 || ['true','1','yes','on'].includes(String(v || '').toLowerCase());
}
function heroOrderValue(p){
  const n = Number(p?.heroOrder);
  return Number.isInteger(n) && n >= 1 && n <= 8 ? n : null;
}
function uniqueProperties(list){
  const seen = new Set();
  return list.filter(p => {
    const key = clean(p?.id) || clean(p?.title) || JSON.stringify(p);
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function heroSliderProperties(){
  const items = uniqueProperties(allProperties());
  const byOrder = list => [...list].sort((a,b)=>{
    const ao = heroOrderValue(a) ?? 999, bo = heroOrderValue(b) ?? 999;
    if(ao !== bo) return ao - bo;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
  const newest = list => [...list].sort((a,b)=>new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const isSelected = p => p && (truthyFlag(p.heroFeatured) || truthyFlag(p.showInHero) || truthyFlag(p.homeHero));
  const hasHeroImage = p => Boolean(firstImage(p));

  const selectedRaw = byOrder(items.filter(isSelected));

  // Admin-selected slider is now strict and predictable:
  // property must be selected, have order 1–8, and have an image.
  // This prevents old/empty selected rows from creating white slides.
  const selectedWithOrderAndImage = selectedRaw.filter(p => heroOrderValue(p) && hasHeroImage(p)).slice(0,8);
  if(selectedWithOrderAndImage.length){
    window.__meradeHeroDebug = { mode:'admin_ordered', count:selectedWithOrderAndImage.length, selectedInDatabase:selectedRaw.length, items:selectedWithOrderAndImage.map(p=>({id:p.id,title:p.title,heroFeatured:p.heroFeatured,heroOrder:p.heroOrder,image:firstImage(p)})) };
    return selectedWithOrderAndImage;
  }

  // If there are selected rows but no valid ordered image rows, do NOT complete to 8.
  // Show only selected rows that actually have images.
  if(selectedRaw.length){
    const selectedWithImage = selectedRaw.filter(hasHeroImage).slice(0,8);
    window.__meradeHeroDebug = { mode:'admin_selected_without_valid_order', count:selectedWithImage.length, selectedInDatabase:selectedRaw.length, items:selectedWithImage.map(p=>({id:p.id,title:p.title,heroFeatured:p.heroFeatured,heroOrder:p.heroOrder,image:firstImage(p)})) };
    return selectedWithImage;
  }

  // Only when the admin selected nothing, use a safe fallback list with images.
  const fallback = newest(items.filter(hasHeroImage)).slice(0,8);
  window.__meradeHeroDebug = { mode:'fallback_no_admin_selection', count:fallback.length, selectedInDatabase:0, items:fallback.map(p=>({id:p.id,title:p.title,heroFeatured:p.heroFeatured,heroOrder:p.heroOrder,image:firstImage(p)})) };
  return fallback;
}
function heroBackgroundImage(p){
  const img = firstImage(p);
  return cssUrl(img || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=80');
}
function buildHeroSlide(p, index){
  const img = heroBackgroundImage(p);
  const price = propertyPriceText(p);
  const roomsValue = p.bedrooms || p.rooms;
  const areaValue = p.surface || p.landSurface;
  const details = [
    roomsValue && `${cardIcon('bed')}<span>${safeText(roomsValue)}</span>`,
    p.bathrooms && `${cardIcon('bath')}<span>${safeText(p.bathrooms)}</span>`,
    areaValue && `${cardIcon('area')}<span>${safeText(areaValue)} ${safeText(t('card.surface'))}</span>`
  ].filter(Boolean).map(x=>`<span>${x}</span>`).join('');
  return `<article class="home-slide ${index===0?'active':''}" style="background-image:url('${img}')">
    <div class="container home-slide-content">
      <a class="hero-property-card" href="${propertyUrl(p.id)}">
        <p class="hero-status">${safeText(statusTypeLabel(p))}</p>
        <h1>${safeText(propertyTitle(p))}${price ? ` | ${price}` : ''}</h1>
        ${details ? `<div class="hero-specs">${details}</div>` : ''}
        <p class="hero-place">${cardIcon('pin')}<span>${propertyLocation(p)}</span></p>
        ${price ? `<p class="hero-price">${price}</p>` : ''}
      </a>
    </div>
  </article>`;
}
function initHeroSlider(){
  const slider = $('#homeSlider');
  if(!slider) return;
  const dotsWrap = $('#heroDots');
  const items = heroSliderProperties();
  if(HERO_AUTOPLAY_TIMER) clearInterval(HERO_AUTOPLAY_TIMER);
  if(!items.length){ slider.innerHTML = ''; if(dotsWrap) dotsWrap.innerHTML = ''; return; }
  slider.innerHTML = items.map(buildHeroSlide).join('');
  if(dotsWrap) dotsWrap.innerHTML = items.map((_,i)=>`<button class="hero-dot ${i===0?'active':''}" type="button" aria-label="Go to property ${i+1}" data-hero-dot="${i}"></button>`).join('');
  const slides = $$('.home-slide', slider);
  const dots = $$('[data-hero-dot]');
  let index = 0;
  function go(next){
    index = (next + slides.length) % slides.length;
    const direction = document.documentElement.dir === 'rtl' ? 1 : -1;
    const slideWidth = slides[0]?.offsetWidth || slider.parentElement?.clientWidth || window.innerWidth;
    slider.style.transform = `translateX(${direction * index * slideWidth}px)`;
    slides.forEach((slide,i)=>slide.classList.toggle('active', i === index));
    dots.forEach((dot,i)=>dot.classList.toggle('active', i === index));
  }
  $('#heroPrev') && ($('#heroPrev').onclick = () => go(index - 1));
  $('#heroNext') && ($('#heroNext').onclick = () => go(index + 1));
  dots.forEach(dot=>dot.onclick = () => go(Number(dot.dataset.heroDot)));
  if(slides.length > 1){
    HERO_AUTOPLAY_TIMER = setInterval(()=>go(index + 1), 5200);
    const hero = $('#homeHero');
    if(hero){
      hero.onmouseenter = () => HERO_AUTOPLAY_TIMER && clearInterval(HERO_AUTOPLAY_TIMER);
      hero.onmouseleave = () => { HERO_AUTOPLAY_TIMER && clearInterval(HERO_AUTOPLAY_TIMER); HERO_AUTOPLAY_TIMER = setInterval(()=>go(index + 1), 5200); };
    }
  }
}
function clampUnit(value){
  return Math.max(0, Math.min(1, value));
}
function initHeroScrollScene(){
  const hero = $('#homeHero');
  if(!hero || hero.dataset.scrollSceneReady === 'true') return;
  hero.dataset.scrollSceneReady = 'true';
  hero.classList.add('hero-scroll-scene');

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let frame = 0;
  const render = () => {
    frame = 0;
    if(reducedMotion){
      hero.style.setProperty('--hero-copy-opacity', '1');
      hero.style.setProperty('--hero-copy-shift', '0px');
      hero.style.setProperty('--hero-controls-opacity', '1');
      hero.style.setProperty('--hero-search-opacity', '1');
      return;
    }
    const bounds = hero.getBoundingClientRect();
    const range = Math.max(1, hero.offsetHeight - window.innerHeight);
    const progress = clampUnit(-bounds.top / range);
    const copyOpacity = 1 - clampUnit(progress / .34);
    const controlsOpacity = 1 - clampUnit(progress / .26);
    const searchOpacity = 1 - clampUnit((progress - .52) / .30);
    hero.style.setProperty('--hero-copy-opacity', copyOpacity.toFixed(3));
    hero.style.setProperty('--hero-copy-shift', `${Math.round(progress * -44)}px`);
    hero.style.setProperty('--hero-controls-opacity', controlsOpacity.toFixed(3));
    hero.style.setProperty('--hero-search-opacity', searchOpacity.toFixed(3));
    hero.classList.toggle('hero-search-hidden', searchOpacity < .05);
  };
  const requestRender = () => {
    if(!frame) frame = requestAnimationFrame(render);
  };
  window.addEventListener('scroll', requestRender, { passive:true });
  window.addEventListener('resize', requestRender, { passive:true });
  render();
}
function initScrollInkTitles(){
  const selector = [
    '.must-see-section .title',
    '.home-latest-section .title',
    '.home-handpicked-section .title',
    '.home-about-modern-section .title',
    'main > .section:not(.home-bottom-cta) > .container > .title',
    '.home-cities-section .title',
    '.home-why-section .title'
  ].join(',');
  const targets = $$(selector).filter((target, index, all) => all.indexOf(target) === index && !target.dataset.inkReady);
  if(!targets.length) return;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const entries = targets.map(target => {
    target.dataset.inkReady = 'true';
    const textNodes = [];
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        return clean(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    while(walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(part => {
        if(!part) return;
        if(/^\s+$/.test(part)) fragment.appendChild(document.createTextNode(part));
        else {
          const word = document.createElement('span');
          word.className = 'scroll-ink-word';
          word.textContent = part;
          fragment.appendChild(word);
        }
      });
      node.replaceWith(fragment);
    });
    target.classList.add('scroll-ink-title');
    return { target, words: $$('.scroll-ink-word', target), activeWords:-1 };
  });

  let frame = 0;
  const render = () => {
    frame = 0;
    entries.forEach(entry => {
      const { target, words } = entry;
      const bounds = target.getBoundingClientRect();
      const progress = reducedMotion ? 1 : clampUnit((window.innerHeight * .88 - bounds.top) / (window.innerHeight * .48));
      const activeWords = Math.ceil(progress * words.length);
      if(activeWords === entry.activeWords) return;
      entry.activeWords = activeWords;
      words.forEach((word, index) => word.classList.toggle('inked', index < activeWords));
    });
  };
  const requestRender = () => {
    if(!frame) frame = requestAnimationFrame(render);
  };
  window.addEventListener('scroll', requestRender, { passive:true });
  window.addEventListener('resize', requestRender, { passive:true });
  render();
}
function initListings(){
  const grid = $('#listingsGrid'); if(!grid) return;
  const fixedCategory = grid.dataset.category || '';
  const limit = Number(grid.dataset.limit || 0);
  const featuredOnly = grid.dataset.featured === 'true';
  const featuredPriority = grid.dataset.featured === 'priority';
  const categoryTabs = $$('[data-must-see-category]');
  const categoryTabList = categoryTabs[0]?.closest('.must-see-category-tabs');
  const moveCategoryIndicator = tab => {
    if(!categoryTabList || !tab) return;
    const listBounds = categoryTabList.getBoundingClientRect();
    const tabBounds = tab.getBoundingClientRect();
    categoryTabList.style.setProperty('--category-indicator-x', `${tabBounds.left - listBounds.left}px`);
    categoryTabList.style.setProperty('--category-indicator-width', `${tabBounds.width}px`);
    categoryTabList.classList.add('indicator-ready');
  };
  const activeMustSeeCategory = () => categoryTabs.find(tab => tab.classList.contains('active'))?.dataset.mustSeeCategory || '';
  const apply = () => {
    const q = clean($('#searchText')?.value).toLowerCase();
    const status = $('#filterStatus')?.value || '';
    const cat = fixedCategory || activeMustSeeCategory() || ($('#filterCategory')?.value || new URL(location.href).searchParams.get('category') || '');
    const wilaya = $('#filterWilaya')?.value || '';
    const commune = $('#filterCommune')?.value || '';
    const maxPrice = Number(new URL(location.href).searchParams.get('maxPrice') || 0);
    let items = allProperties().filter(p => {
      const hay = [propertySearchText(p),p.wilaya,p.commune,p.address,catLabel(p.category),statusTypeLabel(p)].join(' ').toLowerCase();
      const priceValue = propertyPriceInDzd(p);
      const priceOk = !maxPrice || (!Number.isNaN(priceValue) && priceValue <= maxPrice);
      return (!q || hay.includes(q)) && (!status || p.status === status) && (!cat || p.category === cat) && (!wilaya || p.wilaya === wilaya) && (!commune || p.commune === commune) && priceOk && (!featuredOnly || p.featured);
    });
    if(featuredPriority) items.sort((a,b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));
    if(limit) items = items.slice(0, limit);
    renderCards(grid, items);
  };
  if(!grid.dataset.filtersBound){
    ['input','change'].forEach(ev=>$$('[data-filter]').forEach(el=>el.addEventListener(ev, apply)));
    $$('#quickChips .chip').forEach(chip=>chip.addEventListener('click',()=>{ $$('#quickChips .chip').forEach(c=>c.classList.remove('active')); chip.classList.add('active'); const target = chip.dataset.status || ''; const statusInput = $('#filterStatus'); if(statusInput) statusInput.value = target; apply(); }));
    categoryTabs.forEach((tab,index) => {
      tab.addEventListener('click',()=>{
        categoryTabs.forEach(item => { const active = item === tab; item.classList.toggle('active', active); item.setAttribute('aria-selected', String(active)); });
        moveCategoryIndicator(tab);
        apply();
      });
      tab.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const next = categoryTabs[(index + direction + categoryTabs.length) % categoryTabs.length];
        next.focus(); next.click();
      });
    });
    window.addEventListener('resize', () => moveCategoryIndicator(categoryTabs.find(tab => tab.classList.contains('active'))), { passive:true });
    grid.dataset.filtersBound = 'yes';
  }
  requestAnimationFrame(() => moveCategoryIndicator(categoryTabs.find(tab => tab.classList.contains('active'))));
  apply();
}
function initSearchBox(){
  const btn = $('#homeSearchBtn'); if(!btn) return;
  btn.addEventListener('click',()=>{
    const params = new URLSearchParams();
    const q = clean($('#homeSearch')?.value); const status = $('#homeStatus')?.value; const category = $('#homeCategory')?.value; const wilaya = $('#homeWilaya')?.value; const price = $('#homePrice')?.value;
    if(q) params.set('q', q); if(status) params.set('status', status); if(category) params.set('category', category); if(wilaya) params.set('wilaya', wilaya); if(price) params.set('maxPrice', price);
    location.href = `${ROOT}pages/estates.html?${params.toString()}`;
  });
}
function applyUrlFilters(){
  const url = new URL(location.href);
  if($('#searchText') && url.searchParams.get('q')) $('#searchText').value = url.searchParams.get('q');
  if($('#filterStatus') && url.searchParams.get('status')) $('#filterStatus').value = url.searchParams.get('status');
  if($('#filterWilaya') && url.searchParams.get('wilaya')) $('#filterWilaya').value = url.searchParams.get('wilaya');
  if($('#filterCategory') && url.searchParams.get('category')) $('#filterCategory').value = url.searchParams.get('category');
  if($('#filterCommune') && url.searchParams.get('commune')) $('#filterCommune').dataset.keepValue = url.searchParams.get('commune');
}

function buildVirtualTourSection(p){
  const rooms = normalizeTourRooms(p);
  const external = safeUrl(p.virtualTourUrl);
  if(!rooms.length && !external) return '';
  const roomButtons = rooms.map((room,i)=>`<button class="tour-room ${i===0?'active':''}" type="button" data-tour-room="${i}">${safeText(room.room)}</button>`).join('');
  const externalBtn = external ? `<a class="btn-outline" href="${external}" target="_blank" rel="noopener">${safeText(t('detail.tourExternal'))}</a>` : '';
  const viewer = rooms.length ? `<div class="tour-shell"><button class="btn tour-start" type="button" data-tour-start>${safeText(t('detail.tourStart'))}</button><div class="tour-viewer hidden" id="tourViewer"></div></div>${roomButtons ? `<div class="tour-tabs">${roomButtons}</div>` : ''}` : '';
  return `<section class="tour-panel glass info-block"><div class="tour-head"><div><p class="eyebrow">${safeText(t('card.tour'))}</p><h2 class="prop-title">${safeText(t('detail.virtualTour'))}</h2><p class="sub">${safeText(t('detail.tourHelp'))}</p></div>${externalBtn}</div>${viewer}</section>`;
}
function initVirtualTour(p){
  const viewerEl = $('#tourViewer');
  const start = $('[data-tour-start]');
  if(!viewerEl || !start) return;
  const rooms = normalizeTourRooms(p);
  let viewer = null;
  async function loadRoom(index){
    const room = rooms[index]; if(!room) return;
    viewerEl.classList.remove('hidden'); start.classList.add('hidden');
    viewerEl.innerHTML = `<div class="tour-loading">Loading 360°…</div>`;
    $$('.tour-room').forEach(btn=>btn.classList.toggle('active', Number(btn.dataset.tourRoom) === index));
    try{ await loadPannellumAssets(); }catch(err){ console.warn(err); }
    if(window.pannellum){
      try { if(viewer && viewer.destroy) viewer.destroy(); } catch {}
      viewerEl.innerHTML = '';
      const hotSpots = (room.hotspots || []).filter(h => rooms[h.targetRoom]).map(h => {
        const label = `${h.text || rooms[h.targetRoom].room} → ${rooms[h.targetRoom].room}`;
        return {
          pitch: h.pitch,
          yaw: h.yaw,
          type: 'info',
          cssClass: 'room-hotspot',
          text: label,
          createTooltipFunc: roomHotspotTooltip,
          createTooltipArgs: { text: label },
          clickHandlerFunc: function(){ loadRoom(h.targetRoom); }
        };
      });
      viewer = pannellum.viewer('tourViewer', { type:'equirectangular', panorama: room.image, autoLoad:true, showControls:true, compass:false, mouseZoom:true, keyboardZoom:true, hfov:105, hotSpots });
    } else {
      viewerEl.innerHTML = `<img src="${safeText(room.image)}" alt="${safeText(room.room)}">`;
    }
  }
  start.addEventListener('click',()=>loadRoom(0));
  $$('.tour-room').forEach(btn=>btn.addEventListener('click',()=>loadRoom(Number(btn.dataset.tourRoom))));
}

function buildPropertyGallery(p){
  const images = extractImageList([p.images, p.image, p.mainImage, p.coverImage, p.photo, p.photos, p.gallery]).map(imageSrc).filter(Boolean);
  if(!images.length) return `<div class="detail-image detail-main-photo empty-photo"></div>`;
  const thumbs = images.map((img,i)=>`<button class="gallery-thumb ${i===0?'active':''}" type="button" data-gallery-index="${i}" aria-label="Photo ${i+1}"><img src="${img}" alt="${safeText(propertyTitle(p) || 'Photo')} ${i+1}" loading="lazy"></button>`).join('');
  return `<div class="detail-image detail-main-photo" id="detailMainPhoto" role="button" tabindex="0" aria-label="Open photo gallery"><img id="detailMainImage" src="${images[0]}" alt="${safeText(propertyTitle(p))}" data-gallery-index="0"></div>${images.length > 1 ? `<div class="gallery">${thumbs}</div>` : ''}`;
}
function initPropertyGallery(images){
  images = (images || []).map(imageSrc).filter(Boolean);
  const main = $('#detailMainImage');
  const mainBox = $('#detailMainPhoto');
  if(!main || !mainBox || !images.length) return;
  let current = 0;
  function setCurrent(index){
    current = (index + images.length) % images.length;
    main.src = images[current];
    main.dataset.galleryIndex = current;
    $$('.gallery-thumb').forEach(btn=>btn.classList.toggle('active', Number(btn.dataset.galleryIndex) === current));
  }
  $$('.gallery-thumb').forEach(btn=>btn.addEventListener('click',()=>setCurrent(Number(btn.dataset.galleryIndex))));
  function openLightbox(){
    let startX = 0;
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `<button class="lightbox-close" type="button" aria-label="Close">×</button><button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous">‹</button><img class="lightbox-img" src="${images[current]}" alt=""><button class="lightbox-nav lightbox-next" type="button" aria-label="Next">›</button><div class="lightbox-count"></div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    const img = $('.lightbox-img', overlay), count = $('.lightbox-count', overlay);
    const show = (index) => { current = (index + images.length) % images.length; img.src = images[current]; count.textContent = `${current+1} / ${images.length}`; setCurrent(current); };
    $('.lightbox-close', overlay).addEventListener('click', close);
    $('.lightbox-prev', overlay).addEventListener('click', ()=>show(current-1));
    $('.lightbox-next', overlay).addEventListener('click', ()=>show(current+1));
    overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });
    overlay.addEventListener('touchstart', e=>{ startX = e.changedTouches[0].clientX; }, {passive:true});
    overlay.addEventListener('touchend', e=>{ const dx = e.changedTouches[0].clientX - startX; if(Math.abs(dx)>45) show(current + (dx < 0 ? 1 : -1)); }, {passive:true});
    function onKey(e){ if(e.key==='Escape') close(); if(e.key==='ArrowLeft') show(current-1); if(e.key==='ArrowRight') show(current+1); }
    function close(){ document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; overlay.remove(); }
    document.addEventListener('keydown', onKey);
    show(current);
  }
  mainBox.addEventListener('click', openLightbox);
  mainBox.addEventListener('keydown', e=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); } });
}

function initPropertyDetail(){
  const wrap = $('#propertyDetail'); if(!wrap) return;
  const id = new URL(location.href).searchParams.get('id');
  const p = allProperties().find(x=>x.id === id);
  if(!p){
    if(window.MeradeDB?.enabled && REMOTE_PROPERTIES === null){
      wrap.innerHTML = `<div class="detail-loading"><span class="loader-spinner" aria-hidden="true"></span></div>`;
      return;
    }
    wrap.innerHTML = `<div class="empty">${safeText(t('detail.notFound'))}</div>`;
    return;
  }
  const title = propertyTitle(p);
  const description = propertyDescription(p);
  document.title = `${title} — Merade Immobilier`;
  const price = propertyPriceText(p);
  const details = [
    [t('detail.type'), catLabel(p.category)], [t('detail.status'), statusTypeLabel(p)], [t('detail.virtualTour'), hasVirtualTour(p) ? t('detail.tourStart') : ''], [t('detail.wilaya'), wilayaDisplay(p.wilaya)], [t('detail.commune'), p.commune], [t('detail.address'), p.address], [t('detail.price'), price], [t('detail.rentalPeriod'), rentalPeriodLabel(p)], [t('detail.surface'), p.surface && `${p.surface} ${t('card.surface')}`], [t('detail.land'), p.landSurface && `${p.landSurface} ${t('card.surface')}`], [t('detail.rooms'), p.rooms], [t('detail.bedrooms'), p.bedrooms], [t('detail.bathrooms'), p.bathrooms], [t('detail.floor'), p.floor], [t('detail.year'), p.yearBuilt], [t('detail.phone'), p.phone]
  ].filter(([,v])=>clean(v)).map(([k,v])=>`<div class="detail-item"><small>${safeText(k)}</small><strong>${safeText(v)}</strong></div>`).join('');
  const features = propertyFeatures(p).filter(Boolean).map(propertyFeatureListItem).join('');
  const virtualTour = buildVirtualTourSection(p);
  wrap.innerHTML = `<div class="detail-grid detail-grid-v10">
    <section class="detail-media-col">
      ${buildPropertyGallery(p)}
    </section>
    <aside class="detail-side glass">
      <p class="eyebrow">${safeText(statusTypeLabel(p))}</p>
      <h1 class="title">${safeText(title)}</h1>
      ${price ? `<p class="price detail-price">${price}</p>` : ''}
      <p class="location detail-location">${[p.commune,wilayaDisplay(p.wilaya)].filter(Boolean).map(safeText).join(' · ')}</p>
      <div class="detail-list">${details}</div>
      <div class="hero-cta"><a class="btn" href="${ROOT}pages/contact.html">${safeText(t('detail.visit'))}</a>${p.phone ? `<a class="btn-outline" href="tel:${safeText(p.phone)}">${safeText(t('detail.call'))}</a>` : ''}</div>
    </aside>
    <section class="detail-info-col">
      ${description ? `<div class="glass info-block description-block"><h2 class="prop-title">${safeText(t('detail.description'))}</h2><p class="sub property-description" id="propertyDescriptionText">${safeText(description)}</p><button class="description-toggle" type="button" data-description-toggle aria-controls="propertyDescriptionText" aria-expanded="false" data-more="${safeText(t('detail.readMore'))}" data-less="${safeText(t('detail.readLess'))}">${safeText(t('detail.readMore'))}</button></div>` : ''}
      ${features ? `<div class="glass info-block property-features-block"><h2 class="prop-title">${safeText(t('detail.features'))}</h2><ul class="check-list property-feature-list">${features}</ul></div>` : ''}
    </section>
    ${virtualTour ? `<section class="detail-tour-col">${virtualTour}</section>` : ''}
  </div>`;
  initPropertyGallery(extractImageList([p.images, p.image, p.mainImage, p.coverImage, p.photo, p.photos, p.gallery]));
  initDescriptionToggles();
  initVirtualTour(p);
}

function initDescriptionToggles(){
  $$('[data-description-toggle]').forEach(button => {
    const text = document.getElementById(button.getAttribute('aria-controls'));
    if(!text) return;
    const needsToggle = text.scrollHeight > text.clientHeight + 2;
    button.classList.toggle('hidden', !needsToggle);
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      text.classList.toggle('expanded', !expanded);
      button.textContent = expanded ? button.dataset.more : button.dataset.less;
    });
  });
}

function initContactForm(){
  const form = $('#contactForm'); if(!form) return;
  form.addEventListener('submit', e=>{ e.preventDefault(); showToast(t('contact.sent')); form.reset(); });
}
function showToast(msg){ const old = $('.toast'); if(old) old.remove(); const tdiv = document.createElement('div'); tdiv.className='toast'; tdiv.textContent = msg; document.body.appendChild(tdiv); setTimeout(()=>tdiv.remove(),3600); }

function ensureAdminHelpers(){
  const form = $('#propertyForm'); if(!form) return;
  if(!$('#existingImages')){
    const photos = $('#images')?.closest('.field');
    photos?.insertAdjacentHTML('afterend', `<div class="field full"><div id="existingImages" class="media-manager"></div></div>`);
  }
  if(!$('#tourBuilder')){
    const tourUrl = $('[name="virtualTourUrl"]')?.closest('.field');
    tourUrl?.insertAdjacentHTML('afterend', `<div class="field full"><div class="tour-builder" id="tourBuilder">
      <div class="tour-builder-head"><div><h3>${safeText(t('admin.hotspotsTitle'))}</h3><p class="note">${safeText(t('admin.hotspotsHelp'))}</p></div><button class="btn-soft" id="addTourRoomBtn" type="button">${safeText(t('admin.addRoom'))}</button></div>
      <div class="tour-room-editor-grid" id="tourRoomEditorGrid"></div>
      <div class="hotspot-editor hidden" id="hotspotEditor">
        <div class="hotspot-editor-head"><div><p class="eyebrow">360</p><h3 id="hotspotRoomTitle">Room</h3><p class="note">${safeText(t('admin.clickPanorama'))}</p></div><button class="btn-outline" id="closeHotspotEditor" type="button">${safeText(t('admin.closeEditor'))}</button></div>
        <div class="hotspot-layout"><div class="admin-pano-wrap"><div id="adminTourViewer" class="admin-tour-viewer"></div></div><div class="hotspot-side">
          <div class="field"><label>${safeText(t('admin.hotspotLabel'))}</label><input id="hotspotLabel" type="text" placeholder="Kitchen door"></div>
          <div class="field"><label>${safeText(t('admin.targetRoom'))}</label><select id="hotspotTargetRoom"></select></div>
          <div class="hotspot-coords"><span>${safeText(t('admin.selectedPoint'))}</span><strong id="hotspotCoords">—</strong></div>
          <button class="btn" id="addHotspotBtn" type="button">${safeText(t('admin.addHotspot'))}</button>
          <div class="hotspot-list" id="hotspotList"></div>
        </div></div>
      </div>
    </div></div>`);
  }
  if(!$('#cancelEditBtn')){
    const submit = form.querySelector('button[type="submit"]');
    submit?.insertAdjacentHTML('beforebegin', `<button class="btn-outline full hidden" id="cancelEditBtn" type="button">${safeText(t('admin.cancelEdit'))}</button>`);
  }
}
function renderImageManager(){
  const box = $('#existingImages'); if(!box) return;
  const images = ADMIN_EXISTING_IMAGES.map(imageSrc).filter(Boolean);
  box.innerHTML = images.length ? `<p class="mini-label">${safeText(t('admin.currentPhotos'))}</p><div class="media-chips">${images.map((img,i)=>`<div class="media-chip"><img src="${img}" alt=""><button type="button" data-remove-image="${i}">×</button></div>`).join('')}</div>` : '';
  $$('[data-remove-image]').forEach(btn=>btn.addEventListener('click',()=>{ ADMIN_EXISTING_IMAGES.splice(Number(btn.dataset.removeImage),1); renderImageManager(); }));
}
function syncTourNamesFromTextarea(){
  const names = roomNamesFromText($('[name="tourRooms"]')?.value || '');
  if(!names.length) return;
  ADMIN_TOUR_ROOMS.forEach((room,i)=>{ if(names[i]) room.room = names[i]; });
}
function renderTourBuilder(){
  const grid = $('#tourRoomEditorGrid'); if(!grid) return;
  syncTourNamesFromTextarea();
  grid.innerHTML = ADMIN_TOUR_ROOMS.length ? ADMIN_TOUR_ROOMS.map((room,i)=>`<div class="tour-edit-card ${i===ADMIN_HOTSPOT_ROOM_INDEX?'active':''}">
    <img src="${imageSrc(room.image)}" alt="">
    <div class="field"><label>${safeText(t('detail.tourRoom'))} ${i+1}</label><input data-room-name="${i}" type="text" value="${safeText(room.room)}"></div>
    <div class="tour-edit-actions"><button class="btn-soft" type="button" data-edit-hotspots="${i}">${safeText(t('admin.editHotspots'))}</button><button class="btn-soft btn-danger" type="button" data-remove-room="${i}">${safeText(t('admin.remove'))}</button></div>
    <small>${(room.hotspots||[]).length} ${safeText(t('admin.hotspots'))}</small>
  </div>`).join('') : `<div class="empty">${safeText(t('admin.noTourRooms'))}</div>`;
  $$('[data-room-name]').forEach(input=>input.addEventListener('input',()=>{ const i=Number(input.dataset.roomName); if(ADMIN_TOUR_ROOMS[i]) ADMIN_TOUR_ROOMS[i].room = input.value; updateTourRoomsTextarea(); renderHotspotControls(); }));
  $$('[data-remove-room]').forEach(btn=>btn.addEventListener('click',()=>{ ADMIN_TOUR_ROOMS.splice(Number(btn.dataset.removeRoom),1); ADMIN_HOTSPOT_ROOM_INDEX = Math.max(0, Math.min(ADMIN_HOTSPOT_ROOM_INDEX, ADMIN_TOUR_ROOMS.length-1)); updateTourRoomsTextarea(); renderTourBuilder(); openHotspotEditor(ADMIN_HOTSPOT_ROOM_INDEX, false); }));
  $$('[data-edit-hotspots]').forEach(btn=>btn.addEventListener('click',()=>openHotspotEditor(Number(btn.dataset.editHotspots), true)));
  renderHotspotControls();
}
function updateTourRoomsTextarea(){ const area = $('[name="tourRooms"]'); if(area) area.value = ADMIN_TOUR_ROOMS.map(r=>r.room).join('\n'); }
function addTourFiles(files){
  Array.from(files || []).forEach((file, index)=>{
    const image = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').trim();
    ADMIN_TOUR_ROOMS.push({ room: name || `${t('detail.tourRoom')} ${ADMIN_TOUR_ROOMS.length+1}`, image, file, hotspots: [] });
    ADMIN_ROOM_URLS.push(image);
  });
  updateTourRoomsTextarea(); renderTourBuilder();
}
function destroyAdminViewer(){ try{ if(ADMIN_VIEWER?.destroy) ADMIN_VIEWER.destroy(); }catch{} ADMIN_VIEWER = null; }
function openHotspotEditor(index, scroll=false){
  const editor = $('#hotspotEditor'); if(!editor || !ADMIN_TOUR_ROOMS[index]){ if(editor) editor.classList.add('hidden'); return; }
  ADMIN_HOTSPOT_ROOM_INDEX = index; ADMIN_SELECTED_POINT = null; editor.classList.remove('hidden');
  $('#hotspotRoomTitle').textContent = ADMIN_TOUR_ROOMS[index].room || `${t('detail.tourRoom')} ${index+1}`;
  $('#hotspotCoords').textContent = '—';
  renderHotspotControls();
  const viewerEl = $('#adminTourViewer');
  if(viewerEl){
    destroyAdminViewer(); viewerEl.innerHTML = '';
    if(window.pannellum){
      ADMIN_VIEWER = pannellum.viewer('adminTourViewer', {
        type:'equirectangular',
        panorama: ADMIN_TOUR_ROOMS[index].image,
        autoLoad:true,
        showControls:true,
        hfov:105,
        hotSpots:(ADMIN_TOUR_ROOMS[index].hotspots||[]).map(h=>({
          pitch:h.pitch,
          yaw:h.yaw,
          type:'info',
          cssClass:'room-hotspot',
          text:h.text,
          createTooltipFunc: roomHotspotTooltip,
          createTooltipArgs:{ text:h.text || 'Room' }
        }))
      });
      viewerEl.onclick = function(e){
        if(!ADMIN_VIEWER?.mouseEventToCoords) return;
        const coords = ADMIN_VIEWER.mouseEventToCoords(e);
        ADMIN_SELECTED_POINT = { pitch: Number(coords[0].toFixed(2)), yaw: Number(coords[1].toFixed(2)) };
        $('#hotspotCoords').textContent = `${ADMIN_SELECTED_POINT.pitch}, ${ADMIN_SELECTED_POINT.yaw}`;
      };
    }else{
      viewerEl.innerHTML = `<img src="${imageSrc(ADMIN_TOUR_ROOMS[index].image)}" alt="">`;
    }
  }
  renderTourBuilder();
  if(scroll) editor.scrollIntoView({behavior:'smooth', block:'start'});
}
function renderHotspotControls(){
  const target = $('#hotspotTargetRoom');
  if(target){
    target.innerHTML = ADMIN_TOUR_ROOMS.map((room,i)=>`<option value="${i}">${safeText(room.room || `${t('detail.tourRoom')} ${i+1}`)}</option>`).join('');
    target.value = String(Math.min(ADMIN_HOTSPOT_ROOM_INDEX + 1, Math.max(0, ADMIN_TOUR_ROOMS.length-1)));
  }
  const list = $('#hotspotList');
  const room = ADMIN_TOUR_ROOMS[ADMIN_HOTSPOT_ROOM_INDEX];
  if(list && room){
    list.innerHTML = (room.hotspots || []).length ? room.hotspots.map((h,i)=>`<div class="hotspot-row"><span>${safeText(h.text)} → ${safeText(ADMIN_TOUR_ROOMS[h.targetRoom]?.room || '')}<small>${h.pitch}, ${h.yaw}</small></span><button type="button" data-remove-hotspot="${i}">×</button></div>`).join('') : `<div class="empty small">${safeText(t('admin.noHotspots'))}</div>`;
    $$('[data-remove-hotspot]').forEach(btn=>btn.addEventListener('click',()=>{ room.hotspots.splice(Number(btn.dataset.removeHotspot),1); openHotspotEditor(ADMIN_HOTSPOT_ROOM_INDEX, false); }));
  }
}
function bindTourBuilder(){
  $('#addTourRoomBtn')?.addEventListener('click',()=>{ ADMIN_TOUR_ROOMS.push({room:`${t('detail.tourRoom')} ${ADMIN_TOUR_ROOMS.length+1}`, image:'https://pannellum.org/images/alma.jpg', hotspots:[]}); updateTourRoomsTextarea(); renderTourBuilder(); });
  $('#closeHotspotEditor')?.addEventListener('click',()=>{ $('#hotspotEditor')?.classList.add('hidden'); destroyAdminViewer(); });
  $('#addHotspotBtn')?.addEventListener('click',()=>{
    const room = ADMIN_TOUR_ROOMS[ADMIN_HOTSPOT_ROOM_INDEX];
    if(!room) return;
    if(!ADMIN_SELECTED_POINT){ showToast(t('admin.choosePoint')); return; }
    const targetRoom = Number($('#hotspotTargetRoom')?.value || 0);
    room.hotspots = room.hotspots || [];
    room.hotspots.push({ pitch: ADMIN_SELECTED_POINT.pitch, yaw: ADMIN_SELECTED_POINT.yaw, text: clean($('#hotspotLabel')?.value) || (ADMIN_TOUR_ROOMS[targetRoom]?.room || 'Go'), targetRoom });
    $('#hotspotLabel').value = ''; ADMIN_SELECTED_POINT = null; $('#hotspotCoords').textContent = '—'; openHotspotEditor(ADMIN_HOTSPOT_ROOM_INDEX, false);
  });
  $('#tourImages')?.addEventListener('change', e=>addTourFiles(e.target.files));
  $('[name="tourRooms"]')?.addEventListener('input',()=>{ syncTourNamesFromTextarea(); renderTourBuilder(); });
}
function setFormValue(form, name, value){ const el = form.elements[name]; if(!el) return; if(el.type === 'checkbox') el.checked = Boolean(value); else el.value = value ?? ''; }
function renderAdminFeaturePicker(){
  const picker = $('#adminFeaturePicker');
  if(!picker) return;
  picker.innerHTML = STANDARD_FEATURE_GROUPS.map(group => `<fieldset class="admin-feature-group">
    <legend>${safeText(t(`feature.group.${group.key}`))}</legend>
    <div class="admin-feature-options">${group.items.map(item => `<label class="admin-feature-option"><input type="checkbox" name="featureKeys" value="${safeText(item.key)}"><span>${safeText(localizedStandardFeature(item.key))}</span></label>`).join('')}</div>
  </fieldset>`).join('');
}
function selectedAdminFeatureKeys(form){
  return Array.from(form?.querySelectorAll('[name="featureKeys"]:checked') || []).map(input => clean(input.value)).filter(key => STANDARD_FEATURE_BY_KEY[key]);
}
function setAdminFeatureSelections(form, property){
  const selected = new Set(propertyFeatureKeys(property));
  form?.querySelectorAll('[name="featureKeys"]').forEach(input => { input.checked = selected.has(input.value); });
}
function customSourceFeatures(property){
  return (Array.isArray(property?.features) ? property.features : []).filter(value => !standardFeatureKeyForText(value));
}
function syncAdminRentalPeriod(form){
  if(!form) return;
  const field = $('#rentalPeriodField');
  const select = form.elements.rentalPeriod;
  const isRental = clean(form.elements.status?.value).toLowerCase() === 'rent';
  field?.classList.toggle('hidden', !isRental);
  if(isRental && select && !select.value) select.value = 'month';
  if(!isRental && select) select.value = '';
}
async function startEditProperty(id){
  let p = allProperties().find(x=>x.id === id); const form = $('#propertyForm'); if(!p || !form) return;
  if(window.MeradeDB?.enabled && window.MeradeDB?.getProperty){
    try{ p = await window.MeradeDB.getProperty(id) || p; }catch(err){ console.warn('Could not load full property for edit:', err); }
  }
  ADMIN_EDITING_ID = id;
  ADMIN_EXISTING_IMAGES = Array.from(new Set(extractImageList([p.images, p.image, p.mainImage, p.coverImage, p.photo, p.photos, p.gallery]).map(imageSrc).filter(Boolean)));
  ADMIN_TOUR_ROOMS = normalizeTourRooms(p).map(r=>({ ...r, hotspots: normalizeHotspots(r.hotspots) }));
  ADMIN_HOTSPOT_ROOM_INDEX = 0;
  ['title','category','status','wilaya','commune','address','surface','landSurface','rooms','bedrooms','bathrooms','floor','yearBuilt','phone','description'].forEach(name=>setFormValue(form, name, p[name] || ''));
  const priceParts = compactPriceParts(p);
  setFormValue(form, 'price', priceParts.amount);
  setFormValue(form, 'currency', priceParts.unit === 'm' ? 'm' : 'Md');
  setFormValue(form, 'rentalPeriod', rentalPeriodValue(p));
  syncAdminRentalPeriod(form);
  setAdminFeatureSelections(form, p);
  setFormValue(form, 'features', customSourceFeatures(p).join('\n'));
  setFormValue(form, 'featured', p.featured);
  setFormValue(form, 'heroFeatured', p.heroFeatured);
  setFormValue(form, 'heroOrder', p.heroOrder || '');
  setFormValue(form, 'virtualTourUrl', p.virtualTourUrl || '');
  updateTourRoomsTextarea();
  fillCommuneControl($('#adminCommuneList'), form.elements.wilaya.value);
  renderImageManager(); renderTourBuilder(); openHotspotEditor(0, false);
  $('#publishTitle') && ($('#publishTitle').textContent = t('admin.editTitle'));
  const submit = form.querySelector('button[type="submit"]'); if(submit) submit.textContent = t('admin.update');
  $('#cancelEditBtn')?.classList.remove('hidden');
  location.hash = 'publish';
  form.scrollIntoView({behavior:'smooth', block:'start'});
}
function resetAdminForm(){
  const form = $('#propertyForm'); if(!form) return;
  form.reset(); form.elements.currency && (form.elements.currency.value = 'Md');
  syncAdminRentalPeriod(form);
  ADMIN_EDITING_ID = ''; ADMIN_EXISTING_IMAGES = []; ADMIN_TOUR_ROOMS = []; ADMIN_HOTSPOT_ROOM_INDEX = 0; ADMIN_SELECTED_POINT = null; destroyAdminViewer();
  renderImageManager(); renderTourBuilder(); $('#hotspotEditor')?.classList.add('hidden');
  $('#publishTitle') && ($('#publishTitle').textContent = t('admin.title'));
  const submit = form.querySelector('button[type="submit"]'); if(submit) submit.textContent = t('admin.submit');
  $('#cancelEditBtn')?.classList.add('hidden');
}
async function buildPropertyFromForm(form){
  const fd = new FormData(form);
  const status = clean(fd.get('status')) || 'sale';
  const newImages = await filesToUrls(Array.from($('#images')?.files || []).slice(0,12), 'photos');
  const finalTourRooms = [];
  syncTourNamesFromTextarea();
  for(const room of ADMIN_TOUR_ROOMS){
    const image = await roomImageToUrl(room);
    if(image) finalTourRooms.push({ room: clean(room.room) || `${t('detail.tourRoom')} ${finalTourRooms.length+1}`, image, hotspots: normalizeHotspots(room.hotspots) });
  }
  const virtualTourUrl = safeUrl(fd.get('virtualTourUrl'));
  return {
    id: ADMIN_EDITING_ID || `local-${Date.now()}`,
    title: clean(fd.get('title')) || 'Property',
    category: clean(fd.get('category')) || 'estates',
    status,
    wilaya: clean(fd.get('wilaya')),
    commune: clean(fd.get('commune')),
    price: clean(fd.get('price')),
    currency: clean(fd.get('currency')) === 'm' ? 'm' : 'Md',
    rentPeriod: status === 'rent' && ['night','day','month','year'].includes(clean(fd.get('rentalPeriod'))) ? clean(fd.get('rentalPeriod')) : '',
    surface: clean(fd.get('surface')),
    rooms: clean(fd.get('rooms')),
    bedrooms: clean(fd.get('bedrooms')),
    bathrooms: clean(fd.get('bathrooms')),
    floor: clean(fd.get('floor')),
    landSurface: clean(fd.get('landSurface')),
    yearBuilt: clean(fd.get('yearBuilt')),
    phone: clean(fd.get('phone')),
    address: clean(fd.get('address')),
    description: clean(fd.get('description')),
    featureKeys: selectedAdminFeatureKeys(form),
    features: clean(fd.get('features')).split(/,|\n/).map(clean).filter(Boolean),
    images: Array.from(new Set([...ADMIN_EXISTING_IMAGES, ...newImages].map(imageSrc).filter(Boolean))),
    featured: fd.get('featured') === 'on',
    heroFeatured: fd.get('heroFeatured') === 'on',
    heroOrder: clean(fd.get('heroOrder')) ? Math.min(8, Math.max(1, Number(fd.get('heroOrder')))) : '',
    hasVirtualTour: Boolean(virtualTourUrl || finalTourRooms.length),
    virtualTourType: finalTourRooms.length ? 'pannellum' : 'embed',
    virtualTourUrl,
    virtualTourRooms: finalTourRooms,
    createdAt: new Date().toISOString()
  };
}
async function saveLocalProperty(prop){
  const saved = savedProperties();
  const existing = saved.findIndex(p=>p.id === prop.id);
  if(existing >= 0) saved[existing] = prop;
  else { if(defaultProperties().some(p=>p.id === prop.id)) setHiddenDefaultIds([...hiddenDefaultIds(), prop.id]); saved.unshift(prop); }
  setSavedProperties(saved);
}
async function initAdmin(){
  const loginScreen = $('#loginScreen'); const adminApp = $('#adminApp'); if(!loginScreen || !adminApp) return;
  ensureAdminHelpers(); renderAdminFeaturePicker(); bindTourBuilder(); renderImageManager(); renderTourBuilder();
  const form = $('#propertyForm');
  form?.elements.status?.addEventListener('change', () => syncAdminRentalPeriod(form));
  syncAdminRentalPeriod(form);
  const unlock = () => { loginScreen.classList.add('hidden'); adminApp.classList.remove('hidden'); renderAdminList(); fillAdminStats(); initHeroSlider(); };
  const rememberedAdmin = localStorage.getItem(ADMIN_FLAG) === 'yes' || sessionStorage.getItem(ADMIN_FLAG) === 'yes';
  if(rememberedAdmin){
    const sessionRestored = !window.MeradeDB?.enabled || await window.MeradeDB.restoreSession?.();
    if(sessionRestored){
      localStorage.setItem(ADMIN_FLAG, 'yes');
      sessionStorage.removeItem(ADMIN_FLAG);
      unlock();
    }else{
      localStorage.removeItem(ADMIN_FLAG);
      sessionStorage.removeItem(ADMIN_FLAG);
    }
  }
  $('#loginForm')?.addEventListener('submit', async e=>{
    e.preventDefault();
    const code = clean($('#adminCode')?.value);
    const email = clean($('#adminEmail')?.value);
    const password = clean($('#adminPassword')?.value);
    if(code !== ADMIN_CODE){ showToast(t('admin.badCode')); return; }
    if(window.MeradeDB?.enabled && email && password){
      try{ await window.MeradeDB.signIn(email, password); await loadDatabaseProperties(); DB_STATUS = 'connected'; }
      catch(err){ console.error(err); showToast(err.message || 'Supabase admin login failed. Check email/password.'); return; }
    } else if(window.MeradeDB?.enabled && (!email || !password)) {
      DB_STATUS = 'local';
      REMOTE_PROPERTIES = null;
    }
    localStorage.setItem(ADMIN_FLAG,'yes');
    sessionStorage.removeItem(ADMIN_FLAG);
    unlock();
  });
  $('#logoutBtn')?.addEventListener('click',async ()=>{
    localStorage.removeItem(ADMIN_FLAG);
    sessionStorage.removeItem(ADMIN_FLAG);
    await window.MeradeDB?.signOut?.();
    location.reload();
  });
  $('#cancelEditBtn')?.addEventListener('click', resetAdminForm);
  form?.addEventListener('submit', async e=>{
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if(window.MeradeDB?.enabled && !window.MeradeDB?.isSignedIn?.()){
      showToast('Login with admin email/password first.');
      return;
    }
    if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = t('admin.uploading'); }
    try{
      const wasEditing = Boolean(ADMIN_EDITING_ID);
      const editingId = ADMIN_EDITING_ID;
      const prop = await buildPropertyFromForm(form);
      // Publishing must never depend on a third-party translation service.
      // Save the language the admin wrote immediately; missing languages are
      // translated lazily for each visitor and cached by the visitor workflow.
      prop.translations = sourcePropertyTranslations(prop);
      if(window.MeradeDB?.enabled){
        let remote;
        if(wasEditing) remote = await window.MeradeDB.updateProperty(editingId, prop);
        else remote = await window.MeradeDB.insertProperty(prop);
        const refreshed = await refreshAdminProperties();
        if(!refreshed){
          REMOTE_PROPERTIES = wasEditing ? (REMOTE_PROPERTIES || []).map(p=>p.id === editingId ? remote : p) : [remote, ...(REMOTE_PROPERTIES || [])];
          DB_STATUS = 'connected';
        }
        resetAdminForm(); showToast(wasEditing ? t('admin.updatedDb') : t('admin.savedDb')); renderAdminList(); fillAdminStats(); initHeroSlider(); return;
      }
      await saveLocalProperty(prop); resetAdminForm(); showToast(wasEditing ? t('admin.updated') : t('admin.saved')); renderAdminList(); fillAdminStats(); initHeroSlider();
    }catch(err){
      console.error(err); showToast(err.message || 'Upload/database error. Check SQL policies.');
    }finally{
      if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalText || t('admin.submit'); }
    }
  });
  $('#exportBtn')?.addEventListener('click',()=>{ const blob = new Blob([JSON.stringify(savedProperties(),null,2)],{type:'application/json'}); const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='merade-properties-export.json'; a.click(); URL.revokeObjectURL(a.href); });
  $('#importFile')?.addEventListener('change', async e=>{ const file = e.target.files[0]; if(!file) return; try{ const data = JSON.parse(await file.text()); if(Array.isArray(data)){ setSavedProperties(data); renderAdminList(); fillAdminStats(); initHeroSlider(); showToast('Import done.'); } } catch{ showToast('Invalid import file.'); } });
}
async function deletePropertyById(id){
  if(window.MeradeDB?.enabled && usingDatabase()){
    await window.MeradeDB.deleteProperty(id);
    const refreshed = await refreshAdminProperties();
    if(!refreshed) REMOTE_PROPERTIES = (REMOTE_PROPERTIES || []).filter(p => p.id !== id);
    return;
  }
  const saved = savedProperties();
  if(saved.some(p => p.id === id)) setSavedProperties(saved.filter(p => p.id !== id));
  else setHiddenDefaultIds([...hiddenDefaultIds(), id]);
}
function renderAdminList(){
  const list = $('#adminList'); if(!list) return;
  const items = allProperties();
  list.innerHTML = items.length ? items.map(p=>`<div class="mini-prop">
    ${firstImage(p) ? `<img src="${firstImage(p)}" alt="">` : `<img alt="">`}
    <div><strong>${safeText(p.title || 'Property')}</strong><small>${statusLabel(p.status)} · ${catLabel(p.category)} · ${safeText(wilayaDisplay(p.wilaya) || 'No wilaya')}</small>${p.heroFeatured ? `<small class="admin-tour-mini hero-mini">Top slider ${safeText(p.heroOrder || '')}</small>` : ''}${hasVirtualTour(p) ? `<small class="admin-tour-mini">${safeText(t('card.tour'))}</small>` : ''}</div>
    <div class="mini-actions"><button class="btn-soft" data-edit="${safeText(p.id)}">${safeText(t('admin.edit'))}</button><button class="btn-soft btn-danger" data-delete="${safeText(p.id)}">${safeText(t('admin.delete'))}</button></div>
  </div>`).join('') : `<div class="empty">${safeText(t('admin.none'))}</div>`;
  $$('[data-edit]').forEach(btn=>btn.addEventListener('click',async ()=>{ btn.disabled = true; try{ await startEditProperty(btn.dataset.edit); } finally { btn.disabled = false; } }));
  $$('[data-delete]').forEach(btn=>btn.addEventListener('click',async ()=>{ const id = btn.dataset.delete; try{ await deletePropertyById(id); if(ADMIN_EDITING_ID === id) resetAdminForm(); renderAdminList(); fillAdminStats(); initHeroSlider(); renderCards($('#listingsGrid'), allProperties()); showToast(t('admin.deleted')); } catch(err){ console.error(err); showToast('Database delete blocked. Check RLS/admin policy.'); } }));
}
function fillAdminStats(){ const items = allProperties(); const total = $('#adminTotal'); if(total) total.textContent = items.length; const sale = $('#adminSale'); if(sale) sale.textContent = items.filter(p=>p.status==='sale').length; const rent = $('#adminRent'); if(rent) rent.textContent = items.filter(p=>p.status==='rent').length; const db = $('#adminDbStatus'); if(db){ db.textContent = DB_STATUS === 'connected' ? 'Supabase connected' : DB_STATUS === 'offline' ? 'Supabase not ready / table missing' : 'Local browser mode'; } }


function normalizeCityText(value){
  return clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function propertyCityHaystack(p){
  return [p?.wilaya, wilayaDisplay(p?.wilaya), p?.commune, p?.address]
    .map(normalizeCityText)
    .filter(Boolean)
    .join(' ');
}
function initHomeCities(){
  const track = $('#cityTrack');
  if(!track) return;
  if(!track.dataset.scrollBound){
    $$('[data-city-scroll]').forEach(btn => btn.addEventListener('click', () => {
      const direction = btn.dataset.cityScroll === 'next' ? 1 : -1;
      track.scrollBy({ left: direction * Math.max(240, track.clientWidth * .82), behavior: 'smooth' });
    }));
    track.dataset.scrollBound = 'yes';
  }
  const properties = allProperties();
  $$('.city-card[data-city-keys]', track).forEach(card => {
    const keys = clean(card.dataset.cityKeys).split('|').map(normalizeCityText).filter(Boolean);
    const count = properties.filter(p => {
      const hay = propertyCityHaystack(p);
      return keys.some(key => hay.includes(key));
    }).length;
    const countEl = $('[data-city-count]', card);
    if(countEl) countEl.textContent = String(count);
  });
}



function propertySortNewest(list){
  return uniqueProperties(list).sort((a,b)=>new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));
}
function buildOverlayPropertyCard(p, extraClass = ''){
  const img = firstImage(p) || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=74';
  const price = propertyPriceText(p);
  const roomsValue = p.bedrooms || p.rooms;
  const areaValue = p.surface || p.landSurface;
  const meta = [
    roomsValue && `${cardIcon('bed')}<span>${safeText(roomsValue)}</span>`,
    p.bathrooms && `${cardIcon('bath')}<span>${safeText(p.bathrooms)}</span>`,
    areaValue && `${cardIcon('area')}<span>${safeText(areaValue)} ${safeText(t('card.surface'))}</span>`
  ].filter(Boolean).map(x=>`<span>${x}</span>`).join('');
  return `<a class="overlay-prop-card ${extraClass}" href="${propertyUrl(p.id)}" style="--bg:url('${cssUrl(img)}')">
    <span class="overlay-shade"></span>
    ${hasVirtualTour(p) ? `<span class="overlay-tour-pill">${safeText(t('card.tour'))}</span>` : ''}
    <span class="overlay-card-content">
      <strong>${safeText(propertyTitle(p))}</strong>
      <small>${cardIcon('pin')}<span>${propertyLocation(p)}</span></small>
      ${price ? `<b>${price}</b>` : ''}
      ${meta ? `<em>${meta}</em>` : ''}
    </span>
  </a>`;
}
function buildLatestImageCard(p, index){
  const img = firstImage(p) || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=78';
  const title = propertyTitle(p);
  const location = propertyLocation(p);
  const price = propertyPriceText(p);
  return `<a class="latest-image-card ${index % 4 === 0 || index % 4 === 3 ? 'is-tall' : ''}" href="${propertyUrl(p.id)}" aria-label="${safeText(title)}">
    <span class="latest-image-media">
      <img src="${safeText(img)}" alt="${safeText(title)}" loading="lazy">
      <span class="latest-image-reveal">${safeText(extraText('home.latest.more'))}</span>
    </span>
    <span class="latest-image-info">
      <strong>${safeText(title)}</strong>
      <span class="latest-image-meta">
        <small>${cardIcon('pin')}<span>${safeText(location)}</span></small>
        ${price ? `<b>${safeText(price)}</b>` : ''}
      </span>
    </span>
  </a>`;
}
function initLatestGalleryMotion(){
  const gallery = $('#latestPropertyShowcase');
  if(!gallery || gallery.dataset.motionBound === 'yes') return;
  gallery.dataset.motionBound = 'yes';
  const desktopCardCooldown = 2000;
  const activateDesktopCard = (pair, card) => {
    pair.classList.add('has-latest-active');
    $$('.latest-image-card', pair).forEach(item => item.classList.toggle('is-latest-active', item === card));
    card._latestActivatedAt = performance.now();
  };
  const clearDesktopCard = pair => {
    pair.classList.remove('has-latest-active');
    $$('.latest-image-card', pair).forEach(item => item.classList.remove('is-latest-active'));
  };
  gallery.addEventListener('pointermove', event => {
    if(window.matchMedia('(max-width: 760px)').matches) return;
    const pointerMoved = event.clientX !== gallery._latestPointerX || event.clientY !== gallery._latestPointerY;
    gallery._latestPointerX = event.clientX;
    gallery._latestPointerY = event.clientY;
    if(!pointerMoved) return;
    const card = event.target.closest('.latest-image-card');
    const pair = card?.closest('.latest-property-pair');
    if(!card || !pair) return;
    clearTimeout(pair._latestSwitchTimer);
    const active = $('.latest-image-card.is-latest-active', pair);
    if(active === card) return;
    const wait = Math.max(0, (card._latestActivatedAt || 0) + desktopCardCooldown - performance.now());
    if(wait === 0){
      activateDesktopCard(pair, card);
      return;
    }
    pair._latestSwitchTimer = setTimeout(() => {
      if(pair.matches(':hover') && card.matches(':hover')) activateDesktopCard(pair, card);
    }, wait);
  });
  gallery.addEventListener('pointerout', event => {
    if(window.matchMedia('(max-width: 760px)').matches) return;
    const pair = event.target.closest('.latest-property-pair');
    if(!pair || pair.contains(event.relatedTarget)) return;
    clearTimeout(pair._latestSwitchTimer);
    clearDesktopCard(pair);
  });
  let frame = 0;
  const render = () => {
    frame = 0;
    const cards = $$('.latest-image-card', gallery);
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    if(!mobile){
      cards.forEach(card => {
        card.style.removeProperty('--latest-mobile-expand');
        card.style.removeProperty('--latest-mobile-clip');
        card.classList.remove('is-scroll-expanded');
        card._latestMobileStrength = null;
      });
      return;
    }
    [...new Set(cards.map(card => card.closest('.latest-property-pair')).filter(Boolean))].forEach(clearDesktopCard);
    const focusPoint = window.innerHeight * .58;
    const radius = window.innerHeight * .68;
    const updates = cards.map((card, index) => {
      const bounds = card.getBoundingClientRect();
      const cardCenter = bounds.top + bounds.height / 2;
      const strength = 1 - clampUnit(Math.abs(cardCenter - focusPoint) / radius);
      const inlineClip = (1 - strength) * 19;
      const blockClip = (1 - strength) * 44.5;
      const firstInPair = index % 2 === 0;
      const lowerAnchoredPair = Math.floor(index / 2) % 2 === 1;
      const clip = lowerAnchoredPair
        ? `${blockClip.toFixed(2)}% ${firstInPair ? inlineClip.toFixed(2) : '0'}% 0 ${firstInPair ? '0' : inlineClip.toFixed(2)}%`
        : `0 ${firstInPair ? inlineClip.toFixed(2) : '0'}% ${blockClip.toFixed(2)}% ${firstInPair ? '0' : inlineClip.toFixed(2)}%`;
      return { card, strength, clip };
    });
    updates.forEach(({ card, strength, clip }) => {
      if(Math.abs(strength - (card._latestMobileStrength ?? -1)) < .008) return;
      card._latestMobileStrength = strength;
      card.style.setProperty('--latest-mobile-expand', strength.toFixed(3));
      card.style.setProperty('--latest-mobile-clip', clip);
      card.classList.toggle('is-scroll-expanded', strength > .62);
    });
  };
  const requestRender = () => {
    if(!frame) frame = requestAnimationFrame(render);
  };
  window.addEventListener('scroll', requestRender, { passive:true });
  window.addEventListener('resize', requestRender, { passive:true });
  render();
}
function initLatestIntentScrollMotion(){
  const section = $('#homePropertyActions');
  if(!section || section.dataset.scrollMotionBound === 'yes') return;
  section.dataset.scrollMotionBound = 'yes';
  const buttons = $$('.latest-intent-btn', section);
  let frame = 0;
  let previousActiveIndex = -2;
  const render = () => {
    frame = 0;
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    if(!mobile){
      buttons.forEach(button => button.classList.remove('is-scroll-active','is-scroll-passed'));
      return;
    }
    const bounds = section.getBoundingClientRect();
    const start = window.innerHeight * .82;
    const end = -Math.min(bounds.height * .32, 170);
    const progress = clampUnit((start - bounds.top) / (start - end));
    let activeIndex = progress > 0 ? Math.min(buttons.length - 1, Math.floor(progress * buttons.length)) : -1;
    if(bounds.bottom <= 0) activeIndex = buttons.length;
    if(activeIndex === previousActiveIndex) return;
    previousActiveIndex = activeIndex;
    buttons.forEach((button, index) => {
      button.classList.toggle('is-scroll-active', index === activeIndex);
      button.classList.toggle('is-scroll-passed', index < activeIndex);
    });
  };
  const requestRender = () => {
    if(!frame) frame = requestAnimationFrame(render);
  };
  window.addEventListener('scroll', requestRender, { passive:true });
  window.addEventListener('resize', requestRender, { passive:true });
  render();
}
function initHomePropertyShowcases(){
  const latestBox = $('#latestPropertyShowcase');
  const handpickedBox = $('#handpickedPropertiesTrack');
  const items = propertySortNewest(allProperties()).filter(p => firstImage(p));
  if(latestBox){
    const latest = items.slice(0,4);
    if(latest.length){
      const pairs = [];
      for(let index = 0; index < latest.length; index += 2){
        const cards = latest.slice(index,index + 2).map((property,offset) => buildLatestImageCard(property,index + offset)).join('');
        pairs.push(`<div class="latest-property-pair">${cards}</div>`);
      }
      latestBox.innerHTML = pairs.join('');
      initLatestGalleryMotion();
    }else latestBox.innerHTML = `<div class="empty">${safeText(t('empty'))}</div>`;
  }
  if(handpickedBox){
    const handpicked = propertySortNewest(allProperties()).filter(p => p.featured || firstImage(p)).slice(0,10);
    handpickedBox.innerHTML = handpicked.length ? handpicked.map(p => buildOverlayPropertyCard(p, 'handpicked-card')).join('') : `<div class="empty">${safeText(t('empty'))}</div>`;
    if(!handpickedBox.dataset.scrollBound){
      $$('[data-handpicked-scroll]').forEach(btn => btn.addEventListener('click', () => {
        const direction = btn.dataset.handpickedScroll === 'next' ? 1 : -1;
        handpickedBox.scrollBy({ left: direction * Math.max(260, handpickedBox.clientWidth * .82), behavior: 'smooth' });
      }));
      handpickedBox.dataset.scrollBound = 'yes';
    }
  }
}

function aiLang(){
  const lang = typeof currentLang === 'function' ? currentLang() : 'en';
  return ['en','fr','ar'].includes(lang) ? lang : 'en';
}
function hasArabic(text){ return /[\u0600-\u06FF]/.test(String(text || '')); }
function aiText(key){
  const lang = aiLang();
  return EXTRA_TRANSLATIONS[lang]?.[key] || EXTRA_TRANSLATIONS.en[key] || key;
}
function aiNormalize(value){
  return clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
}
function aiNumberWord(text){
  const q = aiNormalize(text);
  const map = [
    ['10','10'],['9','9'],['8','8'],['7','7'],['6','6'],['5','5'],['4','4'],['3','3'],['2','2'],['1','1'],
    ['عشر','10'],['تسع','9'],['ثمان','8'],['سبع','7'],['ست','6'],['خمس','5'],['اربع','4'],['أربع','4'],['ثلاث','3'],['اثنين','2'],['زوج','2'],['واحد','1'],
    ['dix','10'],['neuf','9'],['huit','8'],['sept','7'],['six','6'],['cinq','5'],['quatre','4'],['trois','3'],['deux','2'],['un','1'],
    ['ten','10'],['nine','9'],['eight','8'],['seven','7'],['six','6'],['five','5'],['four','4'],['three','3'],['two','2'],['one','1']
  ];
  const fMatch = q.match(/\bf\s*([1-9])\b/);
  if(fMatch) return Number(fMatch[1]);
  const roomMatch = q.match(/([1-9])\s*(rooms?|pieces?|chambres?|غرف|غرفه|بياس|pieces?)/);
  if(roomMatch) return Number(roomMatch[1]);
  for(const [word,num] of map){ if(q.includes(word)) return Number(num); }
  return 0;
}
function aiDetectIntent(query){
  const q = aiNormalize(query);
  const intent = { q, category:'', status:'', rooms:0, location:'', budget:0, wantsTour:false };
  if(/مجمع سياحي|complexe touristique|tourist complex/.test(q)) intent.category = 'tourist-complex';
  else if(/مبنى تجاري|عماره تجاريه|immeuble commercial|commercial building/.test(q)) intent.category = 'commercial-building';
  else if(/شقه تجاريه|appartement commercial|commercial apartment/.test(q)) intent.category = 'commercial-apartment';
  else if(/محل تجاري|محلات تجاريه|locaux commerciaux?|commercial premises?/.test(q)) intent.category = 'commercial-premises';
  else if(/عقار ريفي|ملكيه ريفيه|propriete de campagne|country propert/.test(q)) intent.category = 'country-property';
  else if(/استوديو|studio/.test(q)) intent.category = 'studio';
  else if(/لوفت|loft/.test(q)) intent.category = 'loft';
  else if(/دوبلكس|duplex/.test(q)) intent.category = 'duplex';
  else if(/تريبلكس|triplex/.test(q)) intent.category = 'triplex';
  else if(/فندق|hotel/.test(q)) intent.category = 'hotel';
  else if(/مزرعه|ranch/.test(q)) intent.category = 'ranch';
  else if(/عماره|بنايه|immeuble|building/.test(q)) intent.category = 'building';
  else if(/شقه|appartement|apartment|apart|\bf[1-9]\b/.test(q)) intent.category = 'apartments';
  else if(/فيلا|villa/.test(q)) intent.category = 'villas';
  else if(/منزل|دار|بيت|maison|house/.test(q)) intent.category = 'houses';
  else if(/ارض|قطعه|terrain|land/.test(q)) intent.category = 'land';
  else if(/مكتب|bureau|office/.test(q)) intent.category = 'offices';
  if(/كراء|ايجار|rent|location|louer/.test(q)) intent.status = 'rent';
  else if(/شراء|بيع|للبيع|sale|buy|acheter|vente/.test(q)) intent.status = 'sale';
  intent.rooms = aiNumberWord(query);
  intent.wantsTour = /360|جوله|visite|tour/.test(q);
  const budgetMatch = q.match(/(\d+(?:[\.,]\d+)?)\s*(milliard|md|مليار|million|millions|مليون|ملايين|m\b)/);
  if(budgetMatch){
    const n = Number(budgetMatch[1].replace(',','.'));
    const unit = budgetMatch[2];
    intent.budget = /milliard|md|مليار/.test(unit) ? n * 10000000 : n * 10000;
  } else {
    const raw = q.match(/(\d{6,})/);
    if(raw) intent.budget = Number(raw[1]);
  }
  const hayLocations = [];
  (LOCATION_DATA.wilayas || []).forEach(w => hayLocations.push({ key: aiNormalize(`${w.code} ${w.name} ${w.name_fr || ''} ${w.name_ar || ''}`), value: wilayaValue(w) }));
  allProperties().forEach(p => [p.wilaya, wilayaDisplay(p.wilaya), p.commune, p.address].forEach(v => { if(clean(v)) hayLocations.push({ key: aiNormalize(v), value: clean(v) }); }));
  const found = hayLocations.find(item => item.key && item.key.split(/\s+/).some(part => part.length > 2 && q.includes(part)));
  if(found) intent.location = found.value;
  return intent;
}
function aiScoreProperty(p, intent){
  let score = 0;
  const hay = aiNormalize([propertySearchText(p),p.category,p.status,p.wilaya,wilayaDisplay(p.wilaya),p.commune,p.address,catLabel(p.category),statusTypeLabel(p)].join(' '));
  if(intent.category && p.category === intent.category) score += 7;
  if(intent.status && p.status === intent.status) score += 5;
  if(intent.location && hay.includes(aiNormalize(intent.location).split(' - ').pop())) score += 5;
  if(intent.rooms){
    const values = [p.rooms,p.bedrooms].map(v => Number(String(v || '').replace(/\D/g,''))).filter(Boolean);
    if(values.includes(intent.rooms)) score += 4;
    else if(values.some(v => Math.abs(v - intent.rooms) === 1)) score += 1.4;
  }
  if(intent.wantsTour && hasVirtualTour(p)) score += 2;
  const price = propertyPriceInDzd(p);
  if(intent.budget && !Number.isNaN(price) && price <= intent.budget) score += 2;
  aiNormalize(intent.q).split(/\s+/).filter(w => w.length > 3).slice(0,8).forEach(w => { if(hay.includes(w)) score += .35; });
  return score;
}
function aiFindMatches(query){
  const intent = aiDetectIntent(query);
  const items = allProperties().map(p => ({ p, score: aiScoreProperty(p,intent) }))
    .filter(x => x.score > .75)
    .sort((a,b) => b.score - a.score || new Date(b.p.createdAt || 0) - new Date(a.p.createdAt || 0))
    .slice(0,4)
    .map(x => x.p);
  return { intent, items };
}
function aiMiniResultCard(p){
  const img = firstImage(p);
  const price = propertyPriceText(p);
  return `<a class="ai-result-card" href="${propertyUrl(p.id)}">
    ${img ? `<img src="${img}" alt="${safeText(propertyTitle(p))}" loading="lazy">` : '<span class="ai-result-noimg"></span>'}
    <span><strong>${safeText(propertyTitle(p))}</strong><small>${propertyLocation(p)}</small>${price ? `<b>${price}</b>` : ''}</span>
  </a>`;
}
const AI_PROVIDER_NAME = 'Pollinations.ai';
const AI_MODEL = 'openai';
const AI_TRANSLATION_MODEL = 'openai-fast';
const AI_ENDPOINT = 'https://text.pollinations.ai/openai?referrer=merade-immobilier';
const AI_TIMEOUT_MS = 14000;
function aiFetchWithTimeout(url, options = {}, timeout = AI_TIMEOUT_MS){
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}
function aiFormatListingForPrompt(p, index){
  const price = propertyPriceText(p) || 'price not listed';
  const bits = [
    `${index + 1}. ${propertyTitle(p)}`,
    `type: ${catLabel(p.category) || p.category || 'property'}`,
    `status: ${statusTypeLabel(p) || p.status || 'available'}`,
    `location: ${propertyLocation(p) || 'Algeria'}`,
    `rooms: ${p.rooms || p.bedrooms || 'not listed'}`,
    `surface: ${p.surface || p.landSurface || 'not listed'}`,
    `price: ${price}`,
    `virtual tour: ${hasVirtualTour(p) ? 'yes' : 'no'}`,
    `link: ${propertyUrl(p.id)}`
  ];
  return bits.join(' | ');
}
function aiBuildPrompt(query, items){
  const langName = aiLang() === 'ar' || hasArabic(query) ? 'Arabic' : (aiLang() === 'fr' ? 'French' : 'English');
  const listings = items.length ? items.map(aiFormatListingForPrompt).join('\n') : 'No strong matching listings were found by the website matcher.';
  return `You are Merade AI, the website assistant for Merade Immobilier in Algeria.
Reply in ${langName}, or in the same language/dialect used by the visitor.
Be helpful, short, warm, and practical. Use Algerian real-estate context when useful.
The visitor can ask about buying, renting, property choice, budget, neighborhoods, paperwork basics, or the listings.
For property recommendations, use ONLY the website listings provided below. Do not invent properties, prices, phone numbers, or availability. If the listings are not enough, ask for city, budget, property type, rooms, and whether they want buying or renting.
When matching listings exist, mention the best 1-3 options and why they fit. End with a simple next step: open the listing card or contact Merade Immobilier.

Visitor message: ${query}

Website listing matches:
${listings}`;
}
function aiExtractProviderText(response){
  if(typeof response === 'string') return response;
  if(response?.text) return response.text;
  if(response?.content && typeof response.content === 'string') return response.content;
  const choiceContent = response?.choices?.[0]?.message?.content || response?.choices?.[0]?.text;
  if(typeof choiceContent === 'string') return choiceContent;
  if(Array.isArray(choiceContent)) return choiceContent.map(part => part?.text || part?.content || '').join(' ').trim();
  const content = response?.message?.content;
  if(typeof content === 'string') return content;
  if(Array.isArray(content)) return content.map(part => part?.text || part?.content || '').join(' ').trim();
  return '';
}
function parseAiJson(text){
  const cleaned = clean(text).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
  const start = cleaned.indexOf('{'), end = cleaned.lastIndexOf('}');
  if(start < 0 || end <= start) throw new Error('Translation response was not JSON.');
  return JSON.parse(cleaned.slice(start, end + 1));
}
function splitTranslationText(value, maxLength = 2400){
  const text = String(value || '').replace(/\r\n/g,'\n').trim();
  if(!text) return [];
  const chunks = [];
  for(const paragraph of text.split(/\n{2,}/)){
    let remaining = paragraph.trim();
    while(remaining.length > maxLength){
      let cut = remaining.lastIndexOf(' ', maxLength);
      if(cut < Math.floor(maxLength * .6)) cut = maxLength;
      chunks.push(remaining.slice(0, cut).trim());
      remaining = remaining.slice(cut).trim();
    }
    if(remaining) chunks.push(remaining);
  }
  return chunks;
}
function normalizedFactText(value){
  const arabicDigits = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9'};
  return String(value || '')
    .replace(/[٠-٩۰-۹]/g, digit => arabicDigits[digit])
    .replace(/[٫،]/g,'.')
    .replace(/٬/g,'')
    .replace(/(\d),(\d)/g,'$1.$2');
}
function validateTranslationFacts(source, result){
  const sourceFacts = normalizedFactText(source);
  const numbers = sourceFacts.match(/\d+(?:\.\d+)?/g) || [];
  const requiresMd = /(^|\s)Md(?=\s|[.,;:!?)]|$)/.test(source);
  const requiresM = /(^|\s)m(?=\s|[.,;:!?)]|$)/.test(source);
  for(const lang of ['en','fr','ar']){
    validateTranslationFactsForLanguage(source, result[lang], lang, { sourceFacts, numbers, requiresMd, requiresM });
  }
}
function validateTranslationFactsForLanguage(source, translated, lang, facts){
  const sourceFacts = facts?.sourceFacts ?? normalizedFactText(source);
  const numbers = facts?.numbers ?? (sourceFacts.match(/\d+(?:\.\d+)?/g) || []);
  const requiresMd = facts?.requiresMd ?? /(^|\s)Md(?=\s|[.,;:!?)]|$)/.test(source);
  const requiresM = facts?.requiresM ?? /(^|\s)m(?=\s|[.,;:!?)]|$)/.test(source);
  const target = normalizedFactText(translated);
  const targetNumbers = target.match(/\d+(?:\.\d+)?/g) || [];
  const hasNumber = number => targetNumbers.some(candidate => candidate === number || Number(candidate) === Number(number));
  if(numbers.some(number => !hasNumber(number))) throw new Error(`Translation lost a number in ${lang}.`);
  if(requiresMd && !/(^|\s)Md(?=\s|[.,;:!?)]|$)/i.test(translated)) throw new Error(`Translation lost Md in ${lang}.`);
  if(requiresM && !/(^|\s)m(?=\s|[.,;:!?)]|$)/i.test(translated)) throw new Error(`Translation lost m in ${lang}.`);
}
const TRANSLATION_LANGUAGE_NAMES = { en:'English', fr:'French', ar:'Modern Standard Arabic' };
let TRANSLATION_PROVIDER_COOLDOWN_UNTIL = 0;
async function requestTranslationProvider(payload, timeout = 22000){
  if(Date.now() < TRANSLATION_PROVIDER_COOLDOWN_UNTIL){
    const cooldownError = new Error('Primary translation provider is rate limited.');
    cooldownError.status = 429;
    throw cooldownError;
  }
  let lastError;
  for(let attempt=0;attempt<3;attempt++){
    const response = await aiFetchWithTimeout(AI_ENDPOINT, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify(payload)
    }, timeout);
    const data = await response.json().catch(async () => ({ text:await response.text().catch(()=>'') }));
    if(response.ok) return data;
    lastError = new Error(data?.error?.message || data?.message || `Translation error ${response.status}`);
    lastError.status = response.status;
    if(response.status === 429){
      TRANSLATION_PROVIDER_COOLDOWN_UNTIL = Date.now() + 120000;
      throw lastError;
    }
    if(attempt === 2 || response.status < 500) throw lastError;
    const retryAfter = Number(response.headers.get('retry-after') || 0) * 1000;
    const delay = Math.min(8000, Math.max(retryAfter, 1600 * (attempt + 1)));
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw lastError || new Error('Translation provider unavailable.');
}
function detectTranslationSourceLanguage(value){
  const text = clean(value);
  if(/[\u0600-\u06ff]/.test(text)) return 'ar';
  const frenchWords = (text.toLowerCase().match(/\b(le|la|les|de|des|du|une|un|avec|dans|sur|pour|résidence|chambre|salon|terrasse|chauffage|climatisation|vente|location|meublé|ascenseur|interphone|alarme|bâtiment|isolation|thermique|acoustique)\b/g) || []).length;
  return /[àâçéèêëîïôùûüÿœæ]/i.test(text) || frenchWords > 0 ? 'fr' : 'en';
}
function sourcePropertyTranslations(prop){
  const title = clean(prop?.title);
  const description = clean(prop?.description);
  const features = (prop?.features || []).map(clean).filter(Boolean);
  const tourRooms = (prop?.virtualTourRooms || prop?.virtual_tour_rooms || []).map(room => clean(room?.room)).filter(Boolean);
  const sourceText = [title, description, ...features, ...tourRooms].filter(Boolean).join('\n');
  if(!sourceText) return {};
  const lang = detectTranslationSourceLanguage(sourceText);
  return { [lang]:{ title, description, features, tourRooms } };
}
function decodeTranslationEntities(value){
  const area = document.createElement('textarea');
  area.innerHTML = String(value || '');
  return clean(area.value);
}
function knownPropertyTermTranslation(value, lang){
  const terms = {
    'meublé':{en:'Furnished',fr:'Meublé',ar:'مفروش'},
    'chauffage':{en:'Heating',fr:'Chauffage',ar:'تدفئة'},
    'climatisation':{en:'Air conditioning',fr:'Climatisation',ar:'تكييف'},
    'ascenseur':{en:'Elevator',fr:'Ascenseur',ar:'مصعد'},
    'interphone':{en:'Intercom',fr:'Interphone',ar:'هاتف داخلي'},
    'alarme':{en:'Alarm system',fr:'Alarme',ar:'نظام إنذار'},
    'garage':{en:'Garage',fr:'Garage',ar:'مرآب'},
    'terrasse':{en:'Terrace',fr:'Terrasse',ar:'شرفة'},
    'résidence fermée':{en:'Gated residence',fr:'Résidence fermée',ar:'إقامة مغلقة'},
    'vidéo surveillance':{en:'Video surveillance',fr:'Vidéo surveillance',ar:'مراقبة بالفيديو'},
    'bâtiment moderne':{en:'Modern building',fr:'Bâtiment moderne',ar:'مبنى حديث'},
    'isolation thermique':{en:'Thermal insulation',fr:'Isolation thermique',ar:'عزل حراري'},
    'isolation acoustique':{en:'Acoustic insulation',fr:'Isolation acoustique',ar:'عزل صوتي'}
  };
  return terms[clean(value).toLowerCase()]?.[lang] || '';
}
async function requestMemoryTranslation(source, lang){
  const text = clean(source);
  if(!text) return '';
  const knownTerm = knownPropertyTermTranslation(text, lang);
  if(knownTerm) return knownTerm;
  const sourceLang = detectTranslationSourceLanguage(text);
  if(sourceLang === lang) return text;
  const byteLength = typeof TextEncoder === 'function' ? new TextEncoder().encode(text).length : text.length * 2;
  if(byteLength > 450){
    const maxChars = Math.max(120, Math.floor(text.length * 420 / byteLength));
    const parts = splitTranslationText(text, maxChars);
    if(parts.length < 2) throw new Error('Translation segment is too long for the fallback engine.');
    const translatedParts = [];
    for(const part of parts) translatedParts.push(await requestMemoryTranslation(part, lang));
    return translatedParts.join('\n\n');
  }
  const protectedValues = [];
  const protectValue = value => {
    const token = `ZXQPN${protectedValues.length}QXZ`;
    protectedValues.push({ token, value });
    return token;
  };
  // Fallback engines can spell numeric values as words in Arabic, and often
  // reinterpret French "Md" as a measurement such as m². Mask every number and
  // mandatory price unit so the restored translation keeps the exact facts.
  let protectedText = text.replace(/\d+(?:[.,]\d+)?/g, number => protectValue(number));
  protectedText = protectedText.replace(/(^|\s)(Md|m)(?=\s|[.,;:!?)]|$)/g, (match, prefix, unit) => `${prefix}${protectValue(unit)}`);
  protectedText = protectedText.replace(/\b[A-Z][A-Z0-9&.'’\-]{2,}(?:\s+[A-Z][A-Z0-9&.'’\-]{2,})+\b/g, name => protectValue(name));
  const endpoint = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(protectedText)}&langpair=${encodeURIComponent(`${sourceLang}|${lang}`)}&mt=1`;
  const response = await aiFetchWithTimeout(endpoint, { method:'GET' }, 15000);
  const data = await response.json().catch(() => null);
  if(!response.ok || Number(data?.responseStatus || response.status) !== 200) throw new Error(data?.responseDetails || `Fallback translation error ${response.status}`);
  let translated = decodeTranslationEntities(data?.responseData?.translatedText);
  // A protected proper-name span can contain an earlier number token (for
  // example "Appartement F5"). Restore outer spans first, then their nested
  // tokens, so no placeholder can leak into validation or the rendered text.
  protectedValues.slice().reverse().forEach(({token,value}) => { translated = translated.replace(new RegExp(token, 'gi'), value); });
  if(!translated) throw new Error('Fallback translation response was empty.');
  validateTranslationFactsForLanguage(text, translated, lang);
  return translated;
}
async function requestAutomaticShortTextBatch(values, lang, kind = 'short real-estate labels', fallbackOnly = false){
  const source = values.map(clean).filter(Boolean);
  if(!source.length) return [];
  if(source.length > 20){
    const batches = [];
    for(let start=0;start<source.length;start+=20) batches.push(source.slice(start,start+20));
    const translated = [];
    for(const batch of batches) translated.push(...await requestAutomaticShortTextBatch(batch, lang, kind, fallbackOnly));
    return translated;
  }
  if(fallbackOnly){
    const translated = [];
    for(let start=0;start<source.length;start+=4){
      translated.push(...await Promise.all(source.slice(start,start+4).map(value => requestMemoryTranslation(value, lang))));
    }
    return translated.map((value,index) => knownPropertyTermTranslation(source[index], lang) || value);
  }
  const targetName = TRANSLATION_LANGUAGE_NAMES[lang] || TRANSLATION_LANGUAGE_NAMES.en;
  let translated = [];
  try{
    const data = await requestTranslationProvider({
      model:AI_TRANSLATION_MODEL,
      messages:[
        { role:'system', content:`You are a meticulous professional real-estate translator for Algeria. Translate every ${kind} into ${targetName}. Preserve names, locations, facts, numbers, Md/m, and array order exactly. Never add, remove, summarize, or explain information. Return ONLY valid JSON with exactly this shape: {"translations":["..."]}.` },
        { role:'user', content:JSON.stringify(source) }
      ],
      temperature:0,
      max_tokens:1800,
      response_format:{ type:'json_object' },
      stream:false
    });
    const parsed = parseAiJson(aiExtractProviderText(data));
    translated = Array.isArray(parsed.translations) ? parsed.translations.map(clean) : [];
  }catch(primaryError){
    for(const value of source) translated.push(await requestMemoryTranslation(value, lang));
  }
  translated = translated.map((value,index) => knownPropertyTermTranslation(source[index], lang) || value);
  if(translated.length !== source.length || translated.some(value => !value)) throw new Error(`Short translation batch was incomplete for ${lang}.`);
  source.forEach((value,index) => validateTranslationFactsForLanguage(value, translated[index], lang));
  return translated;
}
async function requestAutomaticTextForLanguage(source, lang, kind = 'property description', fallbackOnly = false){
  if(fallbackOnly) return requestMemoryTranslation(source, lang);
  const targetName = TRANSLATION_LANGUAGE_NAMES[lang] || TRANSLATION_LANGUAGE_NAMES.en;
  let translated = '';
  try{
    const data = await requestTranslationProvider({
      model:AI_TRANSLATION_MODEL,
      messages:[
        { role:'system', content:`You are a meticulous professional real-estate translator for Algeria. Translate the supplied ${kind} into ${targetName}. Preserve every fact, number, proper noun, phone number, measurement, paragraph meaning, emoji heading, and Md/m exactly. Never summarize, embellish, explain, add, or omit information. Return ONLY valid JSON with exactly this shape: {"translation":"..."}.` },
        { role:'user', content:source }
      ],
      temperature:0,
      max_tokens:1800,
      response_format:{ type:'json_object' },
      stream:false
    });
    const parsed = parseAiJson(aiExtractProviderText(data));
    translated = clean(parsed.translation);
  }catch(primaryError){
    translated = await requestMemoryTranslation(source, lang);
  }
  if(!translated) throw new Error(`Text translation was incomplete for ${lang}.`);
  validateTranslationFactsForLanguage(source, translated, lang);
  return translated;
}
async function translateTextResiliently(source, lang, kind, depth = 0, fallbackOnly = false){
  const text = clean(source);
  if(!text) return '';
  try{ return await requestAutomaticTextForLanguage(text, lang, kind, fallbackOnly); }
  catch(err){
    if(depth >= 3 || text.length <= 180) throw err;
    const parts = splitTranslationText(text, Math.max(160, Math.ceil(text.length / 2)));
    if(parts.length < 2) throw err;
    const translated = await Promise.all(parts.map(part => translateTextResiliently(part, lang, kind, depth + 1, fallbackOnly)));
    return translated.join('\n\n');
  }
}
async function translatePropertyContentForLanguage(prop, lang, visitorMode = false){
  const title = clean(prop?.title);
  const description = clean(prop?.description);
  const features = (prop?.features || []).map(clean).filter(Boolean);
  const tourRooms = (prop?.virtualTourRooms || prop?.virtual_tour_rooms || []).map(room => clean(room?.room)).filter(Boolean);
  const shortSource = [title, ...features, ...tourRooms].filter(Boolean);
  const descriptionChunks = splitTranslationText(description, 720);
  const shortTranslated = await requestAutomaticShortTextBatch(shortSource, lang, 'property title, feature, or virtual-tour room name', visitorMode);
  const descriptionTranslated = [];
  if(visitorMode){
    descriptionTranslated.push(...await Promise.all(descriptionChunks.map(chunk => translateTextResiliently(chunk, lang, 'property description', 0, true))));
  }else{
    for(const chunk of descriptionChunks) descriptionTranslated.push(await translateTextResiliently(chunk, lang, 'property description'));
  }
  let cursor = 0;
  const result = { title:'', description:descriptionTranslated.join('\n\n'), features:[], tourRooms:[] };
  if(title) result.title = shortTranslated[cursor++] || '';
  result.features = shortTranslated.slice(cursor, cursor + features.length); cursor += features.length;
  result.tourRooms = shortTranslated.slice(cursor, cursor + tourRooms.length);
  if(title && !result.title) throw new Error(`Property title translation was missing for ${lang}.`);
  if(description && !result.description) throw new Error(`Property description translation was missing for ${lang}.`);
  if(result.features.length !== features.length) throw new Error(`Property feature translation was incomplete for ${lang}.`);
  if(result.tourRooms.length !== tourRooms.length) throw new Error(`Virtual-tour room translation was incomplete for ${lang}.`);
  return result;
}
async function translatePropertyContent(prop){
  const result = {};
  for(const lang of ['en','fr','ar']){
    result[lang] = await translatePropertyContentForLanguage(prop, lang);
  }
  return result;
}
const VISITOR_TRANSLATION_CACHE_KEY = 'meradeVisitorTranslationsV8';
function translationFingerprint(prop){
  const rooms = (prop?.virtualTourRooms || prop?.virtual_tour_rooms || []).map(room => room?.room || '');
  const source = [prop?.id,prop?.title,prop?.description,...(prop?.featureKeys || []),...(prop?.features || []),...rooms].join('|');
  let hash = 2166136261;
  for(let i=0;i<source.length;i++){ hash ^= source.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  return `${clean(prop?.id) || 'property'}-${(hash >>> 0).toString(36)}`;
}
function visitorTranslationCache(){
  try{ const value = JSON.parse(localStorage.getItem(VISITOR_TRANSLATION_CACHE_KEY)); return value && typeof value === 'object' ? value : {}; }
  catch{ return {}; }
}
function writeVisitorTranslationCache(cache){
  try{
    const keys = Object.keys(cache);
    while(keys.length > 60) delete cache[keys.shift()];
    localStorage.setItem(VISITOR_TRANSLATION_CACHE_KEY, JSON.stringify(cache));
  }catch{}
}
function mergePropertyTranslations(prop, incoming){
  if(!prop || !incoming) return;
  prop.translations = prop.translations && typeof prop.translations === 'object' ? prop.translations : {};
  for(const lang of ['en','fr','ar']){
    const current = prop.translations[lang] && typeof prop.translations[lang] === 'object' ? prop.translations[lang] : {};
    const next = incoming[lang] && typeof incoming[lang] === 'object' ? incoming[lang] : {};
    prop.translations[lang] = {
      title:clean(current.title) || clean(next.title),
      description:clean(current.description) || clean(next.description),
      features:Array.isArray(current.features) && current.features.length ? current.features : (Array.isArray(next.features) ? next.features.map(clean).filter(Boolean) : []),
      tourRooms:Array.isArray(current.tourRooms) && current.tourRooms.length ? current.tourRooms : (Array.isArray(next.tourRooms) ? next.tourRooms.map(clean).filter(Boolean) : [])
    };
  }
}
function applyCachedVisitorTranslation(prop){
  const cache = visitorTranslationCache();
  const cached = cache[translationFingerprint(prop)];
  if(cached) mergePropertyTranslations(prop, cached);
}
function cacheVisitorTranslation(prop){
  const cache = visitorTranslationCache();
  const key = translationFingerprint(prop);
  const existing = cache[key] || {};
  const combined = {};
  for(const lang of ['en','fr','ar']) combined[lang] = { ...(existing[lang] || {}), ...(prop.translations?.[lang] || {}) };
  delete cache[key];
  cache[key] = combined;
  writeVisitorTranslationCache(cache);
}
function propertyNeedsFullTranslation(prop, lang){
  const translated = prop?.translations?.[lang] || {};
  if(clean(prop?.title) && !clean(translated.title)) return true;
  if(clean(prop?.description) && !clean(translated.description)) return true;
  if((prop?.features || []).length && !(Array.isArray(translated.features) && translated.features.length)) return true;
  const rooms = prop?.virtualTourRooms || prop?.virtual_tour_rooms || [];
  if(rooms.length && !(Array.isArray(translated.tourRooms) && translated.tourRooms.length === rooms.length)) return true;
  return false;
}
async function requestAutomaticTitleBatch(properties, lang){
  const titles = properties.map(p => clean(p.title));
  const values = await requestAutomaticShortTextBatch(titles, lang, 'property title');
  return properties.map((property,index) => {
    return { [lang]:{ title:values[index] } };
  });
}
async function prepareVisitorPropertyTranslations(){
  if(isAdminScreen()) return;
  const lang = currentLang();
  const properties = allProperties();
  properties.forEach(applyCachedVisitorTranslation);
  if($('#propertyDetail')){
    const id = new URL(location.href).searchParams.get('id');
    const property = properties.find(item => item.id === id);
    if(property && propertyNeedsFullTranslation(property, lang)){
      try{
        const translated = await translatePropertyContentForLanguage(property, lang, true);
        mergePropertyTranslations(property, { [lang]:translated });
        cacheVisitorTranslation(property);
      }catch(err){ console.warn('Automatic property translation failed:', err); }
    }
    return;
  }
  const missingTitles = properties.filter(property => clean(property.title) && !clean(property.translations?.[lang]?.title));
  for(let start=0;start<missingTitles.length;start+=12){
    const batch = missingTitles.slice(start,start+12);
    try{
      const translated = await requestAutomaticTitleBatch(batch, lang);
      batch.forEach((property,index) => { mergePropertyTranslations(property, translated[index]); cacheVisitorTranslation(property); });
    }catch(err){ console.warn('Automatic title translation failed:', err); }
  }
}
async function aiAskProvider(query, items){
  const response = await aiFetchWithTimeout(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: aiBuildPrompt('', items).split('Visitor message:')[0].trim() },
        { role: 'user', content: aiBuildPrompt(query, items) }
      ],
      temperature: 0.35,
      max_tokens: 360,
      stream: false
    })
  });
  const data = await response.json().catch(async () => ({ text: await response.text().catch(() => '') }));
  if(!response.ok) throw new Error(data?.error?.message || data?.message || `${AI_PROVIDER_NAME} error ${response.status}`);
  const text = clean(aiExtractProviderText(data));
  if(!text) throw new Error('Empty AI response');
  return text;
}
function aiFallbackReply(items){
  if(items.length){
    return `${safeText(aiText('ai.results'))}<div class="ai-results">${items.map(aiMiniResultCard).join('')}</div>`;
  }
  return `${safeText(aiText('ai.noResults'))}<br><small>${safeText(aiText('ai.onlySite'))}</small>`;
}

function initPropertyAI(){
  if($('#aiPropertyAssistant') || isAdminScreen()) return;
  const wrap = document.createElement('div');
  wrap.className = 'ai-assistant';
  wrap.id = 'aiPropertyAssistant';
  wrap.innerHTML = `<button class="ai-float" id="aiFloatBtn" type="button" aria-label="${safeText(aiText('ai.nudge'))}"><span>AI</span></button>
    <div class="ai-nudge" id="aiNudge">${safeText(aiText('ai.nudge'))}</div>
    <section class="ai-panel" id="aiPanel" aria-label="${safeText(aiText('ai.title'))}">
      <div class="ai-panel-head"><div><strong>${safeText(aiText('ai.title'))}</strong><small>${safeText(aiText('ai.subtitle'))}</small></div><button type="button" id="aiCloseBtn" aria-label="Close">×</button></div>
      <div class="ai-messages" id="aiMessages"><div class="ai-msg ai-bot">${safeText(aiText('ai.welcome'))}<br><small>${safeText(aiText('ai.onlySite'))}</small></div></div>
      <div class="ai-quick"><button type="button" data-ai-sample="اريد شقة اربع غرف">شقة 4 غرف</button><button type="button" data-ai-sample="villa avec 360">Villa 360</button><button type="button" data-ai-sample="rent house in Batna">Rent house</button></div>
      <form class="ai-form" id="aiForm"><input id="aiInput" autocomplete="off" placeholder="${safeText(aiText('ai.placeholder'))}"><button type="submit">${safeText(aiText('ai.send'))}</button></form>
    </section>`;
  document.body.appendChild(wrap);
  const dismissNudgeOnScroll = () => {
    if(window.scrollY <= 80) return;
    wrap.classList.add('nudge-dismissed');
    window.removeEventListener('scroll', dismissNudgeOnScroll);
  };
  window.addEventListener('scroll', dismissNudgeOnScroll, { passive:true });
  dismissNudgeOnScroll();
  const panel = $('#aiPanel'), input = $('#aiInput'), messages = $('#aiMessages');
  const open = () => { wrap.classList.add('open'); setTimeout(()=>input?.focus(),80); };
  const close = () => wrap.classList.remove('open');
  $('#aiFloatBtn')?.addEventListener('click', () => wrap.classList.contains('open') ? close() : open());
  $('#aiNudge')?.addEventListener('click', open);
  $('#aiCloseBtn')?.addEventListener('click', close);
  function addMessage(html, who='bot'){
    const div = document.createElement('div');
    div.className = `ai-msg ai-${who}`;
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
  async function answer(query){
    addMessage(safeText(query), 'user');
    const { items } = aiFindMatches(query);
    const thinking = addMessage('<span class="ai-thinking">Merade AI is writing…</span>', 'bot');
    try{
      const text = await aiAskProvider(query, items);
      thinking.innerHTML = `${safeText(text).replace(/\n/g,'<br>')}${items.length ? `<div class="ai-results">${items.map(aiMiniResultCard).join('')}</div>` : `<br><small>${safeText(aiText('ai.onlySite'))}</small>`}`;
    } catch(err){
      console.warn('AI provider unavailable; using local fallback.', err);
      thinking.innerHTML = aiFallbackReply(items);
    }
    messages.scrollTop = messages.scrollHeight;
  }
  $('#aiForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const value = clean(input?.value);
    if(!value) return;
    input.value = '';
    answer(value);
  });
  $$('[data-ai-sample]', wrap).forEach(btn => btn.addEventListener('click', () => { open(); answer(btn.dataset.aiSample); }));
}

async function init(){
  showPageLoader();

  applyLanguage(); bindLanguageSelectors(); applyExtraTranslations(); bindExtraTranslationRefresh();
  LOCATION_DATA = fallbackLocationData();
  fillWilayaSelects(); applyUrlFilters(); bindLocationControls();
  initNav(); initReveal(); initStatCounters(); initSearchBox(); initContactForm();

  try{
    const [, locationsResult] = await Promise.allSettled([loadDatabaseProperties(), loadLocationData()]);
    if(locationsResult.status === 'fulfilled') LOCATION_DATA = locationsResult.value;
    fillWilayaSelects(); applyUrlFilters(); bindLocationControls();

    // Follow the visitor's device language on first visit and translate dynamic
    // property content before it is rendered. Saved/cached translations are
    // reused, so the translation engine is only called for missing content.
    await prepareVisitorPropertyTranslations();

    // Render data-dependent UI only after Supabase/local data has settled.
    // This prevents the homepage hero from first showing a partial/fallback set
    // and then jumping to the full 8 slides a moment later.
    initHeroSlider();
    initHeroScrollScene();
    initScrollInkTitles();
    initListings();
    initHomeCities();
    initHomePropertyShowcases();
    initLatestIntentScrollMotion();
    initPropertyAI();
    initPropertyDetail();
    await initAdmin();
    if($('#adminList')){ renderAdminList(); fillAdminStats(); }
  } finally {
    hidePageLoader();
  }
}
document.addEventListener('DOMContentLoaded', init);
