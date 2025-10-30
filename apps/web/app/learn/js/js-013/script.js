// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function shallowEqual(a,b) {
  // TODO
}

// Do not edit below this line
window.shallowEqual = shallowEqual;

// Auto-run test
try { (function(){
const fn=window.shallowEqual; const p=[],f=[]; if(fn({x:1,y:2},{x:1,y:2}))p.push('a1'); if(!fn({x:1},{x:2}))p.push('a2'); return {passedIds:p, failedIds:f, passed:p.length===2};
})(); } catch(e){ console.error(e); }
