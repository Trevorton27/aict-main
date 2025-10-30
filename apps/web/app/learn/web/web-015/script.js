// Implement togglePrimary to switch primary between #3498db and #e74c3c and apply it
function togglePrimary(){ /* TODO */ }
// call once

window.togglePrimary = togglePrimary;

// Auto-run test
try { (function(){
const p=[],f=[]; window.togglePrimary(); const c=getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(); if(c==='#e74c3c') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
