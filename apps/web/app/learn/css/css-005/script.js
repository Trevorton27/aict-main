// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.body); const p=[],f=[]; if(s.backgroundColor==='rgb(255, 255, 0)'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
