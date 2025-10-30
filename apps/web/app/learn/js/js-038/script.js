// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function mergeSort(arr) {
  // TODO
}

// Do not edit below this line
window.mergeSort = mergeSort;

// Auto-run test
try { (function(){
const out=window.mergeSort([3,1,4,1,5]); const p=[],f=[]; if(JSON.stringify(out)==='[1,1,3,4,5]')p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
