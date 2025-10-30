// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function median(arr) {
  // TODO
}

// Do not edit below this line
window.median = median;

// Auto-run test
try { (function(){
const fn=window.median; const p=[],f=[]; if(fn([3,1,2])===2)p.push('a1'); if(fn([1,2,3,4])===2.5)p.push('a2'); return {passedIds:p, failedIds:f, passed:p.length===2};
})(); } catch(e){ console.error(e); }
