// pure function + handler
function countWords(s){ /* split on whitespace, ignore empties */ }
const el=document.getElementById('txt'); const out=document.getElementById('out'); out.textContent=String(countWords(el.value));
window.countWords = countWords;

// Auto-run test
try { (function(){
const p=[],f=[]; if(document.getElementById('out').textContent==='3') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
