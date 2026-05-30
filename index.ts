import { streamText } from "ai";
import "dotenv/config";

const result = streamText({
  model: "anthropic/claude-haiku-4.5",
  prompt: "Write a one-sentence tagline for a luxury candle brand called Candera.",
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
process.stdout.write("\n");

const usage = await result.usage;
console.log("\nToken usage:", usage);
