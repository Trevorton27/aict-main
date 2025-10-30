// Remove #ad

// Auto-run test
try { (function(){
const p=[],f=[]; const el=document.querySelector('#ad'); if(el) el.remove(); if(!document.querySelector('#ad')) p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
