// No JS required for this HTML challenge

// Auto-run test
try { (function(){
const passed = []; const failed = [];
try {
  if (document.querySelectorAll('ol li').length === 2) { passed.push("a01"); }
  else { failed.push("a01"); }
} catch (e) { failed.push("a01"); }

try {
  if (Array.from(document.querySelectorAll('ol li')).map(li=>li.textContent.trim()).join(',') === 'First,Second') { passed.push("a02"); }
  else { failed.push("a02"); }
} catch (e) { failed.push("a02"); }

return { passedIds: passed, failedIds: failed, passed: failed.length === 0 };
})(); } catch(e){ console.error(e); }
