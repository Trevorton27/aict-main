// No JS

// Auto-run test
try { (function(){
const row=document.querySelectorAll('#tb tr')[1]; const s=getComputedStyle(row); const p=[],f=[]; if(s.backgroundColor==='rgb(240, 240, 240)'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
