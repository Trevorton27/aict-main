// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function groupBy(arr,f) {
  // TODO
}

// Do not edit below this line
window.groupBy = groupBy;

// Auto-run test
try { (function(){
const out=window.groupBy(['ant','bat','bear'], x=>x[0]); const p=[],f=[]; if(JSON.stringify(out)==='{"a":["ant"],"b":["bat","bear"]}') p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
