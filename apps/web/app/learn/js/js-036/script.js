// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function powFast(a,b) {
  // TODO
}

// Do not edit below this line
window.powFast = powFast;

// Auto-run test
try { (function(){
const fn=window.powFast; const p=[],f=[]; if(fn(2,10)===1024)p.push('a1'); if(fn(5,0)===1)p.push('a2'); if(fn(3,1)===3)p.push('a3'); return {passedIds:p, failedIds:f, passed:p.length===3};
})(); } catch(e){ console.error(e); }
