// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#avatar')); const p=[],f=[]; if(s.borderRadius==='50%'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
