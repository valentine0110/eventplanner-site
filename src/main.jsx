import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import { addOns, comparison, faqs, navItems, packages, services, site } from './data';
import { useData } from './useData';
import Admin from './Admin';
import { supabase } from './supabaseClient';
import './styles.css';
import './animations.css';
import './polish.css';

const img = (url, width = 1400) => `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=${width}`;

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * @param {{ large?: boolean }} props
 */
function Arrow({ large = false }) {
  return <span className={`arrow ${large ? 'arrow-lg' : ''}`} aria-hidden="true">↗</span>;
}

function Logo() {
  return <span className="brand"><span className="brand-mark" aria-hidden="true">E</span><span className="brand-wording"><strong>EVENT PLANER</strong><small>Weddings · Events · Experiences</small></span></span>;
}

function usePath() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

function normalizePath(path) {
  const p = path.replace(/\/+$/, '') || '/';
  const aliases = {
    '/index.html': '/', '/about.html': '/about', '/services.html': '/services',
    '/gallery.html': '/gallery', '/packages.html': '/packages', '/contact.html': '/contact'
  };
  return aliases[p] || p;
}

function navigate(path) {
  if (path.startsWith('http')) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/**
 * @param {{ to: string, children: React.ReactNode, className?: string, onClick?: () => void, 'aria-label'?: string, 'aria-current'?: string }} props
 */
function AppLink({ to, children, className = '', onClick, 'aria-label': ariaLabel, 'aria-current': ariaCurrent }) {
  const handle = e => {
    if (to.startsWith('http') || to.startsWith('tel:') || to.startsWith('mailto:')) return;
    e.preventDefault();
    navigate(to);
    onClick?.();
  };
  return <a className={className} href={to} onClick={handle} aria-label={ariaLabel} aria-current={ariaCurrent}>{children}</a>;
}

function PageLoader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 850);
    return () => clearTimeout(t);
  }, []);
  return <div className={`page-loader ${show ? '' : 'is-done'}`} aria-hidden="true"><div className="loader-inner"><span className="loader-brand">EVENT PLANER</span><span className="loader-line"><i /></span><span className="loader-caption">WEDDINGS · EVENTS · EXPERIENCES · [City]</span></div></div>;
}

/**
 * @param {{ current: string }} props
 */
function Navbar({ current }) {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = debounce(() => setScrolled(window.scrollY > 24), 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menu);
    return () => document.body.classList.remove('nav-open');
  }, [menu]);

  useEffect(() => setMenu(false), [current]);

  return <>
    <header className={`site-nav ${scrolled ? 'scrolled' : ''} ${menu ? 'menu-open' : ''}`} role="banner">
      <div className="nav-shell">
        <AppLink to="/" className="nav-logo" aria-label="Event Planer home"><Logo /></AppLink>
        <nav className="desktop-nav" aria-label="Primary navigation" role="navigation">
          {navItems.map(item => <AppLink key={item.path} to={item.path} className={`nav-link ${current === item.path ? 'active' : ''}`} aria-current={current === item.path ? 'page' : undefined}>{item.label}</AppLink>)}
        </nav>
        <div className="nav-actions">
          <AppLink to="/contact" className="nav-book">Book a Consultation <Arrow /></AppLink>
          <button
            type="button"
            className={`nav-menu ${menu ? 'open' : ''}`}
            onClick={() => setMenu(v => !v)}
            aria-label={menu ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menu}
            aria-controls="mobile-navigation"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {menu && (
        <motion.div
          id="mobile-navigation"
          className="mobile-nav open"
          role="navigation"
          aria-label="Mobile navigation"
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] } }}
        >
          <div className="mobile-nav-bg" aria-hidden="true">EP</div>
          <div className="mobile-nav-links">
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <AppLink to={item.path} className={`mobile-link ${current === item.path ? 'active' : ''}`} aria-current={current === item.path ? 'page' : undefined} onClick={() => setMenu(false)}>
                  <small>0{i + 1}</small><span>{item.label}</span><b>↗</b>
                </AppLink>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mobile-nav-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          >
            <AppLink to="/contact" onClick={() => setMenu(false)}>Start planning <Arrow /></AppLink>
          </motion.div>
          <div className="mobile-nav-foot"><span>[City], [Region]</span><span>Est. 2017</span></div>
        </motion.div>
      )}
    </AnimatePresence>
  </>;
}

function FloatingUI() {
  const [top, setTop] = useState(false);
  useEffect(() => { 
    const onScroll = debounce(() => setTop(window.scrollY > 650), 100); 
    window.addEventListener('scroll', onScroll, { passive: true }); 
    onScroll(); 
    return () => window.removeEventListener('scroll', onScroll); 
  }, []);
  
  return <>
    <a className="whatsapp" href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp Event Planer" title="Chat on WhatsApp"><span>WA</span></a>
    <button className={`to-top ${top ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>
  </>;
}

function Footer() {
  return <footer className="site-footer" role="contentinfo">
    <div className="footer-main container-wide">
      <div className="footer-brand-col">
        <Logo />
        <p>Creating unforgettable experiences since [Year]. Based in [City], serving all of [Region] and beyond.</p>
        <div className="footer-socials">
          <a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={site.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={`tel:${site.phone}`}>Call</a>
          <a href={`mailto:${site.email}`}>Email</a>
        </div>
      </div>
      <div><div className="footer-label">Explore</div>{navItems.map(i => <AppLink key={i.path} to={i.path} className="footer-link">{i.label}</AppLink>)}</div>
      <div><div className="footer-label">Connect</div><a className="footer-link" href={`tel:${site.phone}`}>{site.phoneDisplay}</a><a className="footer-link" href={`tel:${site.phone2}`}>{site.phone2Display}</a><a className="footer-link" href={`mailto:${site.email}`}>{site.email}</a><span className="footer-link muted">Mon–Sun · 9:00–19:00</span></div>
    </div>
    <div className="footer-bottom container-wide"><span>© {new Date().getFullYear()} Event Planer</span><span>Luxury celebrations · [City] · [Region]</span></div>
  </footer>;
}

/**
 * @param {{ children: React.ReactNode, className?: string, delay?: number }} props
 */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.12 }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: [0.2, 0.7, 0.2, 1] }}
      className={`reveal ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * @param {{ eyebrow: string | React.ReactNode, title: string | React.ReactNode, body?: string | React.ReactNode, align?: 'left' | 'center' }} props
 */
function SectionIntro({ eyebrow, title, body, align = 'left' }) {
  return <div className={`section-intro ${align === 'center' ? 'center' : ''}`}>
    <div className="eyebrow"><span />{eyebrow}</div>
    <h2 className="display-title">{title}</h2>
    {body && <p className="intro-copy">{body}</p>}
  </div>;
}

/**
 * @param {{ number: string, title: string, accent: string, copy: string, kicker: string }} props
 */
function PageHero({ number, title, accent, copy, kicker }) {
  const heroImages = {
    'Our story':     'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1500&q=90',
    'Our services':  'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1500&q=90',
    'The portfolio': 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1500&q=90',
    'Packages':      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1500&q=90',
    "Let's talk":    'https://images.unsplash.com/photo-1583939411023-14783179e581?w=1500&q=90',
    'Page not found':'https://images.unsplash.com/photo-1519741497674-611481863552?w=1500&q=90',
  };
  return <section className="page-hero">
    <motion.div
      className="page-hero-image"
      initial={{ scale: 1.08, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <img src={heroImages[kicker] || heroImages['Our story']} alt="" aria-hidden="true" loading="lazy" decoding="async" width={1500} height={1000}/>
      <div className="page-hero-image-shade"/>
    </motion.div>
    <div className="hero-rings" aria-hidden="true"><span /><span /><span /></div>
    <div className="page-hero-inner container-wide">
      <motion.div className="page-meta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}>
        <span>{number}</span><span>{kicker}</span>
      </motion.div>
      <motion.h1 className="page-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}>
        {title} <em>{accent}</em>
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.5, ease: 'easeOut' }}>
        {copy}
      </motion.p>
    </div>
  </section>;
}

function Counter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    let observer;
    let startTimestamp = null;
    let reqId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * end);
      setCount(current);
      if (progress < 1) {
        reqId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        reqId = window.requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(el);

    return () => {
      if (observer) observer.disconnect();
      if (reqId) window.cancelAnimationFrame(reqId);
    };
  }, [end, duration]);

  return <strong ref={ref}>{count}<small>{suffix}</small></strong>;
}

const Home = React.memo(function Home({ gallery, testimonials }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => { const t = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 6000); return () => clearInterval(t); }, []);
  return <main>
    <section className="home-hero">
      <div className="home-hero-image"><img src={img('https://images.unsplash.com/photo-1537633552985-df8429e8048b?', 1800)} alt="Elegant wedding celebration" loading="lazy" decoding="async" width={1800} height={1200}/><div className="hero-image-shade" /></div>
      <div className="hero-orbit" aria-hidden="true"><span>EST. 2017</span><span>[City] · [Region] ·</span></div>
      <div className="container-wide hero-content">
        <Reveal className="hero-kicker"><span>Luxury weddings · [Region]</span><span>01 / 06</span></Reveal>
        <Reveal delay={80}><h1 className="hero-title">Where <em>dreams</em><br/>become <strong>memories.</strong></h1></Reveal>
        <Reveal delay={160}><p className="hero-copy">Thoughtfully planned celebrations, beautifully designed spaces, and a team that handles the details so you can stay inside the moment.</p></Reveal>
        <Reveal delay={220} className="hero-actions"><AppLink to="/contact" className="btn btn-light">Begin your journey <Arrow /></AppLink><AppLink to="/gallery" className="text-link light">Explore the portfolio <span>↗</span></AppLink></Reveal>
        <Reveal delay={280} className="hero-scroll"><span className="scroll-line"/>Scroll to explore</Reveal>
      </div>
    </section>

    <section className="proof-strip"><div className="container-wide proof-grid">
      {[[500, '+', 'weddings curated'], [41, 'K+', 'Instagram community'], [7, '+', 'years of craft'], [24, 'h', 'response promise']].map(([num,suffix,label], i) => <Reveal key={label} delay={i * 60}><div className="proof-item"><Counter end={num} suffix={suffix} /><span>{label}</span></div></Reveal>)}
    </div></section>

    <section className="section intro-modern"><div className="container-wide intro-layout">
      <Reveal className="intro-aside"><div className="eyebrow"><span/>Our story</div><div className="vertical-note">THE EVENT PLANER APPROACH · 01</div></Reveal>
      <div><Reveal><h2 className="statement">We do not just <em>plan</em> events.<br/>We author the feeling around them.</h2></Reveal><Reveal delay={100}><p className="lead-copy">Event Planer was founded in [City] by [Founders' Names] with a simple belief: every celebration deserves its own point of view.</p></Reveal><Reveal delay={160}><div className="two-copy"><p>From the first consultation to the final farewell, we combine creative direction with calm, precise execution. Your culture, your taste, your people — it all belongs in the design.</p><p>That means one team, one clear point of contact, and a celebration that feels considered without ever feeling overworked.</p></div></Reveal><Reveal delay={220}><AppLink to="/about" className="text-link">Read our story <span>↗</span></AppLink></Reveal></div>
    </div></section>

    <section className="section section-soft"><div className="container-wide"><SectionIntro eyebrow="What we do" title={<>Signature services with a <em>point of view.</em></>} body="From intimate ceremonies to full-scale destination celebrations, every service is designed to work beautifully with the next."/>
      <div className="service-grid-modern">{services.slice(0, 6).map((service, i) => <Reveal key={service.number} delay={i * 50}><AppLink to="/services" className="service-card-modern"><div className="service-image"><img src={img(service.image, 950)} alt={service.title} loading="lazy" decoding="async" width={950} height={600}/><span className="service-index">{service.number}</span></div><div className="service-copy"><span className="service-eyebrow">{service.eyebrow}</span><h3>{service.title}</h3><p>{service.summary}</p><span className="service-more">Discover <Arrow /></span></div></AppLink></Reveal>)}</div>
    </div></section>

    <section className="feature-banner"><div className="feature-image"><img src={img('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?', 1800)} alt="Grand outdoor wedding ceremony" loading="lazy" decoding="async" width={1800} height={1000}/><div className="image-dark"/></div><div className="container-wide feature-inner"><Reveal><div className="eyebrow light"><span/>The destination edit</div><h2>[Region], <em>but make it yours.</em></h2><p>Tea gardens. Riverside ceremonies. Heritage estates. We bring the full Event Planer team to destination celebrations across [Region] and beyond.</p><AppLink to="/services" className="btn btn-light">Plan a destination wedding <Arrow /></AppLink></Reveal></div></section>

    <section className="section gallery-preview"><div className="container-wide"><div className="section-head-row"><SectionIntro eyebrow="The portfolio" title={<>A few moments from <em>the archive.</em></>}/><AppLink to="/gallery" className="text-link">View all work <span>↗</span></AppLink></div>
      <div className="gallery-mosaic">{gallery.slice(0, 6).map((item, i) => <Reveal key={item.src} delay={i * 40} className={`mosaic-item item-${i+1}`}><AppLink to="/gallery" className="gallery-tile"><img src={img(item.src.replace('?', ''), 1100)} alt={item.title} loading="lazy" decoding="async" width={1100} height={800}/><span>{item.title}</span></AppLink></Reveal>)}</div>
    </div></section>

    <section className="section testimonials"><div className="container-wide testimonial-layout"><Reveal><SectionIntro eyebrow="Kind words" title={<>A good wedding day should <em>feel like you.</em></>} body="A few notes from couples who trusted us with the details."/></Reveal><div className="testimonial-card"><div className="quote-mark" aria-hidden="true">“</div><div className="testi-stage" role="tablist" aria-label="Testimonials" aria-live="polite">{testimonials.map((t, i) => <div key={t.name} role="tabpanel" aria-hidden={i !== activeTestimonial} className={`testi-slide ${i === activeTestimonial ? 'active' : ''}`}><p>“{t.quote}”</p><div><strong>{t.name}</strong><span>{t.type}</span></div></div>)}</div><div className="testi-controls"><button onClick={() => setActiveTestimonial((activeTestimonial + testimonials.length - 1) % testimonials.length)} aria-label="Previous testimonial">←</button><span>{String(activeTestimonial + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span><button onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)} aria-label="Next testimonial">→</button></div></div></div></section>

    <CTA />
  </main>;
});

const CTA = React.memo(function CTA() {
  return <section className="cta"><div className="container-wide cta-inner"><Reveal><div className="eyebrow light"><span/>Your next chapter</div><h2>Let's create something <em>beautiful.</em></h2></Reveal><Reveal delay={120}><div className="cta-side"><p>Your perfect wedding is one conversation away.</p><AppLink to="/contact" className="btn btn-light">Start planning <Arrow /></AppLink></div></Reveal></div></section>;
});

const About = React.memo(function About() {
  const values = [['01','Luxury without compromise','Premium experiences delivered at every budget point. We never cut corners — we find smarter solutions.'],['02','Punctual & reliable','Seven years and 500+ weddings — on-time delivery is our identity, not a promise.'],['03','Truly full-service','One team, one point of contact. From venue booking to bridal car, we handle the complete picture.'],['04','Infinite customisation','Traditional [Region]ese grandeur or contemporary Western elegance — we build exactly what you envision.'],['05','Honest communication','Transparent pricing, clear timelines and real-time updates — no surprises on your important day.'],['06','Emotionally invested','We treat your wedding as if it were our own. Your joy is our greatest reward.']];
  const timeline = [['2017','Event Planer is born','Founded by Dipankar & Rupashree in [City] with a shared dream — to redefine weddings in [Region].'],['2018','First 50 weddings','Crossed 50 curated events in our first full year, earning our first wave of 5-star reviews.'],['2020','Digital growth','Grew to 10,000 Instagram followers and pioneered virtual wedding planning during the pandemic era.'],['2022','Destination weddings','Expanded into destination celebrations across [Region] tea gardens, riverside venues and heritage estates.'],['2024','500+ events · 41K followers','Celebrated 500 weddings and crossed 41,000 Instagram followers.']];
  return <main><PageHero number="02 / 06" kicker="Our story" title="The people behind" accent="the magic." copy="Born from a passion for beauty and a belief that every love story deserves its own masterpiece."/>
    <section className="section"><div className="container-wide story-grid"><Reveal className="story-photo"><img src={img('https://images.unsplash.com/photo-1606800052052-a08af7148866?', 1300)} alt="Wedding floral detail" loading="lazy" decoding="async" width={1300} height={900}/><span>Est. 2017 · [City]</span></Reveal><div><Reveal><SectionIntro eyebrow="The beginning" title={<>We don't plan events.<br/><em>We author memories.</em></>} /></Reveal><Reveal delay={80}><p className="lead-copy">Event Planer was founded by [Founders' Names] — two visionaries who share an unshakeable belief that every celebration should be as extraordinary as the people at the heart of it.</p></Reveal><Reveal delay={140}><p className="body-copy">From a small office in [City], we have grown into a trusted luxury wedding planning house across [Region]. We take complete ownership of your wedding day — not just the décor, but every vendor, every timeline and every unexpected moment.</p></Reveal><Reveal delay={200}><blockquote>“Creating unforgettable experiences since [Year] ✨”</blockquote></Reveal></div></div></section>
    <section className="section section-soft"><div className="container-wide"><SectionIntro eyebrow="What we stand for" title={<>The values behind <em>every detail.</em></>}/><div className="values-grid">{values.map(([n,title,desc], i) => <Reveal key={n} delay={i*40}><article className="value-card"><span>{n}</span><h3>{title}</h3><p>{desc}</p></article></Reveal>)}</div></div></section>
    <section className="section"><div className="container-wide team-section"><SectionIntro eyebrow="The people behind the magic" title={<>Meet the <em>team.</em></>}/><div className="team-grid"><Reveal><TeamCard monogram="D" name="Dipankar" role="Co-Founder · Lead Event Planner" text="The strategic backbone of Event Planer. With a deep vendor network and a gift for flawless execution, Dipankar turns ambitious visions into reality — on schedule."/></Reveal><Reveal delay={80}><TeamCard monogram="R" name="Rupashree" role="Co-Founder · Creative Director" text="The artistic soul of Event Planer. Her eye for beauty and design transforms raw spaces into dreamscapes that leave guests speechless."/></Reveal><Reveal delay={160}><TeamCard monogram="A+" name="The Event Planer Crew" role="Decorators · Photographers · Chefs · DJs" text="Our 50+ specialists work in perfect harmony to bring your celebration to life with skill, care and zero compromise."/></Reveal></div></div></section>
    <section className="section section-dark"><div className="container-wide"><div className="timeline-head"><Reveal><div className="eyebrow light"><span/>Seven years of craft</div><h2>Built milestone<br/><em>by milestone.</em></h2></Reveal><Reveal delay={100}><p>From a single consultation room to [Region]'s sought-after wedding house, every chapter has been built on trust, creativity and an obsession with the detail.</p></Reveal></div><div className="timeline">{timeline.map(([year,title,desc], i)=><Reveal key={year} delay={i*45}><div className="timeline-row"><div className="timeline-year">{year}</div><div className="timeline-dot"/><div><h3>{title}</h3><p>{desc}</p></div></div></Reveal>)}</div></div></section><CTA/></main>;
});

/**
 * @param {{ monogram: string, name: string, role: string, text: string }} props
 */
function TeamCard({ monogram, name, role, text }) { return <article className="team-card"><div className="team-monogram" aria-hidden="true">{monogram}</div><span className="team-role">{role}</span><h3>{name}</h3><p>{text}</p></article>; }

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <b className="faq-icon" style={{ transform: `rotate(${open ? 45 : 0}deg)`, transition: 'transform 0.3s ease' }}>+</b>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
}

const Services = React.memo(function Services() {
  return <main><PageHero number="03 / 06" kicker="Our services" title="One team. Every" accent="detail." copy="End-to-end wedding and event solutions — curated, coordinated and executed to absolute perfection."/>
    <section className="service-detail-list">{services.map((service, index) => <article key={service.number} className={`service-detail-row ${index % 2 ? 'reverse' : ''}`}><div className="service-detail-image"><img src={img(service.image, 1500)} alt={service.title} loading="lazy" decoding="async" width={1500} height={1000}/><span>{service.number}</span></div><div className="service-detail-copy"><Reveal><div className="eyebrow"><span/>Service {service.number}</div><h2>{service.title}</h2><p className="lead-copy">{service.description}</p><p className="body-copy">{service.detail}</p><div className="include-list">{service.includes.map(x => <span key={x}>✓ {x}</span>)}</div><AppLink to="/contact" className="btn btn-dark">Enquire about {service.title} <Arrow /></AppLink></Reveal></div></article>)}</section>
    <section className="section section-soft"><div className="container-wide"><SectionIntro eyebrow="The process" title={<>From first hello to <em>final farewell.</em></>} body="A calm, clear five-step process built around communication, taste and execution."/><div className="process-grid">{[['01','Listen','We learn your story, priorities, style and non-negotiables.'],['02','Imagine','Our creative team shapes a bespoke moodboard and design direction.'],['03','Plan','We manage vendors, venue, budgets, schedules and the fine print.'],['04','Execute','Our crew sets up and runs the day with quiet precision.'],['05','Celebrate','You stay present. We handle everything behind the scenes.']].map(([num,title,desc], i)=><Reveal key={num} delay={i*50}><div className="process-card"><span>{num}</span><h3>{title}</h3><p>{desc}</p></div></Reveal>)}</div></div></section>
    <section className="section faq-section"><div className="container-wide faq-layout"><SectionIntro eyebrow="Questions" title={<>Frequently <em>asked.</em></>} body="Still unsure? We are always happy to talk it through."/><div className="faq-list">{faqs.map(([q,a]) => <FAQItem key={q} q={q} a={a} />)}</div></div></section><CTA/></main>;
});

const Gallery = React.memo(function Gallery({ gallery }) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const filters = [['all','All work'],['wedding','Weddings'],['decor','Décor'],['reception','Receptions'],['destination','Destination'],['detail','Details']];
  const filtered = useMemo(() => filter === 'all' ? gallery : gallery.filter(item => item.category === filter), [filter]);
  useEffect(() => { const onKey = e => { if (selected === null) return; if (e.key === 'Escape') setSelected(null); if (e.key === 'ArrowRight') setSelected((selected + 1) % filtered.length); if (e.key === 'ArrowLeft') setSelected((selected + filtered.length - 1) % filtered.length); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [selected, filtered.length]);
  
  // Swipe support for Lightbox
  const [touchStart, setTouchStart] = useState(null);
  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) setSelected((selected + 1) % filtered.length);
    if (isRightSwipe) setSelected((selected + filtered.length - 1) % filtered.length);
    setTouchStart(null);
  };

  // Focus trap
  const lightboxRef = useRef(null);
  useEffect(() => {
    if (selected !== null && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [selected]);

  return <main><PageHero number="04 / 06" kicker="The portfolio" title="A living archive of" accent="celebrations." copy="500+ weddings. Each one unique. Each one a story worth remembering."/>
    <section className="section gallery-page"><div className="container-wide"><div className="filter-row" role="tablist">{filters.map(([key,label]) => <button key={key} role="tab" aria-selected={filter === key} aria-controls="gallery-grid" className={`filter-pill ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>{label}</button>)}</div><div className="gallery-grid" id="gallery-grid" role="tabpanel">{filtered.map((item, i) => <Reveal key={item.src + filter} delay={(i%6)*35}><button className="gallery-card" onClick={() => setSelected(i)} aria-label={`View ${item.title}`}><img src={img(item.src.replace('?', ''), 1250)} alt={item.title} loading="lazy" decoding="async" width={1250} height={850}/><span className="gallery-card-meta"><small>{item.category}</small>{item.title}<b>+</b></span></button></Reveal>)}</div></div></section>
    <section className="instagram-strip"><div className="container-wide"><div><span className="eyebrow light"><span/>@your_instagram</span><h2>More inspiration,<br/><em>every day.</em></h2></div><a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-light">Follow on Instagram <Arrow /></a></div></section>
    {selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image gallery" tabIndex="-1" ref={lightboxRef} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}><button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close gallery">×</button><button className="lightbox-nav prev" onClick={() => setSelected((selected + filtered.length - 1) % filtered.length)} aria-label="Previous image">←</button><div className="lightbox-media"><img src={img(filtered[selected].src.replace('?', ''), 1900)} alt={filtered[selected].title} loading="lazy" decoding="async" /><div><span>{filtered[selected].category}</span><strong>{filtered[selected].title}</strong><small>{String(selected+1).padStart(2,'0')} / {String(filtered.length).padStart(2,'0')}</small></div></div><button className="lightbox-nav next" onClick={() => setSelected((selected + 1) % filtered.length)} aria-label="Next image">→</button></div>}
  </main>;
});

const Packages = React.memo(function Packages() {
  return <main><PageHero number="05 / 06" kicker="Packages" title="Beautifully built.\nMade" accent="flexible." copy="Every Event Planer package is a starting point — not a ceiling. All packages are customisable to match your vision, guest count and requirements."/>
    <section className="section packages-page"><div className="container-wide"><div className="package-grid">{packages.map((pkg, i)=><Reveal key={pkg.name} delay={i*70}><article className={`package-card ${pkg.featured ? 'featured' : ''}`}>{pkg.featured && <span className="popular">Most popular</span>}<span className="package-tier">{pkg.tier}</span><h2>{pkg.name}</h2><div className="package-price">{pkg.price}<small>{pkg.price !== 'Custom' ? '+' : ''}</small></div><span className="package-label">{pkg.label}</span><div className="divider"/><div className="package-features">{pkg.features.map(f => <div key={f}><span>✓</span>{f}</div>)}</div><AppLink to="/contact" className={`btn ${pkg.featured ? 'btn-gold' : 'btn-dark'} full`}>{pkg.price === 'Custom' ? 'Get a custom quote' : 'Enquire now'} <Arrow /></AppLink><small className="package-note">{pkg.note}</small></article></Reveal>)}</div><p className="pricing-note">* All prices are indicative starting points. Final quote depends on guest count, venue and specific requirements.</p></div></section>
    <section className="section section-soft"><div className="container-wide"><SectionIntro eyebrow="Compare" title={<>Package <em>comparison.</em></>}/><div className="table-wrap"><table><thead><tr><th>Feature</th><th>Blossom</th><th>Signature</th><th>Limitless</th></tr></thead><tbody>{comparison.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={i} className={cell === '✓' ? 'yes' : cell === '—' ? 'no' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></div></section>
    <section className="section"><div className="container-wide"><SectionIntro eyebrow="Enhance your celebration" title={<>Popular <em>add-ons.</em></>}/><div className="addons-grid">{addOns.map(([name, price, icon], i)=><Reveal key={name} delay={i*35}><div className="addon-card"><span aria-hidden="true">{icon}</span><h3>{name}</h3><p>{price}</p></div></Reveal>)}</div></div></section><CTA/></main>;
});

const Contact = React.memo(function Contact({ testimonials }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({name:'', partner:'', phone:'', email:'', date:'', venue:'', service:'', guests:'', budget:'', message:'', consent:false});
  const [errors, setErrors] = useState({});

  const update = useCallback(e => {
    const { name, type, checked, value } = e.target;
    setForm(v => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    setErrors(e => ({ ...e, [name]: false }));
  }, []);

  async function submit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!form.phone) newErrors.phone = 'Phone is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { error } = await supabase.from('enquiries').insert([
        {
          name: form.name || null,
          phone: form.phone,
          email: form.email || null,
          date: form.date || null,
          venue: form.venue || null,
          service: form.service || null,
          guests: form.guests || null,
          budget: form.budget || null,
          message: form.message || null,
          consent: form.consent
        }
      ]);
      if (error) {
        console.error("Error saving enquiry:", error);
        alert(`Failed to submit enquiry: ${error.message}`);
        return;
      }
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  }

  return <main><PageHero number="06 / 06" kicker="Let's talk" title="Your perfect event" accent="starts here." copy="Tell us a little about your celebration. We respond within 24 hours — always."/>
    <section className="section contact-page"><div className="container-wide contact-grid"><div>{sent ? <div className="success-card"><span>✦</span><h2>Thank you.</h2><p>We have received your enquiry. Our team will get back to you shortly.</p><button className="btn btn-dark" onClick={() => setSent(false)}>Send another enquiry <Arrow/></button></div> : <><SectionIntro eyebrow="Send an enquiry" title={<>Tell us about <em>your event.</em></>}/><form className="contact-form" onSubmit={submit}>{[['name','Your name','text','Priya Sharma'],['phone','Phone number *','tel','+91 98XXX XXXXX'],['email','Email address','email','your@email.com'],['date','Event date','date',''],['venue','Venue / location','text','[City], [Region]']].map(([name,label,type,placeholder])=><label key={name} htmlFor={`input-${name}`}><span>{label}</span><input id={`input-${name}`} name={name} type={type} value={form[name]} placeholder={placeholder} onChange={update} aria-invalid={!!errors[name]} />{errors[name] && <span className="error-text">{errors[name]}</span>}</label>)}<label htmlFor="input-service"><span>Service required</span><select id="input-service" name="service" value={form.service} onChange={update} aria-invalid={!!errors.service}><option value="">Select a service</option><option>Full Event Planning</option><option>Décor Only</option><option>Destination Event</option><option>Catering Only</option><option>Photography &amp; Film</option><option>Entertainment / DJ</option><option>Other / Multiple Services</option></select>{errors.service && <span className="error-text">{errors.service}</span>}</label><label htmlFor="input-guests"><span>Estimated guest count</span><select id="input-guests" name="guests" value={form.guests} onChange={update}><option value="">Select range</option><option>50 – 100 Guests</option><option>100 – 300 Guests</option><option>300 – 500 Guests</option><option>500 – 1,000 Guests</option><option>1,000+ Guests</option></select></label><label htmlFor="input-budget"><span>Approximate budget</span><select id="input-budget" name="budget" value={form.budget} onChange={update}><option value="">Prefer not to say</option><option>₹1L – ₹2L</option><option>₹2L – ₹5L</option><option>₹5L – ₹10L</option><option>₹10L – ₹20L</option><option>₹20L+</option></select></label><label className="wide" htmlFor="input-message"><span>Tell us your vision</span><textarea id="input-message" name="message" value={form.message} placeholder="Style, theme, must-haves, anything that inspires you…" onChange={update}/></label><label className="consent wide" htmlFor="input-consent"><input id="input-consent" type="checkbox" name="consent" checked={form.consent} onChange={update} aria-invalid={!!errors.consent}/><span>I consent to Event Planer storing and using my details to respond to this enquiry.</span>{errors.consent && <span className="error-text">{errors.consent}</span>}</label><button className="btn btn-dark full wide" type="submit">Send my enquiry <Arrow /></button></form></>}</div>
      <aside className="contact-aside"><div className="contact-panel"><div className="eyebrow light"><span/>Find us</div><h2>Get in <em>touch.</em></h2><div className="contact-block"><span>Location</span><strong>{site.location}</strong><small>Serving all of [Region] &amp; beyond</small></div><div className="contact-block"><span>Call / WhatsApp</span><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><a href={`tel:${site.phone2}`}>{site.phone2Display}</a></div><div className="contact-block"><span>Email</span><a href={`mailto:${site.email}`}>{site.email}</a></div><div className="contact-block"><span>Working hours</span><strong>Monday – Sunday</strong><small>9:00 AM – 7:00 PM</small></div><div className="contact-actions"><a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a><a href={site.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div></div></aside></div></section>
    <section className="section section-soft"><div className="container-wide"><SectionIntro eyebrow="Social proof" title={<>Loved by <em>our couples.</em></>} /><div className="review-grid">{testimonials.map((t,i)=><Reveal key={t.name} delay={i*50}><article className="review-card"><span className="stars" aria-label="5 stars">★★★★★</span><p>“{t.quote}”</p><strong>{t.name}</strong><small>{t.type}</small></article></Reveal>)}</div></div></section>
  </main>;
});

const NotFound = React.memo(function NotFound() { return <main><PageHero number="00" kicker="Page not found" title="This page" accent="wandered off." copy="The address you opened is not part of the current Event Planer experience."/><section className="section"><div className="container-wide not-found"><AppLink to="/" className="btn btn-dark">Back home <Arrow/></AppLink></div></section></main>; });

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div className="container-wide" style={{padding: '10vh 0', textAlign: 'center'}}><h2>Something went wrong.</h2><a href="/" className="btn btn-dark" onClick={() => window.location.reload()}>Reload Page</a></div>;
    }
    return this.props.children;
  }
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) {
      setShow(true);
    }
  }, []);
  
  if (!show) return null;
  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p>We use cookies to improve your experience.</p>
      <button className="btn btn-light" onClick={() => { localStorage.setItem('cookie-consent', 'true'); setShow(false); }}>Accept</button>
    </div>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) setProgress((scrolled / height) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}

function SEO() {
  const current = usePath();
  const { gallery, testimonials } = useData();
  useEffect(() => {
    const titles = {
      '/': 'Luxury Wedding Planner in [City] | Event Planer',
      '/about': 'Our Story | Event Planer [City]',
      '/services': 'Wedding Services | Event Planer',
      '/gallery': 'Portfolio | Event Planer [City]',
      '/packages': 'Packages & Pricing | Event Planer',
      '/contact': 'Contact Us | Event Planer [City]'
    };
    document.title = titles[current] || 'Event Planer | Luxury Weddings';
  }, [current]);

  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Event Planer",
    "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800",
    "description": "Luxury wedding event planning house based in [City], [Region].",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "[City]",
      "addressRegion": "[Region]",
      "addressCountry": "IN"
    },
    "telephone": site.phone,
    "email": site.email
  }), []);

  return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
}

function SkipLink() {
  return <a href="#main-content" className="skip-link">Skip to content</a>;
}

function App() {
  const current = usePath();
  const { gallery, testimonials } = useData();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [current]);

  let page = <NotFound/>;
  if (current === '/') page = <Home gallery={gallery} testimonials={testimonials} />;
  else if (current === '/about') page = <About/>;
  else if (current === '/services') page = <Services/>;
  else if (current === '/gallery') page = <Gallery gallery={gallery} />;
  else if (current === '/packages') page = <Packages/>;
  else if (current === '/contact') page = <Contact testimonials={testimonials} />;
  else if (current === '/admin') page = <Admin />;

  return <>
    <SEO />
    <SkipLink />
    <ScrollProgress />
    <PageLoader/>
    <Navbar current={current}/>
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          id="main-content"
        >
          {page}
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
    <Footer/>
    <FloatingUI/>
    <CookieBanner/>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
