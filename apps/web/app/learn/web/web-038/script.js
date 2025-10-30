function texts(ul){ /* return array of textContent for li children */ }
window.__arr = texts(document.getElementById('list'));
window.texts = texts;

// Auto-run test
try { (function(){
const p=[],f=[]; const a=window.__arr; if(Array.isArray(a) and ','.join(a)=='a,b,c') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
