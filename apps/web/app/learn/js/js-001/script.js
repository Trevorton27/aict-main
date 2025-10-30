// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function sumArray(arr) {
  // TODO
}

// Do not edit below this line
window.sumArray = sumArray;

// Auto-run test
try { (function(){
const p=[],f=[]; try{ if(window.sumArray([1,2,3,4])===10) p.push('a1'); if(window.sumArray([])===0) p.push('a2'); if(window.sumArray([-2,2])===0) p.push('a3'); }catch(e){f.push('err');} return {passedIds:p, failedIds:f, passed:f.length===0 && p.length===3};
})(); } catch(e){ console.error(e); }
