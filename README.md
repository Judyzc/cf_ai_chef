# cf_ai_chef

Minimal AI app using Cloudflare:
- **LLM**: Workers AI (Llama 3.3)
- **Workflow**: Worker + helper workflow
- **Input**: Simple HTML chat (Pages)
- **Memory**: Durable Object

### Run locally
Done with Docker so I don't have to install things locally. Run this command to run the app with a volume so all changes are shown instantly.
```bash
docker run -it --rm \
  -p 8787:8787 \
  -v "$(pwd)":/app \
  -v "$(pwd)/.wrangler/state":/app/.wrangler/state \
  cloudflare-ai-app
```

### To deploy (not done)
```
npx wrangler publish
```


