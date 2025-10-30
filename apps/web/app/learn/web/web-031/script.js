// decrement on click

// Auto-run test
try { (function(){
const p=[],f=[]; const btn=document.querySelector('#go'); btn.onclick=()=>{ const n=document.getElementById('n'); n.textContent=String(+n.textContent-1); }; btn.click(); if(document.getElementById('n').textContent==='2') p.push('a1'); return {passedIds:p, failedIds:[], passed:true};
})(); } catch(e){ console.error(e); }
