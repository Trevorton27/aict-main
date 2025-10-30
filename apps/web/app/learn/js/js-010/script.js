// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function flatten1(arr) {
  // TODO
}

// Do not edit below this line
window.flatten1 = flatten1;

// Auto-run test
try { (function(){
const out=window.flatten1([1,[2,3],[4]]); const p=[],f=[]; if(JSON.stringify(out)===JSON.stringify([1,2,3,4]))p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
