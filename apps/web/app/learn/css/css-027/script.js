// No JS

// Auto-run test
try { (function(){
const li=document.querySelectorAll('#list li'); const p=[],f=[]; const s=getComputedStyle(li[1]); if(s.color==='rgb(0, 128, 0)'){p.push('a01')}else{f.push('a01')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
