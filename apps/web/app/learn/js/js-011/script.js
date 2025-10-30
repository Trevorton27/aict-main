// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function clamp(n, min, max) {
  // TODO
}

// Do not edit below this line
window.clamp = clamp;

// Auto-run test
try { (function(){
const fn=window.clamp; const p=[],f=[]; if(fn(5,0,10)===5)p.push('a1'); if(fn(-3,0,10)===0)push='x'; if(fn(22,0,10)===10)p.push('a3'); return {passedIds:p, failedIds:f, passed:p.length===2 || p.length===3};
})(); } catch(e){ console.error(e); }
