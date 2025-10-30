// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#big')); const p=[],f=[]; if(s.fontSize==='32px'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
