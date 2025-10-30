function nextIndex(i,len){ /* (i+1)%len */ }
const len=3; document.getElementById('next').addEventListener('click',()=>{ const el=document.getElementById('img'); el.dataset.index=String(nextIndex(+el.dataset.index, len)); }); document.getElementById('next').click();
window.nextIndex = nextIndex;

// Auto-run test
try { (function(){
const p=[],f=[]; if(document.getElementById('img').dataset.index==='1') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
