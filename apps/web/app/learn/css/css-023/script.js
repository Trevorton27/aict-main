// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#hide-me')); const p=[],f=[]; if(s.display==='none' || s.visibility==='hidden'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
