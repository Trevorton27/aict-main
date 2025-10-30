// No JS required

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#box')); const passed=[], failed=[]; if(s.borderTopWidth==='2px' && s.borderTopStyle==='solid' && s.borderTopColor==='rgb(255, 0, 0)'){passed.push('a01')}else{failed.push('a01')} return {passedIds:passed, failedIds:failed, passed:failed.length===0};
})(); } catch(e){ console.error(e); }
