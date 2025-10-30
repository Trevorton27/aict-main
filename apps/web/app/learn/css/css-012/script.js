// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#u')); const p=[],f=[]; if(s.listStyleType==='none'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
