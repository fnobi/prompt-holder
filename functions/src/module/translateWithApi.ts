import { onCall } from "firebase-functions/v2/https";
import responseAppCallable from "@/local/responseAppCallable";
import { getSecretParams, getSecretString } from "@/local/secret-manager";
import { COMMON_CALLABLE_REGION } from "~/features/schema/AppCallableScheme";
import AppError from "~/features/schema/AppError";
import { firebaseFirestore } from "@/lib/firebase-app";
import { ServerDataStoreAgent } from "@/lib/ServerDataStoreAgent";
import { translationUsageDataStoreScheme } from "~/features/schema/app-data-store-scheme";

const translationUsageAgent = new ServerDataStoreAgent(
  firebaseFirestore,
  translationUsageDataStoreScheme
);

const currentMonth = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

export default onCall(
  {
    region: COMMON_CALLABLE_REGION,
    secrets: getSecretParams("DEEPL_API_KEY")
  },
  req =>
    responseAppCallable<"translateWithApi">(req, async ({ data, auth }) => {
      if (!auth) {
        throw new AppError({ type: "unauthorized" });
      }
      const { jaWord } = data;
      const DEEPL_API_KEY = getSecretString("DEEPL_API_KEY");
      const res = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: [jaWord], target_lang: "EN" })
      });
      if (!res.ok) {
        throw new Error(`DeepL error: ${res.status}`);
      }
      const json = (await res.json()) as {
        translations: { text: string }[];
      };

      const month = currentMonth();
      await ServerDataStoreAgent.runTransaction(
        firebaseFirestore,
        ({ get }) => get(translationUsageAgent, { userId: auth.uid, month }),
        (current, { set }) =>
          set(translationUsageAgent, {
            userId: auth.uid,
            month,
            data: {
              characterCount: (current?.characterCount ?? 0) + jaWord.length,
              callCount: (current?.callCount ?? 0) + 1
            }
          })
      );

      return {
        case: "ok",
        data: { enWord: json.translations[0].text }
      };
    })
);
