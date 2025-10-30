// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#centerme')); const passed=[], failed=[]; if(s.textAlign==='center'){passed.push('a01')}else{failed.push('a01')} return {passedIds:passed, failedIds:failed, passed:failed.length===0};
})(); } catch(e){ console.error(e); }
