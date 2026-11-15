# Android 앱 공개 배포

APK·업데이트 카탈로그·정적 사이트만 공개한다. 앱 소스는 별도 비공개 저장소에서 관리한다.

`usage.html`은 이용 안내 전문이다. 다운로드 전 `usage.js`가 안내 판본에 대한 동의를 확인하며, 이 브라우저의 localStorage에 판본만 저장한다. APK 버전과 분리되어 같은 안내에는 다시 묻지 않는다. 사이트 데이터 삭제나 저장소 차단 시 다시 표시될 수 있다. 서버로 동의 기록을 보내지 않는다. 파일 관리자·Vault Sync의 데이터 주의사항 및 법령상 제한할 수 없는 책임의 예외를 포함한다.

## 브라우저 검사

`npm ci` 후 정적 서버를 `python3 -m http.server 8765`로 실행한다. 다른 터미널에서 `npm run test:usage`를 실행하면 별도 Chrome 테스트 프로필로 거절·최초 동의·다른 APK 다운로드·새로 고침·브라우저 재시작·안내 보기·360x640 버튼 표시를 검사한다. 테스트는 실제 APK 대신 작은 다운로드 응답을 사용한다. 배포 APK 해시는 별도로 검증한다. `CHROME_PATH`, `USAGE_TEST_PROFILE`로 Chrome 경로와 테스트 프로필 경로를 지정할 수 있다. 프로필은 파일 잠금을 지원하는 로컬 파일시스템에 둔다. 공개 배포본은 `npm run test:usage -- https://hspark-res.github.io/android-apps/`로 검사한다.
