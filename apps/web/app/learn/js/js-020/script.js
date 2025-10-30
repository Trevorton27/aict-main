// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function mapValues(obj,f) {
  // TODO
}

// Do not edit below this line
window.mapValues = mapValues;

// Auto-run test
try { (function(){
const out=window.mapValues({a:1,b:2},x=>x*2); const p=[],f=[]; if(out.a===2 && out.b===4) p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
