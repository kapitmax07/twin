# Twin — frontend

A Next.js port of the Digital Twin chatbot, built to deploy natively on Vercel.

The original Gradio app (in `backend/`) runs as a persistent stateful
server and is not compatible with Vercel's serverless model. This app
reimplements the same chat + tool-calling behavior as a standard Next.js app:
a React chat UI (`app/page.tsx`) backed by a serverless API route
(`app/api/chat/route.ts`) that calls the OpenAI API.

## Local development

```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in OPENAI_API_KEY at minimum
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable          | Required | Purpose                                                        |
| ------------------ | -------- | ---------------------------------------------------------------- |
| `OPENAI_API_KEY`     | yes      | OpenAI API key used by the chat route                          |
| `OPENAI_MODEL`       | no       | Model id, defaults to `gpt-4o-mini`                             |
| `TELEGRAM_BOT_TOKEN` | no       | Telegram bot token (from @BotFather), for contact/unknown-question notifications |
| `TELEGRAM_CHAT_ID`   | no       | Telegram chat/user id the bot should message                   |

If the Telegram variables are unset, notifications are logged to the server
console instead of failing the request.

## Updating the twin's profile data

`data/summary.txt` and `data/linkedin.txt` are the plain-text sources used to
build the system prompt (see `lib/systemPrompt.ts`). They're plain text
copies — no PDF parsing happens at request time, which keeps cold starts fast
and avoids bundling a PDF parser into the serverless function. To refresh
them from an updated LinkedIn export, re-extract the PDF text and overwrite
`data/linkedin.txt`.

## Deploying to Vercel

**1. Push this repo to GitHub** (Vercel deploys from a git provider; the
repo's current `origin` remote points at Hugging Face Spaces, so add GitHub
as a second remote rather than replacing it):

```bash
git remote add github https://github.com/<you>/twin.git
git push github main
```

**2. Import the project in Vercel**

- Go to https://vercel.com/new and import the GitHub repo
- Set **Root Directory** to `frontend` (this is a monorepo — the Python app
  lives in `backend/` for Hugging Face Spaces, this Next.js app lives in
  `frontend/`)
- Framework preset: Next.js (auto-detected)
- Add environment variables from the table above under
  Project Settings → Environment Variables
- Deploy

**3. Or deploy from the CLI without GitHub:**

```bash
cd frontend
npm install -g vercel   # if you don't have it
vercel                  # first deploy, follow prompts, set root dir when asked
vercel --prod           # subsequent production deploys
```

Either way, set the env vars in the Vercel dashboard (Settings →
Environment Variables) before the first real request — the build succeeds
without `OPENAI_API_KEY`, but chat requests will fail at runtime without it.
