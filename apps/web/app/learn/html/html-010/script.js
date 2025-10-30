// No JS required for this HTML challenge

// Auto-run test
try { (function(){
const passed = []; const failed = [];
try {
  if (!!document.querySelector('table thead th')) { passed.push("a01"); }
  else { failed.push("a01"); }
} catch (e) { failed.push("a01"); }

try {
  if (document.querySelectorAll('table thead th').length===2) { passed.push("a02"); }
  else { failed.push("a02"); }
} catch (e) { failed.push("a02"); }

try {
  if (Array.from(document.querySelectorAll('table thead th')).map(th=>th.textContent.trim()).join(',')==='A,B') { passed.push("a03"); }
  else { failed.push("a03"); }
} catch (e) { failed.push("a03"); }

try {
  if (Array.from(document.querySelectorAll('table tbody td')).map(td=>td.textContent.trim()).join(',')==='1,2') { passed.push("a04"); }
  else { failed.push("a04"); }
} catch (e) { failed.push("a04"); }

return { passedIds: passed, failedIds: failed, passed: failed.length === 0 };
})(); } catch(e){ console.error(e); }
