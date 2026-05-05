import { parseNumber, parseObject } from "~/common/lib/parser-helper";
import type PromptState from "~/features/schema/PromptState";
import { parsePromptState } from "~/features/schema/PromptState";

type MyPromptItem = {
  prompt: PromptState;
  createdAt: number;
  updatedAt?: number;
};

export const parseMyPromptItem = (src: unknown) =>
  parseObject<MyPromptItem>(src, ({ prompt, createdAt, updatedAt }) => ({
    prompt: parsePromptState(prompt),
    createdAt: parseNumber(createdAt),
    updatedAt: typeof updatedAt === "number" ? updatedAt : undefined
  }));

export default MyPromptItem;
