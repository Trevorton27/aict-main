// No JS required for this HTML challenge

// Auto-run test
try { (function(){
const passed = []; const failed = [];
try {
  if (document.querySelectorAll('h1').length === 1) { passed.push("a01"); }
  else { failed.push("a01"); }
} catch (e) { failed.push("a01"); }

try {
  if (document.querySelectorAll('h2').length === 2) { passed.push("a02"); }
  else { failed.push("a02"); }
} catch (e) { failed.push("a02"); }

try {
  if (document.querySelector('h1')?.textContent.trim().length > 0) { passed.push("a03"); }
  else { failed.push("a03"); }
} catch (e) { failed.push("a03"); }

return { passedIds: passed, failedIds: failed, passed: failed.length === 0 };
})(); } catch(e){ console.error(e); }
