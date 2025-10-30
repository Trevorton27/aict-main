// Wire up open/close

// Auto-run test
try { (function(){
const p=[],f=[]; document.querySelector('#open').click(); if(!document.querySelector('#modal').classList.contains('open')) f.push('a1'); document.querySelector('#close').click(); if(document.querySelector('#modal').classList.contains('open')) f.push('a2'); return {passedIds: f.length?[]:['a1','a2'], failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
