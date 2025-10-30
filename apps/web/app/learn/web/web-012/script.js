// Implement throttle then simulate rapid calls
function throttle(fn, delay){ /* TODO */ }
const out=document.getElementById('n'); const inc=()=>out.textContent=String(+out.textContent+1);
const t=throttle(inc, 0);
t(); t(); t(); setTimeout(t,0);
window.throttle = throttle;

// Auto-run test
try { (function(){
const p=[],f=[]; return new Promise(res=>setTimeout(()=>{ const v=document.getElementById('n').textContent; if(v==='2') res({passedIds:['a1'], failedIds:[], passed:true}); else res({passedIds:[], failedIds:['a1'], passed:false}); },5));
})(); } catch(e){ console.error(e); }
