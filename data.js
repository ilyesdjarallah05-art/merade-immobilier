/* Merade Immobilier - restored property catalogue.
   Supabase remains the source of truth when it contains published listings. */

const MERADE_DEFAULT_PROPERTIES = [
  {
    id:'merade-property-01', title:'Villa semi-finie à Dely Ibrahim', category:'villas', status:'sale', wilaya:'16 - Alger', commune:'Dely Ibrahim',
    price:'18', currency:'Md', surface:'470', rooms:'8', bedrooms:'6', bathrooms:'4', floor:'R+2', landSurface:'', yearBuilt:'', phone:'',
    address:'Dely Ibrahim, Alger', description:'Villa spacieuse semi-finie située dans un quartier résidentiel calme de Dely Ibrahim. Les volumes généreux, les grandes ouvertures et les différents niveaux permettent de personnaliser facilement les espaces de vie.',
    features:['Garage','Jardin','Terrasse','Chauffage','Résidence fermée'],
    images:['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:true, heroFeatured:true, heroOrder:1, createdAt:'2026-07-20T10:00:00.000Z'
  },
  {
    id:'merade-property-02', title:'Villa R+1 à Ouled Fayet', category:'villas', status:'sale', wilaya:'16 - Alger', commune:'Ouled Fayet',
    price:'14', currency:'Md', surface:'455', rooms:'6', bedrooms:'5', bathrooms:'3', floor:'R+1', landSurface:'', yearBuilt:'', phone:'',
    address:'Ouled Fayet, Alger', description:'Villa familiale R+1 avec des pièces lumineuses, une distribution pratique et de beaux espaces extérieurs. Elle se trouve à proximité des services essentiels et des principaux axes routiers.',
    features:['Garage','Jardin','Balcon','Climatisation','Sécurité'],
    images:['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:true, heroFeatured:true, heroOrder:2, createdAt:'2026-07-20T09:00:00.000Z'
  },
  {
    id:'merade-property-03', title:'Duplex F9 à El Kouba', category:'duplex', status:'sale', wilaya:'16 - Alger', commune:'Kouba',
    price:'8.5', currency:'Md', surface:'326', rooms:'9', bedrooms:'8', bathrooms:'2', floor:'', landSurface:'', yearBuilt:'', phone:'',
    address:'Kouba, Alger', description:'Grand duplex F9 offrant deux niveaux bien organisés, plusieurs espaces de réception et des chambres confortables. Une configuration adaptée à une grande famille au cœur de Kouba.',
    features:['Parking','Terrasse','Chauffage','Interphone','Isolation phonique'],
    images:['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:true, heroFeatured:true, heroOrder:3, createdAt:'2026-07-20T08:00:00.000Z'
  },
  {
    id:'merade-property-04', title:'Villa moderne à Bordj El Bahri', category:'villas', status:'sale', wilaya:'16 - Alger', commune:'Bordj El Bahri',
    price:'7.6', currency:'Md', surface:'150', rooms:'12', bedrooms:'10', bathrooms:'5', floor:'R+3', landSurface:'', yearBuilt:'', phone:'',
    address:'Bordj El Bahri, Alger', description:'Villa moderne développée sur plusieurs niveaux avec de nombreuses chambres et des espaces de vie ouverts. Sa situation permet de profiter rapidement du littoral et des commodités environnantes.',
    features:['Garage','Terrasse','Climatisation','Vidéosurveillance','Bâtiment moderne'],
    images:['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:true, heroFeatured:true, heroOrder:4, createdAt:'2026-07-20T07:00:00.000Z'
  },
  {
    id:'merade-property-05', title:'Appartement F4 spacieux à Draria', category:'apartments', status:'sale', wilaya:'16 - Alger', commune:'Draria',
    price:'4.4', currency:'Md', surface:'160', rooms:'4', bedrooms:'3', bathrooms:'1', floor:'3', landSurface:'', yearBuilt:'', phone:'',
    address:'Draria, Alger', description:'Appartement F4 spacieux et lumineux avec un séjour convivial et une circulation fluide entre les pièces. L’environnement résidentiel offre un accès pratique aux commerces, écoles et transports.',
    features:['Ascenseur','Parking','Balcon','Chauffage','Interphone'],
    images:['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:true, heroFeatured:true, heroOrder:5, createdAt:'2026-07-20T06:00:00.000Z'
  },
  {
    id:'merade-property-06', title:'Appartement F4 haut standing à El Achour', category:'apartments', status:'sale', wilaya:'16 - Alger', commune:'El Achour',
    price:'4.3', currency:'Md', surface:'149', rooms:'4', bedrooms:'3', bathrooms:'1', floor:'4', landSurface:'', yearBuilt:'', phone:'',
    address:'El Achour, Alger', description:'Appartement F4 haut standing aux finitions soignées, doté de pièces bien proportionnées et d’une belle luminosité. La résidence bénéficie d’un cadre calme à El Achour.',
    features:['Ascenseur','Parking','Cuisine équipée','Climatisation','Résidence fermée'],
    images:['https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1560448075-bb485b067938?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:true, heroFeatured:true, heroOrder:6, createdAt:'2026-07-20T05:00:00.000Z'
  },
  {
    id:'merade-property-07', title:'Triplex moderne à H’raoua', category:'triplex', status:'sale', wilaya:'16 - Alger', commune:'H’raoua',
    price:'4.3', currency:'Md', surface:'114', rooms:'6', bedrooms:'4', bathrooms:'3', floor:'Triplex', landSurface:'', yearBuilt:'', phone:'',
    address:'H’raoua, Alger', description:'Triplex moderne pensé pour séparer agréablement les espaces de réception, de repos et de service. Les terrasses et les ouvertures apportent lumière naturelle et confort au quotidien.',
    features:['Terrasse','Garage','Chauffage','Climatisation','Isolation thermique'],
    images:['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600607688960-e095ff83135c?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:false, heroFeatured:false, createdAt:'2026-07-20T04:00:00.000Z'
  },
  {
    id:'merade-property-08', title:'Appartement F4 à Bir Khadem', category:'apartments', status:'sale', wilaya:'16 - Alger', commune:'Bir Khadem',
    price:'3.98', currency:'Md', surface:'120', rooms:'4', bedrooms:'3', bathrooms:'2', floor:'2', landSurface:'', yearBuilt:'', phone:'',
    address:'Bir Khadem, Alger', description:'Appartement F4 fonctionnel avec trois chambres, deux salles d’eau et un séjour confortable. Son emplacement à Bir Khadem facilite les déplacements vers les quartiers voisins.',
    features:['Parking','Balcon','Interphone','Chauffage','Gardien'],
    images:['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:false, heroFeatured:false, createdAt:'2026-07-20T03:00:00.000Z'
  },
  {
    id:'merade-property-09', title:'Villa R+1 à Fouka', category:'villas', status:'sale', wilaya:'42 - Tipaza', commune:'Fouka',
    price:'3.7', currency:'Md', surface:'340', rooms:'8', bedrooms:'6', bathrooms:'4', floor:'R+1', landSurface:'', yearBuilt:'', phone:'',
    address:'Fouka, Tipaza', description:'Villa R+1 familiale disposant de plusieurs chambres, d’un garage et d’espaces extérieurs appréciables. Elle se situe dans un secteur paisible de Fouka, à distance raisonnable de la côte.',
    features:['Garage','Jardin','Terrasse','Climatisation','Alarme'],
    images:['https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:false, heroFeatured:false, createdAt:'2026-07-20T02:00:00.000Z'
  },
  {
    id:'merade-property-10', title:'Duplex lumineux à Mohammadia', category:'duplex', status:'sale', wilaya:'16 - Alger', commune:'Mohammadia',
    price:'3.7', currency:'Md', surface:'180', rooms:'5', bedrooms:'3', bathrooms:'2', floor:'', landSurface:'', yearBuilt:'', phone:'',
    address:'Mohammadia, Alger', description:'Duplex lumineux avec un séjour généreux, trois chambres et deux salles d’eau. Sa configuration contemporaine et son emplacement à Mohammadia en font un bien pratique pour la vie familiale.',
    features:['Ascenseur','Parking','Balcon','Climatisation','Vidéosurveillance'],
    images:['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=960&q=36&fm=webp&fit=crop&auto=format','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=960&q=36&fm=webp&fit=crop&auto=format'],
    featured:false, heroFeatured:false, createdAt:'2026-07-20T01:00:00.000Z'
  }
];
