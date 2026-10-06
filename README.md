# 허브스튜디오3 — Vercel 배포판

이미지 허브의 사진을 먼저 선택해 전자책, Instagram·Facebook·X·LinkedIn 피드, 전문 기사를 제작하고 검수·발행하는 작업실입니다. 공개 첫 화면은 로그인 없이 읽는 웹진이고, `/studio`에서 로그인 후 작업합니다.

## 이번 추가 기능

- 편집 에이전트 한국어 음성 입력: 마이크 → 인식한 텍스트 확인 → 보내기. 즉시 명령을 실행하지 않아 인식 오류를 수정할 수 있습니다.
- 모바일에서 사진 선택·원고 생성·확인·발행. 에이전트 결과에 **지금 발행**, **공개 글 보기**를 표시하고 터치 영역과 하단 안전 영역을 조정했습니다.
- 사진 1~6장과 기사 주제를 저장하면 한국 시간 매일 오전 9시 기준 자동 제작·공개 발행. 계정당 활성 예약은 최대 3개. 활성화·일시 중지·재개, 최근 결과·실패 이유·공개 글 링크를 확인할 수 있습니다.
- 매일 다른 기사 관점과 기존 제목을 참고하도록 요청합니다. 의미가 비슷한 기사까지 완전히 제거하는 기능은 아니며, 실시간 취재·검색을 수행하지 않으므로 최신 뉴스 자동 취재로 사용하지 않습니다.
- 브라우저를 닫아도 Vercel Cron이 실행합니다. 예약, 원고, 날짜별 실행 기록과 에이전트 결과는 기존 Firestore에 저장합니다.
- 날짜별 고정 문서 ID와 동시 실행 잠금으로 중복 발행을 방지합니다. 발행 실패 시 저장된 초안은 보존하고 재시도합니다.

## 로컬 실행

Node.js 22 이상. 압축을 푼 폴더에서:

```bash
npm ci
```

`.env.example`을 `.env.local`로 복사해 실제 환경변수를 입력한 후:

```bash
npm run dev
```

검증:

```bash
npm test
npm run typecheck
npm run build
```

Next.js 표준 Node 런타임입니다. Vinext/Vite/Cloudflare Workers 설정은 사용하지 않습니다.

## Vercel 배포 순서

1. 새 GitHub 저장소를 만들고 압축을 푼 **폴더 안의 파일**을 올립니다. 저장소 최상단에 `package.json`, `package-lock.json`, `app/`, `lib/`, `public/`, `vercel.json`이 있어야 합니다. ZIP 파일 자체를 올리지 마세요. `node_modules`, `.next`, 실제 `.env.local`, 서비스 계정 JSON은 업로드하지 않습니다.
2. Vercel → Add New → Project → GitHub 저장소 선택. Framework **Next.js**, Node **22.x**, Install `npm ci`, Build `npm run build`. Output Directory는 기본값. 파일이 하위 폴더에 있다면 Root Directory를 그 폴더로 지정합니다.
3. Settings → Environment Variables에 아래 표의 값을 **Production**에 입력합니다. 테스트 배포도 사용하면 Preview에도 동일하게 입력합니다. Cron 자동 호출은 Production 배포에서 동작합니다.
4. 배포 후 `SITE_URL`은 선택 사항이며 기본 대표 주소는 `https://hubstudioai.co.kr`입니다. 다른 정식 도메인을 사용할 때만 변경하고 재배포합니다. Firebase Authentication → Settings → Authorized domains에 **프로젝트.vercel.app**과 사용할 도메인을 추가합니다. 기존 로그인 제공자 설정과 Firestore 규칙은 유지합니다.
5. `/studio`에서 기존 Firebase 계정으로 로그인 → 사진 선택 → 편집 에이전트에서 예약 설정 → 주제 확인 → 예약 활성화 → 예약 저장.
6. Vercel의 Cron Jobs 화면과 Functions 로그에서 실행 결과를 확인합니다. 에이전트 예약 카드와 내 프로젝트에서도 초안·완료 상태를 볼 수 있습니다. 설정만 하고 예약을 저장하지 않으면 기사는 자동 발행되지 않습니다.

## 환경변수

| 이름 | 값 / 용도 |
|---|---|
| `CONTENT_FIREBASE_PROJECT_ID` | `studio-9240700230-1dd9a` |
| `CONTENT_FIREBASE_API_KEY` | `.env.example`의 기존 웹 API 키 |
| `IMAGE_HUB_PROJECT_ID` | `studio-9240700230-1dd9a` |
| `IMAGE_HUB_API_KEY` | `.env.example`의 기존 웹 API 키 |
| `GENERATION_GATEWAY_URL` | `https://hubstudio-six.vercel.app/api/generate-blog` — 일반 수동 제작용 기존 엔진 대체 경로 |
| `GEMINI_API_KEY` | 본인의 Gemini API 키. **매일 자동 제작에는 필수**. 로그인 토큰이 없는 서버 작업이므로 기존 엔진 대체 경로에 의존하지 않습니다. |
| `GEMINI_MODEL` | `gemini-2.5-flash` 기본값. 해당 키에서 이용 가능한 모델로 변경 가능 |
| `FIREBASE_PROJECT_ID` | `studio-9240700230-1dd9a` — 서버 계정 프로젝트 확인 |
| `FIREBASE_CLIENT_EMAIL` | 아래 서비스 계정 JSON의 `client_email` |
| `FIREBASE_PRIVATE_KEY` | 같은 JSON의 `private_key` 전체 값 |
| `CRON_SECRET` | 충분히 긴 무작위 비밀 값. Vercel이 Cron 요청의 Bearer 인증에 사용 |
| `SITE_URL` | 실제 Production HTTPS 주소. canonical·RSS·사이트맵·메타데이터에 반영 |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console 확인 코드, 선택 |
| `NAVER_SITE_VERIFICATION` | 네이버 서치어드바이저 확인 코드, 선택 |

Firebase 웹 API 키는 서버 관리 권한을 주는 서비스 계정 키와 다릅니다. 기존 웹 연결값만으로는 사용자 브라우저가 없는 자동 발행을 실행할 수 없습니다.

### Firebase 서버 인증 값 가져오기

1. 기존 Firebase 프로젝트 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성. 생성한 JSON에서 `client_email`, `private_key`, `project_id`를 확인합니다.
2. 세 값을 위의 서버 환경변수에 입력합니다. `private_key`는 `-----BEGIN PRIVATE KEY-----`부터 `-----END PRIVATE KEY-----`까지 전체를 입력합니다. 실제 줄바꿈과 문자열 `\n` 모두 지원합니다. JSON의 바깥따옴표는 넣지 않습니다.
3. 해당 서비스 계정에 Google Cloud IAM의 Firestore 읽기/쓰기 권한(예: **Cloud Datastore User / roles/datastore.user**)이 있어야 합니다. 관리자 계정의 지나치게 넓은 권한을 새로 부여할 필요는 없습니다.
4. Gemini 키와 서비스 계정 비밀 키에는 `NEXT_PUBLIC_`를 붙이지 않습니다. 환경변수 변경 후 재배포합니다.
5. Firestore REST의 서비스 계정 OAuth 토큰은 IAM 권한을 따릅니다. 사용자 브라우저 조회·예약 저장은 기존 Firebase 로그인과 Firestore 규칙을 계속 따릅니다. 기존 `contentProjects`의 소유자 읽기/쓰기 및 `publishedContents`의 공개 읽기 정책이 필요합니다. DB 조회 실패 시 로그의 권한/인덱스 오류를 확인하고 안내되는 인덱스를 추가합니다. 규칙을 전체 공개로 바꾸지 마세요.

CRON_SECRET 예시 생성 명령:

```bash
openssl rand -hex 32
```

### 9시 실행과 요금제

기본 `vercel.json`은 하루 한 번, UTC `0 0 * * *` = 한국 시간 오전 9시에 `/api/cron/publish`를 호출합니다. 준비된 초안이 없으면 먼저 생성 후 발행하므로 생성 시간만큼 늦게 공개됩니다.

**Vercel Hobby**는 하루 한 번 Cron 실행과 시간 단위 정밀도를 제공하며, 예정 시각으로부터 최대 59분 늦게 호출될 수 있습니다. 따라서 정확한 오전 9시 공개를 보장하지 않습니다. 실패한 작업의 다음 날 호출은 새로운 날짜의 기사이며, 지난 날짜 실패를 자동 소급 발행하지 않습니다.

**Pro에서 9시 기준 운영**하려면 `vercel.pro.json`의 내용을 `vercel.json`으로 교체하고 재배포합니다. 오전 8시 40분에 원고 준비, 오전 9시~10시 55분에 5분 간격 발행/재시도입니다. 발행 완료한 날짜의 작업은 다시 발행하지 않습니다. 실행 지연이나 모델/DB 장애로 9시 정각 공개는 보장하지 않습니다.

현재 서버 한 호출의 최대 실행 시간은 300초입니다. 잔여 시간 부족 시 나머지 예약은 다음 호출로 넘깁니다. Pro 설정은 반복 호출로 처리하지만 Hobby는 하루 호출이 한 번이므로 여러 사용자·다수 예약을 모두 처리할 수 없는 상황이 생길 수 있습니다. 이 버전은 소규모 운영용이며 사용자 증가 시 별도 작업 큐·워커를 추가해야 합니다.

Cron은 비밀 키가 맞는 요청만 실행합니다. 브라우저에서 Cron URL을 그냥 열면 401이 나오는 것이 정상입니다. 직접 테스트할 때는 Vercel Cron의 실행 기능/로그를 사용하며, 실제 실행은 공개 콘텐츠를 발행할 수 있습니다.

### 사용 예

이미지 허브에서 패션 사진을 선택하고:

> 패션 룩북 기사를 매일 오전 9시 자동 발행해줘.

예약 설정이 열리면 사진·주제를 확인한 뒤 **예약 저장**을 누릅니다. 이후 매일 저장된 사진을 사용하며, 매일 새 사진을 자동 선정하는 기능은 없습니다. 현재 예약은 오전 9시 고정이며 다른 시각은 지원하지 않습니다. 발행 대상은 **허브3 공개 웹진**입니다. 네이버·인스타그램 등의 계정에 자동 게시하는 기능은 포함되지 않습니다.

### 음성 입력

지원 브라우저의 Web Speech API를 사용합니다. HTTPS와 마이크 권한이 필요하고 브라우저/기기에 따라 지원 여부가 다릅니다. 일부 브라우저는 음성을 외부 인식 서비스로 보냅니다. 지원되지 않으면 휴대폰 키보드의 받아쓰기로 같은 명령을 입력할 수 있습니다. 실제 모바일 마이크 동작은 배포 주소에서 기기별로 테스트하세요.

## 개발 구조

- `app/studio/page.tsx`: 로그인·갤러리·제작·편집 에이전트·모바일 발행
- `app/VoiceInput.tsx`: 음성 인식과 텍스트 입력
- `app/SchedulePanel.tsx`: 예약 등록·일시 중지·실행 결과
- `lib/schedules.ts`: 예약 저장·날짜별 잠금·원고 제작·발행·결과 보고
- `lib/service-auth.ts`: Cron 인증과 서비스 계정 OAuth 토큰
- `app/api/cron/[phase]/route.ts`: Vercel 예약 호출
- `app/api/hub/[...path]/route.ts`: 사용자 소유권 확인·콘텐츠 및 대화 저장
- `lib/publication.ts` 및 공개 페이지: SSR·canonical·구조화 데이터·RSS·사이트맵

데이터는 기존 `contentProjects`에서 `hub3Project`, `hub3Message`, `hub3Job`, `hub3Plan`, `hub3Schedule`, `hub3DailyRun`으로 구분합니다. 공개 발행은 `publishedContents`입니다. 새로 DB를 만들지 않습니다.

## 검증 범위

표준 Next.js production 빌드와 TypeScript 확인 완료. 테스트는 이미지 기획, 전자책 분할 생성/복구, 발행 권한, 원고 수정 충돌, 공개 HTML/SEO, 예약 중복 방지·한국 날짜·실패 복구·중지·결과 저장을 확인합니다. 테스트는 가짜 DB/모델을 사용하므로 실제 계정 키, Vercel Cron 실행, 모바일 마이크는 배포 후 확인해야 합니다.

공식 참고:
- https://vercel.com/docs/cron-jobs/usage-and-pricing
- https://vercel.com/docs/cron-jobs/manage-cron-jobs
- https://firebase.google.com/docs/firestore/use-rest-api
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition

## 구글·네이버 검색 최적화

공개 목록과 상세 본문·내부 링크는 서버 HTML에 포함됩니다. 글별 canonical과 sitemap/RSS가 동일한 대표 도메인을 사용합니다. `SITE_URL`이 없으면 `https://hubstudioai.co.kr`을 사용합니다. 기존 Vercel·ChatGPT 배포 주소나 예제 주소가 설정되어 있어도 정식 도메인을 사용합니다. 다른 정식 도메인으로 이전할 때는 `SITE_URL`을 변경하고 재배포하세요. www 및 기존 hubstudio3.vercel.app 요청은 같은 경로의 대표 주소로 308 리디렉션합니다.

목록 2페이지 이후는 자기 페이지 주소를 canonical로 사용합니다. 분야 필터 화면은 중복 색인을 줄이기 위해 noindex/follow 처리하고, 개별 공개 콘텐츠는 색인을 허용합니다. 존재하지 않는 글이나 목록 페이지는 404이며, 일시적인 DB 오류를 삭제된 글로 처리하지 않습니다. 기사·전자책·SNS에 맞는 구조화 데이터와 공유 이미지 메타데이터를 제공합니다.

Google Search Console과 네이버 서치어드바이저에서 실제 도메인의 소유권을 확인하세요. 발급받은 확인 코드만 `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION`에 입력하고 재배포합니다. 사이트맵은 `/sitemap.xml`, RSS는 `/rss.xml`을 제출합니다. 이것은 수집·색인을 돕는 기술적 설정이며 검색 등록이나 순위 상승을 보장하지 않습니다.
