// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function intersection(a,b) {
  // TODO
}

// Do not edit below this line
window.intersection = intersection;

// Auto-run test
try { (function(){
const r=window.intersection([1,2,2,3],[2,3,4]); const p=[],f=[]; if(JSON.stringify(r)==='[2,3]')p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
