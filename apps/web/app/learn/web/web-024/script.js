// No JS required

// Auto-run test
try { (function(){
const p=[],f=[]; const wrap=document.querySelector('#wrap'); wrap.dispatchEvent(new Event('mouseover')); const s=getComputedStyle(wrap.querySelector('.tooltip')); if(s.display!=='none') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
