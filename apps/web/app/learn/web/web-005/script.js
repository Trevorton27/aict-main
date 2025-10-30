// Implement filter and then read #q and hide non-matching lis
function filter(items, q){ /* TODO: return array containing items that include q (case-insensitive) */ }
const q=document.getElementById('q').value.toLowerCase(); document.querySelectorAll('#list li').forEach(li=>{ /* TODO: use filter or includes to hide/show */ });
window.filter = filter;

// Auto-run test
try { (function(){
const p=[],f=[]; const lis=[...document.querySelectorAll('#list li')]; const hidden=lis.filter(li=>getComputedStyle(li).display==='none').map(li=>li.textContent); if(hidden.length===1 && hidden[0]==='pear') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
