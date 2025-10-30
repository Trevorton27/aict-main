// No JS

// Auto-run test
try { (function(){
const s=getComputedStyle(document.querySelector('#btn')); const p=[],f=[]; if(s.backgroundColor==='rgb(204, 204, 204)' || s.opacity==='0.5'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
