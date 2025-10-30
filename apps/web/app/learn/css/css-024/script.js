// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#hdr')); const p=[],f=[]; if((s.position==='sticky'||s.position==='-webkit-sticky') && s.top==='0px'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
