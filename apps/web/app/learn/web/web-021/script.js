// Replace innerHTML with marked matches 'lo'

// Auto-run test
try { (function(){
const p=[],f=[]; const el=document.querySelector('#p'); el.innerHTML=el.textContent.replace(/lo/g,'<mark>lo</mark>'); const count=(el.innerHTML.match(/<mark>/g)||[]).length; if(count>=2) p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
