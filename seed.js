import { createClient } from '@supabase/supabase-js';
import { gallery, testimonials } from './src/data.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding testimonials...");
  for (const t of testimonials) {
    const { error } = await supabase.from('testimonials').insert([
      { name: t.name, quote: t.quote, type: t.type }
    ]);
    if (error) console.error("Error inserting testimonial:", error.message);
  }

  console.log("Seeding gallery...");
  for (const g of gallery) {
    const { error } = await supabase.from('gallery').insert([
      { title: g.title, category: g.category, src: g.src }
    ]);
    if (error) console.error("Error inserting gallery item:", error.message);
  }
  
  console.log("Seeding completed!");
}

seed();
