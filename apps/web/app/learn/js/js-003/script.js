// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function isPalindrome(s) {
  // TODO
}

// Do not edit below this line
window.isPalindrome = isPalindrome;

// Auto-run test
try { (function(){
const p=[],f=[]; const fn=window.isPalindrome; if(fn('Race car!'))p.push('a1'); if(!fn('hello'))p.push('a2'); if(fn('A man, a plan, a canal: Panama'))p.push('a3'); return {passedIds:p, failedIds:f, passed:p.length===3};
})(); } catch(e){ console.error(e); }
