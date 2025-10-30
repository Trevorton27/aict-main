// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#hero')); const p=[],f=[]; if((s.backgroundImage||'').includes('hero.jpg')){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
