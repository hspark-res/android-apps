import assert from 'node:assert/strict';
import {summarizeDownloads, fetchReleases} from '../downloads.mjs';
const apps=[{package:'p',name:'앱',version:'1.2-private',url:'https://github.com/a/b/releases/download/r/app-1.2.apk'}];
const rows=summarizeDownloads([{assets:[{name:'app-1.2.apk',download_count:3},{name:'app-1.1.apk',download_count:7},{name:'other-1.0.apk',download_count:99},{name:'source.zip',download_count:300}]}],apps);
assert.equal(rows[0].total,10);assert.equal(rows[0].current,3);assert.equal(rows[0].versions.get('1.2-private'),3);assert.equal(rows[0].versions.get('1.1'),7);
assert.throws(()=>summarizeDownloads([{assets:[{name:'app-1.2.apk',download_count:-1}]}],apps));
let calls=0;
const pages=await fetchReleases(async(url,options)=>{
 calls++;assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer');assert(!('body' in options));assert(!('Authorization' in options.headers));assert(url.endsWith('page='+calls));
 return {ok:true,headers:new Headers(calls===1?{link:'<next>; rel="next"'}:{}),json:async()=>[{assets:[{name:'app-1.'+calls+'.apk',download_count:calls}]}]};
});assert.equal(calls,2);assert.equal(summarizeDownloads(pages,apps)[0].total,3);
await assert.rejects(()=>fetchReleases(async()=>({ok:false,status:403})),/403/);
await assert.rejects(()=>fetchReleases(async()=>({ok:true,headers:new Headers(),json:async()=>({})})),/형식/);
console.log('다운로드 합산·버전 구분·페이지 처리·오류·식별 정보 없는 요청 검사 통과');
