// No JS required for this HTML challenge

// Auto-run test
try { (function(){
const passed = []; const failed = [];
try {
  if (!!document.querySelector('header')) { passed.push("a01"); }
  else { failed.push("a01"); }
} catch (e) { failed.push("a01"); }

try {
  if (!!document.querySelector('nav')) { passed.push("a02"); }
  else { failed.push("a02"); }
} catch (e) { failed.push("a02"); }

try {
  if (!!document.querySelector('main')) { passed.push("a03"); }
  else { failed.push("a03"); }
} catch (e) { failed.push("a03"); }

try {
  if (!!document.querySelector('footer')) { passed.push("a04"); }
  else { failed.push("a04"); }
} catch (e) { failed.push("a04"); }

return { passedIds: passed, failedIds: failed, passed: failed.length === 0 };
})(); } catch(e){ console.error(e); }
