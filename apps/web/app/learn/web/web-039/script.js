function isLongEnough(s,min){ /* return s.length>=min */ }
const input=document.getElementById('txt'); const go=document.getElementById('go'); if(isLongEnough(input.value,2)) go.disabled=false;
window.isLongEnough = isLongEnough;

// Auto-run test
try { (function(){
const p=[],f=[]; if(!document.getElementById('go').disabled) p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
