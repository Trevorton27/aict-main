// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function deepClone(v) {
  // TODO
}

// Do not edit below this line
window.deepClone = deepClone;

// Auto-run test
try { (function(){
const fn=window.deepClone; const o={a:1,b:{c:2}}, c=fn(o); const p=[],f=[]; if(JSON.stringify(c)===JSON.stringify(o) && c!==o && c.b!==o.b) p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
