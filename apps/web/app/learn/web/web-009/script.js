// Implement compare and use it to sort
function compare(a,b){ /* return negative/zero/positive like a-b */ }
const tb=document.querySelector('#t tbody'); const rows=[...tb.querySelectorAll('tr')]; rows.sort((r1,r2)=>compare(+r1.cells[0].textContent, +r2.cells[0].textContent)); rows.forEach(r=>tb.appendChild(r));
window.compare = compare;

// Auto-run test
try { (function(){
const p=[],f=[]; const rows=[...document.querySelectorAll('#t tr')]; const order=rows.map(r=>r.cells[0].textContent).join(','); if(order==='1,2,3') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
