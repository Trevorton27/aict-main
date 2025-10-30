// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#b')); const p=[],f=[]; if(parseInt(s.fontWeight)>=700){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
