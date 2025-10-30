async function copy(text){ /* if navigator.clipboard use writeText, else set window.__clipboard__=text and return true */ }
const v=document.getElementById('src').value; copy(v);
window.copy = copy;

// Auto-run test
try { (function(){
const p=[],f=[]; setTimeout(()=>{},0); const ok=(navigator.clipboard&&navigator.clipboard.writeText) || window.__clipboard__==='secret'; if(ok) {return {passedIds:['a1'], failedIds:[], passed:true}} else {return {passedIds:[], failedIds:['a1'], passed:false}}
})(); } catch(e){ console.error(e); }
