// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#hdr')); const p=[],f=[]; if((s.position==='sticky'||s.position==='-webkit-sticky') && s.top==='0px') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
