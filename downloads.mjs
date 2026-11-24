const API = 'https://api.github.com/repos/hspark-res/android-apps/releases';
const assetName = url => decodeURIComponent(new URL(url).pathname.split('/').pop());
export function summarizeDownloads(releases, apps) {
  const rows = apps.map(app => {
    const filename = assetName(app.url);
    const match = /^(.+?)-(\d[^/]*)\.apk$/.exec(filename);
    if (!match) throw new Error('배포 목록의 APK 이름을 확인하세요.');
    return {name: app.name, package: app.package, version: app.version, filename,
      prefix: match[1] + '-', total: 0, current: 0, versions: new Map()};
  });
  for (const release of releases) {
    for (const asset of release.assets || []) {
      if (!asset.name?.endsWith('.apk')) continue;
      const row = rows.find(row => asset.name.startsWith(row.prefix));
      if (!row) continue;
      if (!Number.isSafeInteger(asset.download_count) || asset.download_count < 0)
        throw new Error('GitHub 다운로드 횟수 응답을 확인하세요.');
      const count = asset.download_count;
      const version = asset.name === row.filename ? row.version : asset.name.slice(row.prefix.length, -4);
      row.total += count;
      if (!Number.isSafeInteger(row.total)) throw new Error('집계 범위를 확인하세요.');
      if (asset.name === row.filename) row.current += count;
      row.versions.set(version, (row.versions.get(version) || 0) + count);
    }
  }
  return rows;
}
export async function fetchReleases(fetcher = fetch) {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const response = await fetcher(`${API}?per_page=100&page=${page}`, {
      credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
      headers: {Accept: 'application/vnd.github+json'}
    });
    if (!response.ok) throw new Error(`GitHub 응답 ${response.status}`);
    const releases = await response.json();
    if (!Array.isArray(releases)) throw new Error('GitHub 응답 형식을 확인하세요.');
    all.push(...releases);
    if (!(response.headers.get('link') || '').includes('rel="next"')) return all;
  }
  throw new Error('배포 항목이 많아 전체 집계를 완료하지 못했습니다.');
}
if (typeof document !== 'undefined') {
  const body = document.getElementById('counts-body');
  const versions = document.getElementById('counts-versions');
  const status = document.getElementById('counts-status');
  const button = document.getElementById('counts-refresh');
  const number = n => n.toLocaleString('ko-KR') + '회';
  let successfulAt = '';
  function render(rows) {
    body.replaceChildren(); versions.replaceChildren();
    for (const row of rows) {
      const tr = document.createElement('tr');
      for (const text of [row.name, number(row.total), `${row.version} · ${number(row.current)}`]) {
        const td = document.createElement('td'); td.textContent = text; tr.append(td);
      }
      body.append(tr);
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.textContent = row.name + ' · 버전별 횟수'; details.append(summary);
      const list = document.createElement('ul');
      for (const [version, count] of row.versions) {
        const item = document.createElement('li'); item.textContent = `${version}: ${number(count)}`; list.append(item);
      }
      if (!row.versions.size) { const item = document.createElement('li'); item.textContent = '집계 대상 APK가 아직 없습니다.'; list.append(item); }
      details.append(list); versions.append(details);
    }
  }
  async function refresh() {
    button.disabled = true; status.textContent = '횟수를 불러오는 중입니다.';
    try {
      const response = await fetch('./catalog-v6.json', {credentials: 'omit', cache: 'no-store'});
      if (!response.ok) throw new Error('배포 목록을 읽지 못했습니다.');
      const catalog = await response.json();
      const rows = summarizeDownloads(await fetchReleases(), catalog.apps);
      render(rows); successfulAt = new Date().toLocaleString('ko-KR');
      status.textContent = `조회: ${successfulAt} · GitHub 집계 기준`;
    } catch (_) {
      status.textContent = '횟수를 불러오지 못했습니다. GitHub 요청 제한이나 연결 상태를 확인하고 잠시 후 다시 시도하세요.'
        + (successfulAt ? ` 현재 표시는 ${successfulAt} 조회 결과입니다.` : ' 아직 조회된 횟수가 없어 숫자를 표시하지 않습니다.');
    } finally { button.disabled = false; }
  }
  button.addEventListener('click', refresh); refresh();
}
