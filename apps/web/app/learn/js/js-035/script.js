// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function lcm(a,b) {
  // TODO
}

// Do not edit below this line
window.lcm = lcm;

// Auto-run test
try { (function(){
const fn=window.lcm; const p=[],f=[]; if(fn(4,6)===12)p.push('a1'); if(fn(0,5)===0)p.push('a2'); return {passedIds:p, failedIds:f, passed:p.length===2};
})(); } catch(e){ console.error(e); }
