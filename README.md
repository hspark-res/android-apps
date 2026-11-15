# Android 앱 공개 배포

APK·업데이트 카탈로그·정적 사이트만 공개한다. 앱 소스는 별도 비공개 저장소에서 관리한다.

`usage.html`은 이용 안내 전문이다. 다운로드 전 `usage.js`가 안내 판본에 대한 동의를 확인하며, 이 브라우저의 localStorage에 판본만 저장한다. APK 버전과 분리되어 같은 안내에는 다시 묻지 않는다. 사이트 데이터 삭제나 저장소 차단 시 다시 표시될 수 있다. 서버로 동의 기록을 보내지 않는다. 파일 관리자·Vault Sync의 데이터 주의사항 및 법령상 제한할 수 없는 책임의 예외를 포함한다.

## 브라우저 검사

`npm ci` 후 정적 서버를 `python3 -m http.server 8765`로 실행한다. 다른 터미널에서 `npm run test:usage`를 실행하면 별도 Chrome 테스트 프로필로 거절·최초 동의·다른 APK 다운로드·새로 고침·브라우저 재시작·안내 보기·360x640 버튼 표시를 검사한다. 테스트는 크기가 작은 실제 계산기·갤러리 APK를 다운로드하고 완료를 기다린 뒤 테스트 파일을 삭제한다. 이번에 배포한 APK 3개의 해시는 별도로 검증한다. `CHROME_PATH`, `USAGE_TEST_PROFILE`로 Chrome 경로와 테스트 프로필 경로를 지정할 수 있다. 프로필은 파일 잠금을 지원하는 로컬 파일시스템에 둔다. 공개 배포본은 `npm run test:usage -- https://hspark-res.github.io/android-apps/`로 검사한다.

[공개 사이트 브라우저 검증](https://github.com/hspark-res/vault-sync-e2e-20261107-01/actions/runs/43665893237) · [결과](tests/evidence/usage-browser-live.json) · [모바일 안내](tests/evidence/mobile-consent.png). 취소·최초 동의·다른 APK 다운로드·재접속·브라우저 프로세스 재시작·안내 링크와 모바일 버튼 표시를 통과했다. Android 앱 3개의 동의 유지 검사는 비공개 앱 저장소의 `docs/usage-notice`에 보관한다.


## 꾹담아·별빛모아 배포

내 앱 0.1.6 이상은 catalog-v4.json에서 꾹담아와 별빛모아를 설치·업데이트한다. 이전 v1/v2/v3 목록에는 내 앱 자체의 새 버전만 알리고 신규 패키지는 추가하지 않는다. 두 앱의 소스 저장소는 비공개이며, 꾹담아에 포함한 외부 7-Zip 엔진의 수정 대응 소스·빌드 스크립트·라이선스는 sources/에 별도 제공한다. 꾹담아는 Android 10 이상 ARM64/x86_64, 별빛모아는 Android 5.0 이상 카메라 기기가 대상이다. 내 앱 자체는 Android 10 이상이다.
