// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#b')); const p=[],f=[]; if((s.textTransform||'').toLowerCase()==='uppercase') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
