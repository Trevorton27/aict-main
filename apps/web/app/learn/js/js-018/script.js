// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function fib(n) {
  // TODO
}

// Do not edit below this line
window.fib = fib;

// Auto-run test
try { (function(){
const fn=window.fib; const p=[],f=[]; if(fn(0)===0 && fn(1)===1 && fn(7)===13) p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
