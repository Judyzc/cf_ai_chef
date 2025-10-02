// src/index.ts

const PROMPT_TEMPLATE = `
SYSTEM: You are a JSON-only generator. You must output EXACTLY one JSON object and NOTHING ELSE — no explanation, no backticks, no commentary. The JSON must follow the schema below exactly.

SCHEMA:
{
  "palette": ["#rrggbb", ...],
  "style": "soft-blobs" | "sharp-geometry" | "lines" | "noisy" | "minimal",
  "seed": <integer>,
  "density": <integer 1-50>,
  "shapes": [ ... ]
}

IMPORTANT RULES:
1. Output only valid JSON that conforms to SCHEMA. Do not output any extra keys or text.
2. Colors must be hex strings of exactly 7 chars: leading '#' + 6 hex digits (lowercase).
3. Numbers must be integers unless explicitly floats (opacity).
4. Use canvas size 800x600 coordinate system (0..800 x, 0..600 y).
5. If you cannot create shapes, still output an empty "shapes": [].
6. Always return a seeded deterministic spec (choose seed >= 0).

FEW-SHOT EXAMPLES:
User phrase: "calm and content"
Output:
{
  "palette":["#f8fafc","#2dd4bf","#60a5fa"],
  "style":"soft-blobs",
  "seed":42,
  "density":8,
  "shapes":[
    {"type":"circle","cx":400,"cy":250,"r":120,"fill":"#60a5fa","opacity":0.18}
  ]
}

User phrase: "anxious and jittery"
Output:
{
  "palette":["#0b1222","#ff6b6b","#ffd166"],
  "style":"lines",
  "seed":1234,
  "density":20,
  "shapes":[
    {"type":"rect","x":50,"y":20,"w":700,"h":6,"fill":"#ff6b6b","opacity":0.15}
  ]
}

Now produce a JSON art spec for the following user phrase (respond only with the JSON object):
User phrase: "<USER_PHRASE>"
`.trim();

export default {
  async fetch(req: Request, env: any) {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/api") {
      const body = await req.json();
      const userPhrase = (body.text || "").replace(/"/g, '\\"');

      const prompt = PROMPT_TEMPLATE.replace("<USER_PHRASE>", userPhrase);

      const ai = await env.AI.run("@cf/meta/llama-3.3-8b-instruct", {
        prompt,
        temperature: 0.2,
        max_tokens: 512
      });

      const raw = (ai as any).output ?? ai;
      const textOut = typeof raw === "string" ? raw.trim() : JSON.stringify(raw);

      try {
        const spec = JSON.parse(textOut);
        if (typeof validateSpec === "function") {
          const ok = validateSpec(spec);
          if (ok !== true) {
            return new Response(JSON.stringify({ error: "validation_failed", details: ok, raw: textOut }), { status: 500, headers: { "content-type": "application/json" }});
          }
        }
        return new Response(JSON.stringify(spec), { headers: { "content-type": "application/json" }});
      } catch (e) {
        return new Response(JSON.stringify({ error: "invalid_json", raw: textOut }), { status: 500, headers: { "content-type": "application/json" }});
      }
    }

    return new Response("OK");
  }
};
