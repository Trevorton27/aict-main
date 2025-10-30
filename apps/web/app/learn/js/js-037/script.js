// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function binarySearch(arr, target) {
  // TODO
}

// Do not edit below this line
window.binarySearch = binarySearch;

// Auto-run test
try { (function(){
const fn=window.binarySearch; const p=[],f=[]; if(fn([1,3,5,7,9],7)===3)p.push('a1'); if(fn([1,3,5],2)===-1)p.push('a2'); return {passedIds:p, failedIds:f, passed:p.length===2};
})(); } catch(e){ console.error(e); }
