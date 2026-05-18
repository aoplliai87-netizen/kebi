# Kebi Local Run Checklist

## Scope
- Project root: `C:\kebi`
- Reserved port: `3100` (Next.js dev/start)
- Env file: `C:\kebi\.env.local` only

## Start
```powershell
cd C:\kebi
npm run dev
```

## Verify
- Frontend: `http://localhost:3100`

## Stop
- Press `Ctrl + C` in the terminal running `npm run dev`.

## Isolation Rules
- Never use port `3000` here (reserved by `hub`).
- Keep external-client keys only in `C:\kebi\.env.local`.
- Do not copy `hub` DB/env settings into `kebi`.
