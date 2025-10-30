// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function range(start,end,step=1) {
  // TODO
}

// Do not edit below this line
window.range = range;

// Auto-run test
try { (function(){
const p=[],f=[]; const r1=window.range(1,5); const r2=window.range(0,6,2); if(JSON.stringify(r1)==='[1,2,3,4,5]')p.push('a1'); if(JSON.stringify(r2)==='[0,2,4,6]')p.push('a2'); return {passedIds:p, failedIds:f, passed:p.length===2};
})(); } catch(e){ console.error(e); }
