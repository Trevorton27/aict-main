// No JS required

// Auto-run test
try { (function(){
const el=document.querySelector('#p1'); const s=getComputedStyle(el); const passed=[], failed=[]; if(s.color==='rgb(0, 0, 255)'){passed.push('a01')}else{failed.push('a01')} return {passedIds:passed, failedIds:failed, passed:failed.length===0};
})(); } catch(e){ console.error(e); }
