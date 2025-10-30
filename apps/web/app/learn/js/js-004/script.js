// Implement the function below.
// Keep it pure: no DOM access, no network, no randomness (unless specified).
function fizzbuzz(n) {
  // TODO
}

// Do not edit below this line
window.fizzbuzz = fizzbuzz;

// Auto-run test
try { (function(){
const a=window.fizzbuzz(20); const p=[],f=[]; if(a[2]==='Fizz')p.push('a1'); if(a[4]==='Buzz')p.push('a2'); if(a[14]==='FizzBuzz')p.push('a3'); return {passedIds:p, failedIds:f, passed:p.length===3};
})(); } catch(e){ console.error(e); }
