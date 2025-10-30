// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function curry2(f) {
  // TODO
}

// Do not edit below this line
window.curry2 = curry2;

// Auto-run test
try { (function(){
const add=(a,b)=>a+b; const c=window.curry2(add); const p=[],f=[]; if(c(2)(3)===5) p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
