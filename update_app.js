const fs = require('fs');

let content = fs.readFileSync('src/main.jsx', 'utf-8');

// 1. Add useData to App
content = content.replace(
  'const current = usePath();',
  'const current = usePath();\n  const { gallery, testimonials } = useData();'
);

// 2. Add /admin route and pass props
content = content.replace(
  "if (displayedPage === '/') page = <Home/>;",
  "if (displayedPage === '/') page = <Home gallery={gallery} testimonials={testimonials} />;"
);
content = content.replace(
  "else if (displayedPage === '/gallery') page = <Gallery/>;",
  "else if (displayedPage === '/gallery') page = <Gallery gallery={gallery} />;"
);
content = content.replace(
  "else if (displayedPage === '/contact') page = <Contact/>;",
  "else if (displayedPage === '/contact') page = <Contact testimonials={testimonials} />;"
);
content = content.replace(
  "else if (displayedPage === '/contact') page = <Contact testimonials={testimonials} />;",
  "else if (displayedPage === '/contact') page = <Contact testimonials={testimonials} />;\n  else if (displayedPage === '/admin') page = <Admin />;"
);

fs.writeFileSync('src/main.jsx', content, 'utf-8');
console.log('App updated');
