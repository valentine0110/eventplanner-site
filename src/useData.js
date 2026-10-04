import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { gallery as fallbackGallery, testimonials as fallbackTestimonials } from './data';

export function useData() {
  const [gallery, setGallery] = useState(fallbackGallery);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    // Fetch gallery
    supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setGallery(data);
        }
      });

    // Fetch testimonials
    supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setTestimonials(data);
        }
      });
  }, []);

  return { gallery, testimonials };
}
