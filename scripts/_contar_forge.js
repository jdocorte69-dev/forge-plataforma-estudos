const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const files = [...html.matchAll(/<script defer src="(js\/data[^\"]*\.js)"/g)].map(m => m[1]);
console.log('ARQUIVOS:', files.length, files.slice(0, 5).join(', '));
const source = files.map(f => fs.readFileSync(f, 'utf8')).join('\n') + '\n;globalThis.__cur = CURRICULUM;';
const ctx = { console, setTimeout, clearTimeout, localStorage: { getItem(){return null}, setItem(){}, removeItem(){} } };
ctx.window = ctx;
vm.createContext(ctx);
try { vm.runInContext(source, ctx, { filename: 'data-bundle.js' }); }
catch (e) { console.log('ERRO GERAL', e.message); }
const cur = ctx.__cur || {};
let mods = 0, lessons = 0, qs = 0;
for (const [track, t] of Object.entries(cur)) {
  const m = (t.modules || []).length;
  const l = (t.modules || []).reduce((a, x) => a + (x.lessons || []).length, 0);
  const q = (t.modules || []).reduce((a, x) => a + (x.lessons || []).reduce((b, y) => b + (y.exercises || []).length, 0), 0);
  mods += m; lessons += l; qs += q;
  console.log(track.padEnd(22), String(m).padStart(3), 'mod', String(l).padStart(4), 'aulas', String(q).padStart(5), 'questoes');
}
console.log('TOTAL'.padEnd(22), String(mods).padStart(3), 'mod', String(lessons).padStart(4), 'aulas', String(qs).padStart(5), 'questoes');
console.log('TRILHAS:', Object.keys(cur).length);
