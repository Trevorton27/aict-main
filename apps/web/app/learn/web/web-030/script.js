// No JS required

// Auto-run test
try { (function(){
const row=document.querySelectorAll('#tb tr')[1]; const s=getComputedStyle(row); const p=[],f=[]; if(s.backgroundColor==='rgb(240, 240, 240)') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
