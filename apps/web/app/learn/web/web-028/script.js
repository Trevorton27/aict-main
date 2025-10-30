// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#rbtn')); const p=[],f=[]; if(parseInt(s.borderRadius)>=8) p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
