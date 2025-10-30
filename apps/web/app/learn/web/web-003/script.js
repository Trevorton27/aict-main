// Append an li to #list on click

// Auto-run test
try { (function(){
const p=[],f=[]; document.querySelector('#add').click(); const items=[...document.querySelectorAll('#list li')]; if(items.length===2 && items[1].textContent==='New') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
