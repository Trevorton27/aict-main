// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function countVowels(s) {
  // TODO
}

// Do not edit below this line
window.countVowels = countVowels;

// Auto-run test
try { (function(){
const fn=window.countVowels; const p=[],f=[]; if(fn('Hello')===2)p.push('a1'); if(fn('AEIOU')===5)p.push('a2'); return {passedIds:p, failedIds:f, passed:p.length===2};
})(); } catch(e){ console.error(e); }
