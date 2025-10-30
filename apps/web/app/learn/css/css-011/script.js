// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#lnk')); const p=[],f=[]; if((s.textDecorationLine||'').includes('underline')){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
