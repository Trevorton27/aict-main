// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function unique(arr) {
  // TODO
}

// Do not edit below this line
window.unique = unique;

// Auto-run test
try { (function(){
const out=window.unique([1,1,2,3,3]); const p=[],f=[]; if(JSON.stringify(out)===JSON.stringify([1,2,3]))p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
