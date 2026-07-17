-- Private Merade demo dataset based on factual fields visible to visitors at
-- https://omarimmobilier.com/properties/sell on 2026-07-17.
--
-- Important:
--   * Exact third-party descriptions, contact details and photo galleries are
--     intentionally not copied.
--   * The descriptions below are original, short demo summaries.
--   * Gallery media uses Unsplash images that are licensed for website use.
--   * Every row is inserted with is_published = false, so visitors cannot see it.
--   * The seed is idempotent: running it again skips titles already imported.

with photo_pool(images) as (
  values (array[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1400&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1400&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=80',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1400&q=80',
    'https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?w=1400&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1400&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=80',
    'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1400&q=80',
    'https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=1400&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1400&q=80',
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1400&q=80',
    'https://images.unsplash.com/photo-1600607688066-890987f18a86?w=1400&q=80'
  ]::text[])
),
listing_data(
  title, category, wilaya, commune, address, price, surface,
  rooms, bedrooms, bathrooms, description, features, image_offset
) as (
  values
  (
    '[Démo] Villa semi-finie à Dely Ibrahim', 'villas', '16 - Alger', 'Dely Ibrahim', 'Dely Ibrahim, Alger',
    18::numeric, 470::numeric, null, null, null,
    'Donnée de démonstration privée : villa semi-finie de 470 m² située à Dely Ibrahim, proposée à un prix négociable.',
    array['Villa', 'Semi-fini', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 1
  ),
  (
    '[Démo] Villa R+1 à Ouled Fayet', 'villas', '16 - Alger', 'Ouled Fayet', 'Ouled Fayet, Alger',
    14::numeric, 455::numeric, '6', '5', '3',
    'Donnée de démonstration privée : villa R+1 de 455 m² à Ouled Fayet avec cinq chambres et trois salles de bain.',
    array['Villa R+1', '5 chambres', '3 salles de bain', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 2
  ),
  (
    '[Démo] Duplex F9 à El Kouba', 'duplex', '16 - Alger', 'El Kouba', 'El Kouba, Alger',
    8.5::numeric, 326::numeric, '9', '8', '2',
    'Donnée de démonstration privée : grand duplex F9 de 326 m² à El Kouba comprenant huit chambres et deux salles de bain.',
    array['Duplex', 'F9', '8 chambres', '2 salles de bain', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 3
  ),
  (
    '[Démo] Villa moderne à Bordj El Bahri', 'villas', '16 - Alger', 'Bordj El Bahri', 'Bordj El Bahri, Alger',
    7.6::numeric, 150::numeric, null, '10', '5',
    'Donnée de démonstration privée : villa moderne de 150 m² à Bordj El Bahri avec dix chambres et cinq salles de bain.',
    array['Villa moderne', '10 chambres', '5 salles de bain', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 4
  ),
  (
    '[Démo] Appartement F4 spacieux à Draria', 'apartments', '16 - Alger', 'Draria', 'Draria, Alger',
    4.4::numeric, 160::numeric, '4', '3', '1',
    'Donnée de démonstration privée : appartement F4 de 160 m² à Draria avec trois chambres et une salle de bain.',
    array['Appartement F4', '3 chambres', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 5
  ),
  (
    '[Démo] Appartement F4 haut standing à El Achour', 'apartments', '16 - Alger', 'El Achour', 'El Achour, Alger',
    4.3::numeric, 149::numeric, '4', '3', '1',
    'Donnée de démonstration privée : appartement F4 haut standing de 149 m² à El Achour avec trois chambres.',
    array['Appartement F4', 'Haut standing', '3 chambres', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 6
  ),
  (
    '[Démo] Triplex moderne à H’raoua', 'triplex', '16 - Alger', 'H’raoua', 'H’raoua, Alger',
    4.3::numeric, 114::numeric, null, '4', null,
    'Donnée de démonstration privée : triplex moderne à H’raoua, disponible à partir de 4,3 Md pour une surface de 114 m².',
    array['Triplex', 'Construction moderne', '4 chambres', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 7
  ),
  (
    '[Démo] Appartement F4 à Bir Khadem', 'apartments', '16 - Alger', 'Bir Khadem', 'Bir Khadem, Alger',
    3.98::numeric, 120::numeric, '4', '3', '2',
    'Donnée de démonstration privée : appartement F4 de 120 m² à Bir Khadem avec trois chambres et deux salles de bain.',
    array['Appartement F4', '3 chambres', '2 salles de bain', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 8
  ),
  (
    '[Démo] Villa R+1 à Fouka', 'villas', '42 - Tipaza', 'Fouka', 'Fouka, Tipaza',
    3.7::numeric, 340::numeric, null, '6', '4',
    'Donnée de démonstration privée : villa R+1 de 340 m² à Fouka avec six chambres et quatre salles de bain.',
    array['Villa R+1', '6 chambres', '4 salles de bain', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 9
  ),
  (
    '[Démo] Duplex à Mohammadia', 'duplex', '16 - Alger', 'Mohammadia', 'Mohammadia, Alger',
    3.7::numeric, null, null, '3', '2',
    'Donnée de démonstration privée : duplex à Mohammadia comprenant trois chambres et deux salles de bain.',
    array['Duplex', '3 chambres', '2 salles de bain', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 10
  ),
  (
    '[Démo] Appartement F4 à Draria', 'apartments', '16 - Alger', 'Draria', 'Draria, Alger',
    3.3::numeric, 149::numeric, '4', '3', '1',
    'Donnée de démonstration privée : appartement F4 de 149 m² à Draria avec trois chambres et une salle de bain.',
    array['Appartement F4', '3 chambres', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 11
  ),
  (
    '[Démo] Appartement F5 à rénover à Ben Aknoun', 'apartments', '16 - Alger', 'Ben Aknoun', 'Ben Aknoun, Alger',
    3.3::numeric, 120::numeric, '5', '4', '1',
    'Donnée de démonstration privée : appartement F5 de 120 m² à rénover dans un emplacement central de Ben Aknoun.',
    array['Appartement F5', 'À rénover', '4 chambres', 'Emplacement stratégique', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 12
  ),
  (
    '[Démo] Appartement F4 à Staoueli', 'apartments', '16 - Alger', 'Staoueli', 'Staoueli, Alger',
    3.1::numeric, 102::numeric, '4', '3', '1',
    'Donnée de démonstration privée : appartement F4 de 102 m² à Staoueli avec trois chambres et une salle de bain.',
    array['Appartement F4', '3 chambres', 'Offre promotionnelle', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 13
  ),
  (
    '[Démo] Appartement F3 à Télémly', 'apartments', '16 - Alger', 'Télémly', 'Télémly, Alger',
    3::numeric, 101::numeric, '3', '2', '1',
    'Donnée de démonstration privée : appartement F3 de 101 m² à Télémly avec deux chambres et une salle de bain.',
    array['Appartement F3', '2 chambres', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 14
  ),
  (
    '[Démo] Maison R+1 à Fouka', 'houses', '42 - Tipaza', 'Fouka', 'Fouka, Tipaza',
    3::numeric, 200::numeric, null, '7', '3',
    'Donnée de démonstration privée : maison R+1 de 200 m² à Fouka avec sept chambres et trois salles de bain.',
    array['Maison R+1', '7 chambres', '3 salles de bain', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 15
  ),
  (
    '[Démo] Appartement F3 meublé à Draria', 'apartments', '16 - Alger', 'Draria', 'Draria, Alger',
    2.75::numeric, 105::numeric, '3', '2', '1',
    'Donnée de démonstration privée : appartement F3 meublé et équipé de 105 m² à Draria avec deux chambres.',
    array['Appartement F3', 'Meublé', 'Équipé', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 16
  ),
  (
    '[Démo] Appartement F3 équipé à Azeffoun', 'apartments', '15 - Tizi Ouzou', 'Azeffoun', 'Azeffoun, Tizi Ouzou',
    2.68::numeric, 146::numeric, '3', '2', '1',
    'Donnée de démonstration privée : appartement F3 meublé et équipé de 146 m² à Azeffoun avec deux chambres.',
    array['Appartement F3', 'Meublé', 'Équipé', '2 chambres', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 17
  ),
  (
    '[Démo] Appartement F4 avec vue sur mer à Tipaza', 'apartments', '42 - Tipaza', 'Tipaza', 'Tipaza, Tipaza',
    2.5::numeric, 125::numeric, '4', '3', '1',
    'Donnée de démonstration privée : appartement F4 de 125 m² à Tipaza avec trois chambres et une vue sur mer.',
    array['Appartement F4', 'Vue sur mer', '3 chambres', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 18
  ),
  (
    '[Démo] Appartement F5 avec vue sur mer à Khemisti', 'apartments', '42 - Tipaza', 'Khemisti', 'Khemisti, Tipaza',
    2.48::numeric, 153::numeric, '5', '4', '2',
    'Donnée de démonstration privée : appartement F5 de 153 m² à Khemisti avec quatre chambres, deux salles de bain et une vue sur mer.',
    array['Appartement F5', 'Vue sur mer', '4 chambres', '2 salles de bain', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 19
  ),
  (
    '[Démo] Appartement F4 à Réghaïa', 'apartments', '16 - Alger', 'Réghaïa', 'Réghaïa, Alger',
    2.3::numeric, 120::numeric, '4', '3', '1',
    'Donnée de démonstration privée : appartement F4 de 120 m² à Réghaïa avec trois chambres et une salle de bain.',
    array['Appartement F4', '3 chambres', 'Prix négociable', 'Donnée de démonstration', 'Source factuelle : omarimmobilier.com'], 20
  )
)
insert into public.properties (
  title, category, status, wilaya, commune, address, price, currency,
  surface, rooms, bedrooms, bathrooms, phone, description, features,
  images, featured, hero_featured, is_published, created_at
)
select
  d.title, d.category, 'sale', d.wilaya, d.commune, d.address, d.price, 'Md',
  d.surface, d.rooms, d.bedrooms, d.bathrooms, null, d.description, d.features,
  array(
    select p.images[((series.position + d.image_offset - 2) % array_length(p.images, 1)) + 1]
    from generate_series(1, array_length(p.images, 1)) as series(position)
  ),
  false, false, false, now() - (d.image_offset || ' minutes')::interval
from listing_data d
cross join photo_pool p
where not exists (
  select 1 from public.properties existing where existing.title = d.title
);

-- Verification: should return 20 rows after the first successful run.
select
  count(*) as private_demo_count,
  min(array_length(images, 1)) as minimum_photos_per_property,
  max(array_length(images, 1)) as maximum_photos_per_property,
  bool_and(is_published = false) as all_private
from public.properties
where title like '[Démo]%';
