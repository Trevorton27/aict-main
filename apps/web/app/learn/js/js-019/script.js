// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function balanced(s) {
  // TODO
}

// Do not edit below this line
window.balanced = balanced;

// Auto-run test
try { (function(){
const fn=window.balanced; const p=[],f=[]; if(fn('([])'))p.push('a1'); if(!fn('([)]'))p.push('a2'); if(fn('{[()]}'))p.push('a3'); return {passedIds:p, failedIds:f, passed:p.length===3};
})(); } catch(e){ console.error(e); }
