// Add click handler to change h1 text

// Auto-run test
try { (function(){
const p=[],f=[]; const btn=document.querySelector('#btn'); btn.click(); if(document.querySelector('#title').textContent==='Updated') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
