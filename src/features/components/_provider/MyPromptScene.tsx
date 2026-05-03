"use client";

import { useCallback, useMemo } from "react";
import { ClientDataStoreAgent } from "~/common/lib/ClientDataStoreAgent";
import { useDataStoreList } from "~/common/lib/database-common-hooks";
import { type QueryFormula } from "~/common/lib/DataStoreAgent";
import { useAuthorizedUser } from "~/common/lib/firebase-auth-tools";
import type FirebaseErrorParameter from "~/common/schema/FirebaseErrorParameter";
import MyPromptListPage, {
  MyPromptLoginRequired
} from "~/features/components/my-prompt/MyPromptListPage";
import { myPromptDataStoreScheme } from "~/features/schema/app-data-store-scheme";
import type MyPromptItem from "~/features/schema/MyPromptItem";
import LoadingScene from "~/features/components/LoadingScene";

const myPromptDataStore = new ClientDataStoreAgent(myPromptDataStoreScheme);

const LIST_QUERY: QueryFormula<MyPromptItem>[] = [
  ["orderBy", "createdAt", "desc"]
];

const MyPromptScene = () => {
  const { isAuthLoading, myId } = useAuthorizedUser();
  const params = useMemo(() => (myId ? { userId: myId } : null), [myId]);
  const handleError = useCallback(
    (e: FirebaseErrorParameter) => console.error(e),
    []
  );
  const list = useDataStoreList({
    dataStore: myPromptDataStore,
    params,
    query: LIST_QUERY,
    onError: handleError
  });

  const handleDelete = useCallback(
    (promptId: string) => {
      if (!myId) {
        return;
      }
      myPromptDataStore.deleteItem({ userId: myId, promptId });
    },
    [myId]
  );

  if (isAuthLoading) {
    return <LoadingScene />;
  }

  if (!myId) {
    return <MyPromptLoginRequired />;
  }

  return <MyPromptListPage list={list} onDelete={handleDelete} />;
};

export default MyPromptScene;
