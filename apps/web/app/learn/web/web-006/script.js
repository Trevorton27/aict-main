// Implement tabs

// Auto-run test
try { (function(){
const p=[],f=[]; const btn=[...document.querySelectorAll('.tab')][1]; btn.click(); const a=getComputedStyle(document.querySelector('#a')).display; const b=getComputedStyle(document.querySelector('#b')).display; if(a==='none' && b!=='none') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
