// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function omit(obj, keys) {
  // TODO
}

// Do not edit below this line
window.omit = omit;

// Auto-run test
try { (function(){
const r=window.omit({a:1,b:2,c:3}, ['b']); const p=[],f=[]; if(JSON.stringify(r)==='{"a":1,"c":3}')p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
