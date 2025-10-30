// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#pic')); const p=[],f=[]; if(s.maxWidth==='400px' and s.width in ['500px','auto','']) p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
