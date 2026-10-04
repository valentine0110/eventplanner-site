const fs = require('fs');

let css = fs.readFileSync('src/styles.css', 'utf-8');

css = css.replace(
  '.gallery-card{border:0;padding:0;background:#222;position:relative;overflow:hidden;grid-column:span 4;grid-row:span 2;text-align:left}',
  '.gallery-grid > .reveal { grid-column: span 4; grid-row: span 2; }\n.gallery-card{border:0;padding:0;background:#222;position:relative;overflow:hidden;text-align:left;height:100%;width:100%;display:block;}'
);

css = css.replace(
  '.gallery-card:nth-child(3n+2){grid-column:span 5;grid-row:span 3}',
  '.gallery-grid > .reveal:nth-child(3n+2){grid-column:span 5;grid-row:span 3}'
);

css = css.replace(
  '.gallery-card:nth-child(4n+3){grid-column:span 3;grid-row:span 2}',
  '.gallery-grid > .reveal:nth-child(4n+3){grid-column:span 3;grid-row:span 2}'
);

css = css.replace(
  '.gallery-card,.gallery-card:nth-child(3n+2),.gallery-card:nth-child(4n+3){grid-column:span 1;grid-row:span 2}',
  '.gallery-grid > .reveal,.gallery-grid > .reveal:nth-child(3n+2),.gallery-grid > .reveal:nth-child(4n+3){grid-column:span 1;grid-row:span 2}'
);

css = css.replace(
  '.gallery-card:nth-child(3n+2){grid-row:span 3}',
  '.gallery-grid > .reveal:nth-child(3n+2){grid-row:span 3}'
);

fs.writeFileSync('src/styles.css', css, 'utf-8');
console.log('Fixed styles.css');
