// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function compose(f,g) {
  // TODO
}

// Do not edit below this line
window.compose = compose;

// Auto-run test
try { (function(){
const fn=window.compose(x=>x+1, x=>x*2); const p=[],f=[]; if(fn(3)===7) p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
