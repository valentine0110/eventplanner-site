const fs = require('fs');
let main = fs.readFileSync('src/main.jsx', 'utf8');

const faqComponent = `function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={\`faq-item \${open ? 'open' : ''}\`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <b className="faq-icon" style={{ transform: \`rotate(\${open ? 45 : 0}deg)\`, transition: 'transform 0.3s ease' }}>+</b>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
}`;

main = main.replace("const Services = React.memo(function Services() {", faqComponent + "\n\nconst Services = React.memo(function Services() {");

main = main.replace(
  /\{faqs\.map\(\(\[q,a\], i\)=><details key=\{q\} className="faq-item"><summary><span>\{q\}<\/span><b className="faq-icon">\+<\/b><\/summary><div className="faq-answer"><p>\{a\}<\/p><\/div><\/details>\)\}/,
  "{faqs.map(([q,a]) => <FAQItem key={q} q={q} a={a} />)}"
);

fs.writeFileSync('src/main.jsx', main);
