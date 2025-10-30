// No JS

// Auto-run test
try { (function(){
const el=document.querySelector('#ol'); const m=getComputedStyle(el.querySelector('li'), '::marker'); const p=[],f=[]; if(m.color==='rgb(255, 0, 0)'){p.push('a01')}else{f.push('a01')} if((m.fontWeight+'')>='700'){p.push('a02')}else{f.push('a02')} return {passedIds:p, failedIds:f, passed:f.length===0};
})(); } catch(e){ console.error(e); }
