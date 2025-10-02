export async function handleMessage(env, userId, input) {
  // get memory
  const history = await env.MEMORY.getHistory(userId);

  // build new prompt
  const prompt = `${history}\nUser: ${input}\nAI:`;

  // run AI
  const result = await env.AI.run(
    "@cf/meta/llama-3.3-8b-instruct",
    { prompt }
  );

  // update memory
  await env.MEMORY.addMessage(userId, `User: ${input}\nAI: ${result.output}`);

  return result.output;
}
