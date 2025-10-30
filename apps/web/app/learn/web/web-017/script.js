// Implement parseStep and hook up click
function parseStep(btn){ /* parseInt(btn.dataset.step||'1',10) */ }
document.getElementById('inc').addEventListener('click',()=>{ const step=parseStep(document.getElementById('inc')); const n=document.getElementById('n'); n.textContent=String(+n.textContent + step); });
// simulate
document.getElementById('inc').click();
window.parseStep = parseStep;

// Auto-run test
try { (function(){
const p=[],f=[]; if(document.getElementById('n').textContent==='3') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
