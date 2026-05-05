"use client";

import { useCallback, useState } from "react";
import { ClientDataStoreAgent } from "~/common/lib/ClientDataStoreAgent";
import { useAuthorizedUser } from "~/common/lib/firebase-auth-tools";
import FloatingPromptButton from "~/features/components/prompt-generator/FloatingPromptButton";
import PromptCategoryCard from "~/features/components/prompt-generator/PromptCategoryCard";
import PromptGeneratorLayout from "~/features/components/prompt-generator/PromptGeneratorLayout";
import { type PromptGeneratorTab } from "~/features/components/prompt-generator/PromptGeneratorTabBar";
import PromptOutputPopup from "~/features/components/prompt-generator/PromptOutputPopup";
import SubjectEditPopup from "~/features/components/prompt-generator/SubjectEditPopup";
import SubjectPromptCard from "~/features/components/prompt-generator/SubjectPromptCard";
import buildPrompt from "~/features/lib/buildPrompt";
import PROMPT_CATEGORIES from "~/features/lib/promptData";
import requestAppCallable from "~/features/lib/requestAppCallable";
import usePromptStore from "~/features/lib/promptStore";
import { myPromptDataStoreScheme } from "~/features/schema/app-data-store-scheme";
import { type PromptCategory } from "~/features/schema/PromptItem";
import { type SubjectItem } from "~/features/schema/PromptState";

const SUBJECT_TAB_ID = "__subject__";

const buildTabs = (categories: PromptCategory[]): PromptGeneratorTab[] => [
  { id: SUBJECT_TAB_ID, label: "主題・被写体" },
  ...categories.map(c => ({ id: c.id, label: c.label }))
];

const myPromptDataStore = new ClientDataStoreAgent(myPromptDataStoreScheme);

const TABS = buildTabs(PROMPT_CATEGORIES);

const PromptGeneratorScene = () => {
  const subjectItems = usePromptStore(state => state.subjectItems);
  const subjectSelectedIds = usePromptStore(state => state.subjectSelectedIds);
  const selectedIds = usePromptStore(state => state.selectedIds);
  const addSubjectItem = usePromptStore(state => state.addSubjectItem);
  const removeSubjectItem = usePromptStore(state => state.removeSubjectItem);
  const moveSubjectItem = usePromptStore(state => state.moveSubjectItem);
  const toggleSubjectSelected = usePromptStore(
    state => state.toggleSubjectSelected
  );
  const toggleSelected = usePromptStore(state => state.toggleSelected);
  const clearAllStore = usePromptStore(state => state.clearAll);
  const myPromptId = usePromptStore(state => state.myPromptId);
  const setMyPromptId = usePromptStore(state => state.setMyPromptId);

  const { myId } = useAuthorizedUser();

  const [activeTab, setActiveTab] = useState(SUBJECT_TAB_ID);
  const [subjectInput, setSubjectInput] = useState("");
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [editSubjectOpen, setEditSubjectOpen] = useState(false);

  const toggleItem = useCallback(
    (id: string) => {
      toggleSelected(id);
    },
    [toggleSelected]
  );

  const toggleSubjectItem = useCallback(
    (id: string) => {
      toggleSubjectSelected(id);
    },
    [toggleSubjectSelected]
  );

  const clearAll = useCallback(() => {
    clearAllStore();
    setSubjectInput("");
  }, [clearAllStore]);

  const handleAddSubject = useCallback(async () => {
    const trimmed = subjectInput.trim();
    if (!trimmed) {
      return;
    }
    setTranslating(true);
    setTranslateError("");
    try {
      const res = await requestAppCallable("translateWithApi", {
        jaWord: trimmed
      });
      if (res.case !== "ok") {
        throw new Error(`HTTP ${res.error}`);
      }
      const newItem: SubjectItem = {
        id: `subject-${Date.now()}`,
        label: trimmed,
        value: res.data.enWord
      };
      addSubjectItem(newItem);
      setSubjectInput("");
    } catch {
      setTranslateError("翻訳に失敗しました");
    } finally {
      setTranslating(false);
    }
  }, [addSubjectItem, subjectInput]);

  const prompt = buildPrompt({ subjectItems, subjectSelectedIds, selectedIds });

  const handleSave = useCallback(async () => {
    if (!myId || !prompt) {
      return;
    }
    const newId = await myPromptDataStore.addItem({
      userId: myId,
      data: {
        prompt: { subjectItems, subjectSelectedIds, selectedIds },
        createdAt: Date.now()
      }
    });
    setMyPromptId(newId);
  }, [myId, prompt, selectedIds, setMyPromptId, subjectItems, subjectSelectedIds]);

  const handleOverwrite = useCallback(async () => {
    if (!myId || !myPromptId || !prompt) {
      return;
    }
    await myPromptDataStore.mergeItem({
      userId: myId,
      promptId: myPromptId,
      data: {
        prompt: { subjectItems, subjectSelectedIds, selectedIds },
        updatedAt: Date.now()
      }
    });
  }, [myId, myPromptId, prompt, selectedIds, subjectItems, subjectSelectedIds]);

  const selectedCount = selectedIds.length + subjectSelectedIds.length;
  const activeCategory = PROMPT_CATEGORIES.find(c => c.id === activeTab);

  return (
    <PromptGeneratorLayout
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === SUBJECT_TAB_ID ? (
        <SubjectPromptCard
          subjectItems={subjectItems}
          subjectSelectedIds={subjectSelectedIds}
          subjectInput={subjectInput}
          translating={translating}
          translateError={translateError}
          onSubjectInputChange={setSubjectInput}
          onAddSubject={handleAddSubject}
          onEditOpen={() => setEditSubjectOpen(true)}
          onToggleSubjectItem={toggleSubjectItem}
        />
      ) : activeCategory ? (
        <PromptCategoryCard
          category={activeCategory}
          selectedIds={selectedIds}
          onToggle={toggleItem}
        />
      ) : null}

      <FloatingPromptButton
        selectedCount={selectedCount}
        onClick={() => setPopupOpen(true)}
      />

      {editSubjectOpen && (
        <SubjectEditPopup
          subjectItems={subjectItems}
          onClose={() => setEditSubjectOpen(false)}
          onMoveSubjectItem={moveSubjectItem}
          onRemoveSubjectItem={removeSubjectItem}
        />
      )}

      {popupOpen && (
        <PromptOutputPopup
          prompt={prompt}
          selectedCount={selectedCount}
          canSave={!!myId}
          saveHandler={handleSave}
          overwriteHandler={myPromptId ? handleOverwrite : undefined}
          onClear={clearAll}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </PromptGeneratorLayout>
  );
};

export default PromptGeneratorScene;
