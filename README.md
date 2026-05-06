This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin (운영자) 사용법

관리자 페이지는 세션 로그인 방식으로 보호됩니다.
`/admin` 접속 시 로그인 폼이 먼저 표시되고, 로그인 성공 시 대시보드에 접근할 수 있습니다.

기본 로그인 정보(요청사항 반영):

- 아이디: `admin`
- 비밀번호: `#kebi7621`

주요 기능:

- `/admin`: 예약/문의/리뷰 집계 대시보드
- `/admin/reservations`: 예약 내역 조회
- `/admin/inquiries`: 문의 내역 조회
- `/admin/content`: 홈 About Me 문구, 갤러리 이미지 URL 관리
- `/api/admin/export`: 예약+문의 CSV 다운로드 (로그인 세션 필요)

## Supabase 전환 (운영 안정화)

앱은 아래 환경 변수가 있으면 Supabase를 우선 사용하고, 없으면 기존 `data/*.json` 파일 저장으로 동작합니다.

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SESSION_SECRET=랜덤하고_긴_문자열
```

### 1) Supabase 테이블 생성

Supabase SQL Editor에서 `supabase/schema.sql` 파일 내용을 실행합니다.

### 2) 기존 로컬 데이터 1회 마이그레이션

서버 실행 후, 관리자 로그인(세션) 상태에서 POST 호출:

```bash
POST /api/admin/migrate-local-to-supabase
```

성공 시 예약/문의/리뷰/사이트설정이 Supabase로 업서트됩니다.

### 3) Vercel 환경변수 설정

Vercel 프로젝트 > Settings > Environment Variables 에서 아래 3개를 추가합니다.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SESSION_SECRET`

권장: `Production`, `Preview`, `Development` 모두 설정 후 재배포합니다.

관리자 로그인 비밀번호는 현재 요구사항에 따라 코드에 고정되어 있으므로,
운영 시에는 추후 반드시 환경변수 기반으로 변경하는 것을 권장합니다.
