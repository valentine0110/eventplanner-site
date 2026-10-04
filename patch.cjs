const fs = require('fs');

let main = fs.readFileSync('src/main.jsx', 'utf8');

// Import framer-motion
main = main.replace("import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';", "import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';");

// Replace Reveal component
const revealRegex = /function Reveal\(\{ children, className = '', delay = 0 \}\) \{[\s\S]*?return <div ref=\{ref\}[^>]*>\{children\}<\/div>;\n\}/;
main = main.replace(revealRegex, `function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.12 }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: [0.2, 0.7, 0.2, 1] }}
      className={className + " framer-reveal"}
    >
      {children}
    </motion.div>
  );
}`);

// Replace App component transitions
const appTransitionRegex = /const \[isTransitioning, setIsTransitioning\] = useState\(false\);\n  const \[displayedPage, setDisplayedPage\] = useState\(current\);\n\n  useEffect\(\(\) => \{\n    if \(current !== displayedPage\) \{\n      setIsTransitioning\(true\);\n      const timer = setTimeout\(\(\) => \{\n        window\.scrollTo\(\{ top: 0, behavior: 'instant' \}\);\n        setDisplayedPage\(current\);\n        setIsTransitioning\(false\);\n      \}, 300\); \/\/ match transition duration\n      return \(\) => clearTimeout\(timer\);\n    \}\n  \}, \[current, displayedPage\]\);/;

main = main.replace(appTransitionRegex, `useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [current]);`);

// Update page content
main = main.replace(/let page = <NotFound\/>;\n  if \(displayedPage === '\/'\)/, `let page = <NotFound/>;\n  if (current === '/')`);
main = main.replace(/else if \(displayedPage ===/g, 'else if (current ===');

// Update return statement
const returnRegex = /<div id="main-content" className=\{`page-transition \$\{isTransitioning \? 'fade-out' : 'fade-in'\}`\}>\n        \{page\}\n      <\/div>/;
main = main.replace(returnRegex, `<AnimatePresence mode="wait">
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
      </AnimatePresence>`);

fs.writeFileSync('src/main.jsx', main);
