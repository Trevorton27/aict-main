// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function gcd(a,b) {
  // TODO
}

// Do not edit below this line
window.gcd = gcd;

// Auto-run test
try { (function(){
const fn=window.gcd; const p=[],f=[]; if(fn(54,24)===6)p.push('a1'); if(fn(0,5)===5)p.push('a2'); return {passedIds:p, failedIds:f, passed:p.length===2};
})(); } catch(e){ console.error(e); }
