function toggleCase(s){ /* switch a<->A */ }
document.getElementById('out').textContent=toggleCase('AbC');
window.toggleCase = toggleCase;

// Auto-run test
try { (function(){
const p=[],f=[]; if(document.getElementById('out').textContent==='aBc') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
