// Toggle open class

// Auto-run test
try { (function(){
const p=[],f=[]; document.querySelector('#h').click(); if(getComputedStyle(document.querySelector('#panel')).display!=='none') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
