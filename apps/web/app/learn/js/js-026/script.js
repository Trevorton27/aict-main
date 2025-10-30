// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function parseQuery(qs) {
  // TODO
}

// Do not edit below this line
window.parseQuery = parseQuery;

// Auto-run test
try { (function(){
const p=[],f=[]; const o=window.parseQuery('?a=1&b=hello'); if(o.a==='1'&&o.b==='hello') p.push('a1'); return {passedIds:p, failedIds:f, passed:p.length===1};
})(); } catch(e){ console.error(e); }
