// No JS

// Auto-run test
try { (function(){
const img=document.querySelector('#pic'); const p=[],f=[]; const w=getComputedStyle(img).width; if(w==='400px'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
