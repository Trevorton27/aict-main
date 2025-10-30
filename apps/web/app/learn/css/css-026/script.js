// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#t')); const p=[],f=[]; if(s.color==='rgb(52, 152, 219)'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
