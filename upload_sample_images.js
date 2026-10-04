import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function uploadImages() {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.error("Usage: node upload_sample_images.js <your-admin-email> <your-password>");
    return;
  }
  
  console.log("Logging into Supabase securely...");
  const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  
  if (authError) {
    console.error("❌ Login failed:", authError.message);
    return;
  }
  console.log("✅ Logged in successfully!");
  
  const images = [
    { file: 'wedding_1.jpg', title: 'Grand Mandap Ceremony', category: 'wedding' },
    { file: 'wedding_2.jpg', title: 'Luxury Hall Decor', category: 'decor' },
    { file: 'wedding_3.jpg', title: 'Floral Arch Details', category: 'detail' }
  ];
  
  for (const img of images) {
     const filePath = path.join(__dirname, 'sample_images', img.file);
     const fileData = fs.readFileSync(filePath);
     const fileName = `${Date.now()}_${img.file}`;
     
     console.log(`\n📤 Uploading ${img.title}...`);
     
     // 1. Upload to Storage
     const { error: uploadError } = await supabase.storage.from('event-media').upload(fileName, fileData, { contentType: 'image/jpeg' });
     if (uploadError) { 
       console.error("❌ Storage Upload Error:", uploadError.message); 
       continue; 
     }
     
     // 2. Get public URL
     const { data: { publicUrl } } = supabase.storage.from('event-media').getPublicUrl(fileName);
     
     // 3. Insert into Database
     const { error: dbError } = await supabase.from('gallery').insert([
       { title: img.title, category: img.category, src: publicUrl }
     ]);
     
     if (dbError) { 
       console.error("❌ Database Insert Error:", dbError.message); 
       continue; 
     }
     
     console.log(`✅ Successfully published "${img.title}"!`);
  }
  
  console.log("\n🎉 All sample images have been uploaded to your gallery!");
}

uploadImages();
