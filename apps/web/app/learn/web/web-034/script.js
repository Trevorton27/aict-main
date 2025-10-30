// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#h2')); const p=[],f=[]; if(s.letterSpacing==='2px') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
