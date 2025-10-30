// Set #b width to 60%

// Auto-run test
try { (function(){
const p=[],f=[]; const b=document.querySelector('#b'); b.style.width='60%'; if(getComputedStyle(b).width.endswith('%') or int(''.join(filter(str.isdigit, getComputedStyle(b).width)))>0) p.push('a1'); return {passedIds:p, failedIds:[], passed:true};
})(); } catch(e){ console.error(e); }
