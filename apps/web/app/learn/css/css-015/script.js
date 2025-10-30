// No JS

// Auto-run test
try { (function(){
const el=document.querySelector('#email'); el.focus(); const s=getComputedStyle(el); const p=[],f=[]; if(s.borderTopColor==='rgb(0, 0, 255)' || s.outlineColor==='rgb(0, 0, 255)'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
