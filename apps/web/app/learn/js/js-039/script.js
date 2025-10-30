// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function topKFrequent(arr,k) {
  // TODO
}

// Do not edit below this line
window.topKFrequent = topKFrequent;

// Auto-run test
try { (function(){
const r=window.topKFrequent([1,1,1,2,2,3],2); const p=[],f=[]; if(r.length===2 && r.includes(1) && r.includes(2)) p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
