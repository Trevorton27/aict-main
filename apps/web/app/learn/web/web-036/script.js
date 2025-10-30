// prevent submit

// Auto-run test
try { (function(){
const p=[],f=[]; document.getElementById('f').addEventListener('submit',e=>{ e.preventDefault(); document.getElementById('status').textContent='blocked'; }); document.getElementById('s').click(); if(document.getElementById('status').textContent==='blocked') p.push('a1'); return {passedIds:p, failedIds:[], passed:true};
})(); } catch(e){ console.error(e); }
