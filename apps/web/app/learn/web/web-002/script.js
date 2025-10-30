// Toggle dark class on body

// Auto-run test
try { (function(){
const p=[],f=[]; const btn=document.querySelector('#toggle'); btn.click(); if(document.body.classList.contains('dark')) p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
