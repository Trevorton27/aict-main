// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#wrap2')); const p=[],f=[]; if(s.display==='flex' && s.justifyContent==='center' && s.alignItems==='center'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
