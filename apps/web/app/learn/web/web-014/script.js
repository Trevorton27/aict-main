// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#grid')); const p=[],f=[]; if(s.display==='grid' && s.gridTemplateColumns.replace(/\s+/g,'')==='1fr1fr') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
