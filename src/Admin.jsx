import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Phone, Mail, MapPin, Calendar, Sparkles, Users, IndianRupee } from 'lucide-react';
import './styles.css';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');
  
  // Gallery State
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', category: 'wedding', file: null });

  // Testimonials State
  const [testimonials, setTestimonials] = useState([]);
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', quote: '', type: 'Wedding Couple' });

  // Enquiries State
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchGallery();
        fetchTestimonials();
        fetchEnquiries();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchGallery();
        fetchTestimonials();
        fetchEnquiries();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchEnquiries = async () => {
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (data) setEnquiries(data);
  };

  const updateEnquiryStatus = async (id, status) => {
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (error) alert("Error updating status: " + error.message);
    else fetchEnquiries();
  };

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setGallery(data);
  };

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
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

  // --- GALLERY HANDLERS ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newImage.file || !newImage.title) return alert('Please provide a file and title');
    
    setUploading(true);
    const fileExt = newImage.file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from('event-media').upload(filePath, newImage.file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('event-media').getPublicUrl(filePath);

    const { error: dbError } = await supabase.from('gallery').insert([{
      title: newImage.title, category: newImage.category, src: publicUrl
    }]);

    if (dbError) alert('Error saving to database: ' + dbError.message);
    else {
      setNewImage({ title: '', category: 'wedding', file: null });
      fetchGallery();
    }
    setUploading(false);
  };

  const handleDeleteImage = async (id, src) => {
    if (!window.confirm("Delete this image?")) return;
    const fileName = src.split('/').pop();
    await supabase.from('gallery').delete().eq('id', id);
    if (fileName && !src.includes('unsplash.com')) {
      await supabase.storage.from('event-media').remove([fileName]);
    }
    fetchGallery();
  };

  // --- TESTIMONIAL HANDLERS ---
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.quote) return alert('Please provide name and quote');
    
    setSavingTestimonial(true);
    const { error } = await supabase.from('testimonials').insert([newTestimonial]);
    
    if (error) alert('Error saving testimonial: ' + error.message);
    else {
      setNewTestimonial({ name: '', quote: '', type: 'Wedding Couple' });
      fetchTestimonials();
    }
    setSavingTestimonial(false);
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await supabase.from('testimonials').delete().eq('id', id);
    fetchTestimonials();
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;

  if (!session) {
    return (
      <div className="admin-login-container">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Admin Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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

      <div className="admin-tabs">
        <button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>Gallery Manager</button>
        <button className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>Testimonials Manager</button>
        <button className={activeTab === 'enquiries' ? 'active' : ''} onClick={() => setActiveTab('enquiries')}>Enquiries</button>
      </div>

      {activeTab === 'gallery' && (
        <div className="admin-tab-content">
          <div className="admin-section">
            <h3>Add New Gallery Image</h3>
            <form onSubmit={handleUpload} className="admin-upload-form">
              <input type="text" placeholder="Image Title (e.g. Grand Mandap)" value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} required />
              <select value={newImage.category} onChange={e => setNewImage({...newImage, category: e.target.value})}>
                <option value="wedding">Wedding</option>
                <option value="decor">Décor</option>
                <option value="reception">Reception</option>
                <option value="destination">Destination</option>
                <option value="detail">Detail</option>
              </select>
              <input type="file" accept="image/*" onChange={e => setNewImage({...newImage, file: e.target.files[0]})} required />
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
                    <button onClick={() => handleDeleteImage(item.id, item.src)} className="btn-delete">Delete</button>
                  </div>
                </div>
              ))}
              {gallery.length === 0 && <p>No images found in database.</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'testimonials' && (
        <div className="admin-tab-content">
          <div className="admin-section">
            <h3>Add New Testimonial</h3>
            <form onSubmit={handleAddTestimonial} className="admin-upload-form" style={{ gridTemplateColumns: '1fr 1fr 1fr auto' }}>
              <input type="text" placeholder="Client Name (e.g. Priya & Rohit)" value={newTestimonial.name} onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})} required />
              <input type="text" placeholder="Event Type (e.g. Wedding Couple)" value={newTestimonial.type} onChange={e => setNewTestimonial({...newTestimonial, type: e.target.value})} required />
              <input type="text" placeholder="Quote (e.g. Absolutely magical...)" value={newTestimonial.quote} onChange={e => setNewTestimonial({...newTestimonial, quote: e.target.value})} required />
              <button type="submit" className="btn btn-dark" disabled={savingTestimonial}>
                {savingTestimonial ? 'Saving...' : 'Add Review'}
              </button>
            </form>
          </div>

          <div className="admin-section">
            <h3>Manage Testimonials</h3>
            <div className="admin-list">
              {testimonials.map(item => (
                <div key={item.id} className="admin-list-item">
                  <div className="admin-list-info">
                    <p className="quote">"{item.quote}"</p>
                    <strong>{item.name}</strong> <span>({item.type})</span>
                  </div>
                  <button onClick={() => handleDeleteTestimonial(item.id)} className="btn-delete">Delete</button>
                </div>
              ))}
              {testimonials.length === 0 && <p>No testimonials found in database.</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'enquiries' && (
        <div className="admin-tab-content">
          <div className="admin-section">
            <h3>Recent Enquiries</h3>
            <div className="admin-list">
              {enquiries.map(item => (
                <div key={item.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ fontSize: '1.1em' }}><strong>{item.name || 'Anonymous'}</strong></div>
                    <select 
                      value={item.status || 'New'} 
                      onChange={(e) => updateEnquiryStatus(item.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', background: item.status === 'New' ? '#fff3cd' : item.status === 'Contacted' ? '#d1ecf1' : item.status === 'Won' ? '#d4edda' : item.status === 'No Lead' ? '#f8d7da' : '#fff' }}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Won">Won (Client)</option>
                      <option value="No Lead">No Lead</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', color: '#555', marginTop: '5px' }}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Phone size={16} /> {item.phone}</span>
                    {item.email && <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Mail size={16} /> {item.email}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', color: '#555' }}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><MapPin size={16} /> {item.venue || 'N/A'}</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Calendar size={16} /> {item.date || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', color: '#555' }}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Sparkles size={16} /> {item.service || 'N/A'}</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Users size={16} /> {item.guests || 'N/A'}</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><IndianRupee size={16} /> {item.budget || 'N/A'}</span>
                  </div>
                  {item.message && <div style={{background: '#f5f5f5', padding: '10px', borderRadius: '4px', width: '100%', marginTop: '5px', fontStyle: 'italic'}}>"{item.message}"</div>}
                  <div style={{fontSize: '0.8em', color: '#888', marginTop: '5px'}}>{new Date(item.created_at).toLocaleString()}</div>
                </div>
              ))}
              {enquiries.length === 0 && <p>No enquiries found in database.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
