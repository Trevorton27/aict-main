// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function isPrime(n) {
  // TODO
}

// Do not edit below this line
window.isPrime = isPrime;

// Auto-run test
try { (function(){
const fn=window.isPrime; const p=[],f=[]; if(fn(2)&&fn(13)&&!fn(1)&&!fn(21))p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
