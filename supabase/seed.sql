-- Replace or remove these sample rows after verifying the catalogue UI.
insert into public.products (name, slug, category, description, colour, finish, in_stock, featured)
values
  ('Black Galaxy Granite', 'black-galaxy-granite', 'granite', 'Deep charcoal granite with fine metallic movement for confident, enduring surfaces.', 'Charcoal with gold flecks', 'Polished', true, true),
  ('Kashmir White Granite', 'kashmir-white-granite', 'granite', 'A softly patterned natural stone that brings brightness and warmth to everyday spaces.', 'White, grey and burgundy', 'Polished', true, false),
  ('Calacatta Gold Quartz', 'calacatta-gold-quartz', 'quartz', 'A luminous white quartz with expressive veining and the calm presence of Italian marble.', 'Warm white with gold', 'Polished', true, true),
  ('Carrara White Quartz', 'carrara-white-quartz', 'quartz', 'Quiet grey veining on a clean white ground for timeless kitchens and refined vanities.', 'White with grey', 'Honed', false, false),
  ('Statuario Sintered Stone', 'statuario-sintered-stone', 'sintered_stone', 'High-performance architectural stone with bold veining and outstanding resistance.', 'White with graphite', 'Silk', true, true),
  ('Nero Marquina Sintered Stone', 'nero-marquina-sintered-stone', 'sintered_stone', 'A dramatic black surface with fine white veining for walls, counters and feature moments.', 'Black with white', 'Matt', false, false)
on conflict (slug) do nothing;
