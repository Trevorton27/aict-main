// Implement debounce and demonstrate
function debounce(fn, delay){ /* TODO */ }
const out=document.getElementById('hits'); const inc=()=>{ out.textContent=String(+out.textContent+1); };
const d=debounce(inc, 0); d(); d(); d(); setTimeout(()=>d(),0);
window.debounce = debounce;

// Auto-run test
try { (function(){
const p=[],f=[]; return new Promise(res=>setTimeout(()=>{ if(document.getElementById('hits').textContent==='2') res({passedIds:['a1'], failedIds:[], passed:true}); else res({passedIds:[], failedIds:['a1'], passed:false}); },5));
})(); } catch(e){ console.error(e); }
