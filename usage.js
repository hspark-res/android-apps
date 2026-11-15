// Store consent for this notice revision, independently of APK versions.
(() => {
  const revision = 'usage-2026-11-15-v1', key = 'android-apps-usage-consent';
  const dialog = document.getElementById('usage-dialog');
  let agreed = false, pending = null;
  try { agreed = localStorage.getItem(key) === revision; } catch (_) {}
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || !new URL(link.href).pathname.endsWith('.apk') || agreed) return;
    event.preventDefault();
    pending = link;
    if (!dialog.open) dialog.showModal();
  });
  document.getElementById('usage-cancel').addEventListener('click', () => { pending = null; dialog.close(); });
  dialog.addEventListener('cancel', () => { pending = null; });
  document.getElementById('usage-accept').addEventListener('click', () => {
    agreed = true;
    try { localStorage.setItem(key, revision); } catch (_) {
      document.getElementById('usage-status').textContent = '저장 공간을 사용할 수 없어 이번 페이지에서만 동의를 기억합니다.';
    }
    const link = pending; pending = null; dialog.close();
    if (link) link.click();
  });
})();
