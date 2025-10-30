// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#g')); const p=[],f=[]; if(getComputedStyle(document.documentElement).getPropertyValue('--gap').trim()==='16px' and s.gap=='16px') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
