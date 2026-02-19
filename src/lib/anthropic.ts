// Client Anthropic singleton — initialisation lazy via Proxy
import Anthropic from "@anthropic-ai/sdk";

let anthropicInstance: Anthropic | undefined;

function getAnthropic(): Anthropic {
  if (!anthropicInstance) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "La variable d'environnement ANTHROPIC_API_KEY est requise"
      );
    }
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicInstance;
}

// Proxy lazy : Anthropic n'est instancié qu'au premier appel réel
export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop: string | symbol) {
    return Reflect.get(getAnthropic(), prop);
  },
});
