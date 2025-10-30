// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function reverseWords(s) {
  // TODO
}

// Do not edit below this line
window.reverseWords = reverseWords;

// Auto-run test
try { (function(){
const p=[],f=[]; const fn=window.reverseWords; if(fn('a b c')==='c b a')p.push('a1'); if(fn('hello world')==='world hello')p.push('a2'); return {passedIds:p, failedIds:f, passed:p.length===2};
})(); } catch(e){ console.error(e); }
