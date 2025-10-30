function serialize(form){ /* TODO: loop elements with name */ }
window.__form__=serialize(document.getElementById('f'));
window.serialize = serialize;

// Auto-run test
try { (function(){
const p=[],f=[]; const o=window.__form__; if(o && o.a==='1' && o.b==='2') p.push('a1'); else f.push('a1'); return {passedIds:p, failedIds:f, passed:!f.length};
})(); } catch(e){ console.error(e); }
