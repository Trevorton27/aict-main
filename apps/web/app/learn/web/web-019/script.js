// Implement select-all

// Auto-run test
try { (function(){
const p=[],f=[]; const all=document.querySelector('#all'); const items=[...document.querySelectorAll('.item')]; all.checked=true; all.dispatchEvent(new Event('change')); if(items.every(i=>i.checked)) p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
