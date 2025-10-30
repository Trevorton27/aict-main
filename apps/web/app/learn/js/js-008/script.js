// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function isAnagram(a,b) {
  // TODO
}

// Do not edit below this line
window.isAnagram = isAnagram;

// Auto-run test
try { (function(){
const fn=window.isAnagram; const p=[],f=[]; if(fn('listen','silent'))p.push('a1'); if(fn('rail safety','fairy tales'))p.push('a2'); if(!fn('rat','car'))p.push('a3'); return {passedIds:p, failedIds:f, passed:p.length===3};
})(); } catch(e){ console.error(e); }
