// No JS required for this HTML challenge

// Auto-run test
try { (function(){
const passed = []; const failed = [];
try {
  if (document.querySelector('p')?.innerHTML.includes('&lt;') && document.querySelector('p')?.innerHTML.includes('&gt;')) { passed.push("a01"); }
  else { failed.push("a01"); }
} catch (e) { failed.push("a01"); }

return { passedIds: passed, failedIds: failed, passed: failed.length === 0 };
})(); } catch(e){ console.error(e); }
