# Android 앱 공개 배포

APK·업데이트 카탈로그·정적 사이트만 공개한다. 앱 소스는 별도 비공개 저장소에서 관리한다.

`usage.html`은 이용 안내 전문이다. 다운로드 전 `usage.js`가 안내 판본에 대한 동의를 확인하며, 이 브라우저의 localStorage에 판본만 저장한다. APK 버전과 분리되어 같은 안내에는 다시 묻지 않는다. 사이트 데이터 삭제나 저장소 차단 시 다시 표시될 수 있다. 서버로 동의 기록을 보내지 않는다. 파일 관리자·Vault Sync의 데이터 주의사항 및 개발자 개인 사용 목적·사용자 책임·비동의 시 설치 및 사용 금지 조건을 포함한다.

## 브라우저 검사

`npm ci` 후 정적 서버를 `python3 -m http.server 8765`로 실행한다. 다른 터미널에서 `npm run test:usage`를 실행하면 별도 Chrome 테스트 프로필로 거절·최초 동의·다른 APK 다운로드·새로 고침·브라우저 재시작·안내 보기·360x640 버튼 표시를 검사한다. 테스트는 크기가 작은 실제 계산기·갤러리 APK를 다운로드하고 완료를 기다린 뒤 테스트 파일을 삭제한다. 이번에 배포한 APK 3개의 해시는 별도로 검증한다. `CHROME_PATH`, `USAGE_TEST_PROFILE`로 Chrome 경로와 테스트 프로필 경로를 지정할 수 있다. 프로필은 파일 잠금을 지원하는 로컬 파일시스템에 둔다. 공개 배포본은 `npm run test:usage -- https://hspark-res.github.io/android-apps/`로 검사한다.

[공개 사이트 브라우저 검증](https://github.com/hspark-res/vault-sync-e2e-20261107-01/actions/runs/43665893237) · [결과](tests/evidence/usage-browser-live.json) · [모바일 안내](tests/evidence/mobile-consent.png). 취소·최초 동의·다른 APK 다운로드·재접속·브라우저 프로세스 재시작·안내 링크와 모바일 버튼 표시를 통과했다. Android 앱 3개의 동의 유지 검사는 비공개 앱 저장소의 `docs/usage-notice`에 보관한다.


## 꾹담아·별빛모아 배포

내 앱 0.1.6 이상은 catalog-v4.json에서 꾹담아와 별빛모아를 설치·업데이트한다. 이전 v1/v2/v3 목록에는 내 앱 자체의 새 버전만 알리고 신규 패키지는 추가하지 않는다. 두 앱의 소스 저장소는 비공개이며, 꾹담아에 포함한 외부 7-Zip 엔진의 수정 대응 소스·빌드 스크립트·라이선스는 sources/에 별도 제공한다. 꾹담아는 Android 10 이상 ARM64/x86_64, 별빛모아는 Android 5.0 이상 카메라 기기가 대상이다. 내 앱 자체는 Android 10 이상이다.

## 개인정보 추적 없는 다운로드 횟수

`downloads.html`은 GitHub Releases의 공개 `download_count`를 읽어 앱별 전체 버전 합계, 현재 버전, 버전별 횟수를 표시한다. 브라우저가 공개 API에 식별자·인증·쿠키 없이 GET으로 조회하며 서버로 방문 이벤트나 사용자 정보를 보내는 별도 추적 코드는 없다. 통계 화면은 localStorage나 쿠키를 만들지 않는다. GitHub 자체의 서비스 운영 기록은 별개다.

집계는 Releases 주소를 사용하기 시작한 이후의 GitHub 제공값이다. 사용자 수·설치 수·완료된 설치 수를 뜻하지 않으며 재다운로드·업데이트·자동 검증도 포함한다. 이전 Pages URL, 구형 클라이언트의 Pages 다운로드, 내장 APK 설치는 포함하지 않는다. API 반영 지연·요청 제한이 있을 수 있다. 실패 시 0으로 가장하지 않으며 기존 조회값을 남기거나 미조회 상태를 표시한다.

사이트 다운로드 링크와 `catalog-v5.json`은 Releases 자산 URL을 사용한다. 내 앱 0.1.8부터 최대 5회 HTTPS 리디렉션을 허용하며 매 단계 HTTP와 사용자 정보가 든 URL을 거절한다. APK 패키지·버전·SHA-256·서명 검사는 유지한다. 구형 앱을 깨뜨리지 않도록 `catalog.json`~`catalog-v4.json`은 기존 Pages APK 주소를 유지하고, 내 앱 자체 업데이트 0.1.8도 Pages 주소로 제공한다. 0.1.8은 기존 공식 목록 주소를 v5로 자동 전환한다. 기존 APK 파일은 호환성을 위해 삭제하지 않는다.

새 앱 버전 배포 시 공개 Releases에 고유한 APK 파일명으로 업로드하고 v5 및 사이트 링크를 그 자산의 `browser_download_url`로 바꾼다. 구형 목록도 지원 패키지 범위를 유지해 버전·해시와 Pages 호환 주소를 갱신한다. 앱 자체를 추적 SDK와 연결하지 않는다. 같은 자산을 삭제·재업로드하거나 `--clobber`로 덮어쓰면 GitHub 자산 ID와 누적값이 바뀌므로 사용하지 않는다. 공개 API 페이지를 모두 읽고 APK 이름 접두사로 앱을 구분하므로 새 버전은 별도 통계 데이터 수정 없이 합산한다. 집계할 앱의 패키지/현재 파일명이 바뀔 때는 v5와 테스트를 함께 확인한다.

`npm run test:downloads`로 합산·페이지 처리·오류·익명 요청 옵션을 검사하고, 정적 서버 실행 후 `npm run test:downloads-browser`로 실 API·모바일 배치·조회 실패 처리·저장소/쿠키 미생성·외부 요청 범위를 확인한다. 다운로드 검증 자체도 Releases 횟수에 반영될 수 있다.

[통계·브라우저 실행](https://github.com/hspark-res/vault-sync-e2e-20261107-01/actions/runs/43713531493)에서 실 API 카운터 조회, 한글 글꼴을 포함한 360px/1280px 배치, 쿠키/저장소 미생성, 요청 범위, 인위적 API 오류 처리, 실제 Releases APK 다운로드와 동의 유지를 검증했다. [결과](tests/evidence/download-counts/browser.json) · [모바일 화면](tests/evidence/download-counts/mobile.png). 공개 자산 10개의 서버 SHA-256·바이트 크기가 목록과 일치하고, 검증 다운로드 후 계산기 공개 카운터가 0에서 1 이상으로 증가한 것을 확인했다. [APK 및 카운터 검증](tests/evidence/download-counts/release-validation.json). [Android 설치 검증](https://github.com/hspark-res/vault-sync-e2e-20261107-01/actions/runs/43713082776)은 비공개 내 앱 저장소에 별도로 보관한다.

## 딱잡아 배포

내 앱 0.1.9의 기본 목록은 `catalog-v6.json`입니다. 딱잡아는 v6에 추가하고, 이전 목록의 지원 패키지는 유지합니다. 구형 내 앱의 자체 업데이트는 v1–v4에는 Pages APK, v5에는 Release APK를 사용합니다. 웹 다운로드 통계는 v6을 읽습니다.
