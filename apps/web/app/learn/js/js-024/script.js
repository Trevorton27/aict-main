// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function memoize(fn) {
  // TODO
}

// Do not edit below this line
window.memoize = memoize;

// Auto-run test
try { (function(){
const p=[],f=[]; let calls=0; const slow=x=>{calls++; return x*x;}; const m=window.memoize(slow); m(3); m(3); if(calls===1)p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
