import { type DataStoreScheme } from "~/common/lib/DataStoreAgent";
import type MyPromptItem from "~/features/schema/MyPromptItem";
import { parseMyPromptItem } from "~/features/schema/MyPromptItem";
import type DummyProfile from "~/features/schema/DummyProfile";
import { parseDummyProfile } from "~/features/schema/DummyProfile";
import type TranslationUsage from "~/features/schema/TranslationUsage";
import { parseTranslationUsage } from "~/features/schema/TranslationUsage";

export const profileDataStoreScheme: DataStoreScheme<DummyProfile, "userId"> = {
  name: "profiles",
  parse: parseDummyProfile,
  documentKey: "userId"
};

export const myPromptDataStoreScheme: DataStoreScheme<
  MyPromptItem,
  "promptId",
  "userId"
> = {
  name: "myPrompts",
  parse: parseMyPromptItem,
  documentKey: "promptId",
  parentCollection: profileDataStoreScheme
};

export const translationUsageDataStoreScheme: DataStoreScheme<
  TranslationUsage,
  "month",
  "userId"
> = {
  name: "translationUsage",
  parse: parseTranslationUsage,
  documentKey: "month",
  parentCollection: profileDataStoreScheme
};
