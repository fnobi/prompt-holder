"use client";

import { useCallback } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { buttonReset, px } from "~/common/lib/css-util";
import { type TypedCollectionList } from "~/common/lib/DataStoreAgent";
import { TITLE_BAR_HEIGHT } from "~/features/components/LayoutRoot";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";
import { PAGE_TOP } from "~/features/lib/page-path";
import PROMPT_CATEGORIES from "~/features/lib/promptData";
import usePromptStore from "~/features/lib/promptStore";
import type MyPromptItem from "~/features/schema/MyPromptItem";
import type PromptState from "~/features/schema/PromptState";

const Root = styled.div({
  minHeight: "100vh",
  background: THEME_COLOR.BG,
  paddingTop: px(TITLE_BAR_HEIGHT + 24),
  paddingBottom: px(100)
});

const Inner = styled.div({
  maxWidth: px(760),
  margin: "0 auto",
  padding: px(0, 16)
});

const PageTitle = styled.h1({
  fontSize: px(18),
  fontWeight: 700,
  color: THEME_COLOR.TEXT_MAIN,
  marginBottom: px(20)
});

const EmptyMessage = styled.p({
  color: THEME_COLOR.TEXT_SUB,
  fontSize: px(14),
  fontStyle: "italic"
});

const PromptCard = styled.div({
  background: THEME_COLOR.SURFACE,
  border: `1px solid ${THEME_COLOR.BORDER}`,
  borderRadius: px(10),
  padding: px(14, 20),
  marginBottom: px(12)
});

const CardHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: px(10)
});

const DateLabel = styled.span({
  fontSize: px(12),
  color: THEME_COLOR.TEXT_SUB
});

const CardActions = styled.div({
  display: "flex",
  gap: px(6)
});

const TagList = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: px(6)
});

const Tag = styled.span({
  display: "inline-block",
  padding: px(3, 8),
  borderRadius: px(20),
  fontSize: px(12),
  background: THEME_COLOR.TAG_ACCENT_BG,
  color: THEME_COLOR.ACCENT,
  lineHeight: 1.5
});

const EmptyTag = styled.span({
  fontSize: px(13),
  color: THEME_COLOR.TEXT_SUB,
  fontStyle: "italic"
});

const ActionButton = styled.button(buttonReset, {
  flexShrink: 0,
  padding: px(5, 10),
  borderRadius: px(6),
  fontSize: px(12),
  border: `1px solid ${THEME_COLOR.BORDER}`,
  transition: "all 0.15s ease"
});

const LoadButton = styled(ActionButton)({
  color: THEME_COLOR.ACCENT,
  borderColor: THEME_COLOR.ACCENT,
  "&:hover": {
    background: THEME_COLOR.ACCENT_LIGHT
  }
});

const DeleteButton = styled(ActionButton)({
  color: THEME_COLOR.TEXT_SUB,
  "&:hover": {
    borderColor: THEME_COLOR.ERROR,
    color: THEME_COLOR.ERROR
  }
});

const LoginMessage = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: px(200),
  fontSize: px(14),
  color: THEME_COLOR.TEXT_SUB_80
});

const buildJapaneseLabels = ({
  subjectItems,
  subjectSelectedIds,
  selectedIds
}: PromptState): string[] => {
  const labels: string[] = [];
  for (const item of subjectItems) {
    if (subjectSelectedIds.includes(item.id)) {
      labels.push(item.label);
    }
  }
  for (const category of PROMPT_CATEGORIES) {
    for (const item of category.items) {
      if (selectedIds.includes(item.id)) {
        labels.push(item.label);
      }
    }
  }
  return labels;
};

const formatCreatedAt = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

type PromptItemCardProps = {
  id: string;
  data: MyPromptItem;
  onDelete: (id: string) => void;
};

const PromptItemCard = ({ id, data, onDelete }: PromptItemCardProps) => {
  const router = useRouter();
  const setSubjectItems = usePromptStore(state => state.setSubjectItems);
  const setSubjectSelectedIds = usePromptStore(
    state => state.setSubjectSelectedIds
  );
  const setSelectedIds = usePromptStore(state => state.setSelectedIds);

  const labels = buildJapaneseLabels(data.prompt);

  const handleLoad = useCallback(() => {
    setSubjectItems(data.prompt.subjectItems);
    setSubjectSelectedIds(data.prompt.subjectSelectedIds);
    setSelectedIds(data.prompt.selectedIds);
    router.push(PAGE_TOP.href);
  }, [
    data.prompt,
    router,
    setSelectedIds,
    setSubjectItems,
    setSubjectSelectedIds
  ]);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <PromptCard>
      <CardHeader>
        <DateLabel>{formatCreatedAt(data.createdAt)}</DateLabel>
        <CardActions>
          <LoadButton type="button" onClick={handleLoad}>
            読み込む
          </LoadButton>
          <DeleteButton type="button" onClick={handleDelete}>
            削除
          </DeleteButton>
        </CardActions>
      </CardHeader>
      <TagList>
        {labels.length > 0 ? (
          labels.map((label, i) => <Tag key={i}>{label}</Tag>)
        ) : (
          <EmptyTag>(選択項目なし)</EmptyTag>
        )}
      </TagList>
    </PromptCard>
  );
};

type ListViewProps = {
  list: TypedCollectionList<MyPromptItem> | null;
  onDelete: (id: string) => void;
};

const ListView = ({ list, onDelete }: ListViewProps) => {
  if (!list) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      {list.length === 0 ? (
        <EmptyMessage>お気に入りプロンプトはありません。</EmptyMessage>
      ) : (
        list.map(({ id, data }) => (
          <PromptItemCard key={id} id={id} data={data} onDelete={onDelete} />
        ))
      )}
    </div>
  );
};

export const MyPromptLoginRequired = () => (
  <Root>
    <LoginMessage>この機能を使うにはログインしてください。</LoginMessage>
  </Root>
);

type MyPromptListPageProps = {
  list: TypedCollectionList<MyPromptItem> | null;
  onDelete: (id: string) => void;
};

const MyPromptListPage = ({ list, onDelete }: MyPromptListPageProps) => (
  <Root>
    <Inner>
      <PageTitle>お気に入りのプロンプト</PageTitle>
      <ListView list={list} onDelete={onDelete} />
    </Inner>
  </Root>
);

export default MyPromptListPage;
