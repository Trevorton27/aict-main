// Swap nodes

// Auto-run test
try { (function(){
const p=[],f=[]; const list=document.querySelector('#list'); const a=document.getElementById('a'); const b=document.getElementById('b'); list.insertBefore(b,a); const order=[...list.children].map(x=>x.id).join(''); if(order==='ba') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
