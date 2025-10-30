// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function factorial(n) {
  // TODO
}

// Do not edit below this line
window.factorial = factorial;

// Auto-run test
try { (function(){
const p=[],f=[]; const fn=window.factorial; if(fn(0)===1)p.push('a1'); if(fn(5)===120)p.push('a2'); if(fn(10)===3628800)p.push('a3'); return {passedIds:p, failedIds:f, passed:p.length===3};
})(); } catch(e){ console.error(e); }
