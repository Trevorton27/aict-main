// No JS

// Auto-run test
try { (function(){
const m=getComputedStyle(document.querySelector('#modal')); const p=[],f=[]; if(m.position==='fixed' && parseInt(m.zIndex)>=1000){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
