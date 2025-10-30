// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#lp')); const p=[],f=[]; if(parseFloat(s.lineHeight)>=1.5*parseFloat(s.fontSize)-0.5){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
