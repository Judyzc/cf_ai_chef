import { handleMessage } from "./workflow";

export default {
  async fetch(req, env) {
    if (req.method === "POST") {
      const { userId = "demo", input } = await req.json();
      const reply = await handleMessage(env, userId, input);
      return Response.json({ output: reply });
    }

    return new Response("Cloudflare AI App is running. HELLO WORLD !!! :D ");
  }
}
