// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function chunk(arr,k) {
  // TODO
}

// Do not edit below this line
window.chunk = chunk;

// Auto-run test
try { (function(){
const out=window.chunk([1,2,3,4,5],2); const p=[],f=[]; if(JSON.stringify(out)===JSON.stringify([[1,2],[3,4],[5]]))p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
