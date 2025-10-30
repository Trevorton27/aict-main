// Implement isEmail and attach blur handler
function isEmail(s){ /* TODO: basic check: contains '@' and '.' after it */ }
const el=document.getElementById('email'); el.addEventListener('blur',()=>{ if(!isEmail(el.value)) el.classList.add('error'); });
window.isEmail = isEmail;

// Auto-run test
try { (function(){
const p=[],f=[]; const el=document.querySelector('#email'); el.dispatchEvent(new Event('blur')); if(el.classList.contains('error')) p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
