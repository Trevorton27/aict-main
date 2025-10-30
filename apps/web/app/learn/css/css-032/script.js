// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#h2')); const p=[],f=[]; if(s.letterSpacing==='2px'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
