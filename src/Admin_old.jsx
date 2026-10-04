import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './styles.css';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', category: 'wedding', file: null });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchGallery();
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchGallery();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setGallery(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newImage.file || !newImage.title) return alert('Please provide a file and title');
    
    setUploading(true);
    const fileExt = newImage.file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('event-media')
      .upload(filePath, newImage.file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('event-media')
      .getPublicUrl(filePath);

    // Insert into DB
    const { error: dbError } = await supabase.from('gallery').insert([
      {
        title: newImage.title,
        category: newImage.category,
        src: publicUrl
      }
    ]);

    if (dbError) {
      alert('Error saving to database: ' + dbError.message);
    } else {
      setNewImage({ title: '', category: 'wedding', file: null });
      fetchGallery();
    }
    setUploading(false);
  };

  const handleDelete = async (id, src) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    // Extract filename from URL
    const fileName = src.split('/').pop();
    
    // Delete from DB
    await supabase.from('gallery').delete().eq('id', id);
    
    // Delete from Storage
    if (fileName && !src.includes('unsplash.com')) {
      await supabase.storage.from('event-media').remove([fileName]);
    }
    
    fetchGallery();
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;

  if (!session) {
    return (
      <div className="admin-login-container">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Admin Login</h2>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-dark full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container-wide">
      <div className="admin-header">
        <h2>Event Planer CMS</h2>
        <button onClick={handleLogout} className="btn btn-light">Logout</button>
      </div>

      <div className="admin-section">
        <h3>Add New Gallery Image</h3>
        <form onSubmit={handleUpload} className="admin-upload-form">
          <input 
            type="text" 
            placeholder="Image Title (e.g. Grand Mandap)" 
            value={newImage.title}
            onChange={e => setNewImage({...newImage, title: e.target.value})}
            required
          />
          <select 
            value={newImage.category}
            onChange={e => setNewImage({...newImage, category: e.target.value})}
          >
            <option value="wedding">Wedding</option>
            <option value="decor">Décor</option>
            <option value="reception">Reception</option>
            <option value="destination">Destination</option>
            <option value="detail">Detail</option>
          </select>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => setNewImage({...newImage, file: e.target.files[0]})}
            required
          />
          <button type="submit" className="btn btn-dark" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h3>Manage Gallery</h3>
        <div className="admin-gallery-grid">
          {gallery.map(item => (
            <div key={item.id} className="admin-gallery-item">
              <img src={item.src} alt={item.title} />
              <div className="admin-gallery-info">
                <strong>{item.title}</strong>
                <span>{item.category}</span>
                <button onClick={() => handleDelete(item.id, item.src)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {gallery.length === 0 && <p>No images found in Supabase. Add some above!</p>}
        </div>
      </div>
    </div>
  );
}
