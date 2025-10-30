function save(name){ /* localStorage.setItem('name', name) */ }
const v=document.getElementById('name').value; save(v); document.getElementById('hi').textContent='Hello, '+localStorage.getItem('name');
window.save = save;

// Auto-run test
try { (function(){
const p=[],f=[]; if(document.getElementById('hi').textContent==='Hello, Alice') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
