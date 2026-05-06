import { parseNumber, parseObject } from "~/common/lib/parser-helper";

type TranslationUsage = {
  characterCount: number;
  callCount: number;
};

export const parseTranslationUsage = (src: unknown) =>
  parseObject<TranslationUsage>(src, ({ characterCount, callCount }) => ({
    characterCount: parseNumber(characterCount),
    callCount: parseNumber(callCount)
  }));

export default TranslationUsage;
