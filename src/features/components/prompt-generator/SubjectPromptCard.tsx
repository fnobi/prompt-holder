import { useState, type FormEvent } from "react";
import styled from "@emotion/styled";
import { buttonReset, px } from "~/common/lib/css-util";
import {
  Card,
  Tag,
  TagsGrid,
  Tooltip,
  TooltipValue,
  TooltipWrapper
} from "~/features/components/prompt-generator/PromptGeneratorShared";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";
import { type SubjectItem } from "~/features/schema/PromptState";

const SubjectHeaderRow = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: px(8)
});

const SubjectLabel = styled.label({
  display: "block",
  fontSize: px(13),
  fontWeight: 700,
  color: THEME_COLOR.TEXT_SUB,
  textTransform: "uppercase",
  letterSpacing: "0.08em"
});

const EditTrigger = styled.button(buttonReset, {
  display: "flex",
  alignItems: "center",
  gap: px(3),
  fontSize: px(11),
  color: THEME_COLOR.TEXT_SUB,
  padding: px(3, 7),
  borderRadius: px(4),
  transition: "all 0.15s ease",
  "&:hover": {
    color: THEME_COLOR.ACCENT,
    background: THEME_COLOR.ACCENT_LIGHT
  }
});

const SubjectTagsGrid = styled(TagsGrid)({
  marginBottom: px(12)
});

const SubjectInput = styled.input({
  width: "100%",
  boxSizing: "border-box",
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  borderRadius: px(8),
  padding: px(10, 12),
  fontSize: px(13),
  fontFamily: "inherit",
  color: THEME_COLOR.TEXT_MAIN,
  outline: "none",
  transition: "border-color 0.15s ease",
  "&:focus": {
    borderColor: THEME_COLOR.ACCENT
  },
  background: THEME_COLOR.SURFACE,
  "&::placeholder": {
    color: THEME_COLOR.TEXT_SUB_60
  }
});

const TranslateRow = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: px(8),
  marginTop: px(6)
});

const TranslateError = styled.span({
  fontSize: px(11),
  color: THEME_COLOR.ERROR
});

const TranslateButton = styled.button<{ isLoading: boolean }>(buttonReset, {
  padding: px(5, 12),
  borderRadius: px(6),
  fontSize: px(12),
  fontWeight: 500,
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  color: THEME_COLOR.TEXT_SUB,
  transition: "all 0.15s ease",
  "&:not(:disabled):hover": {
    borderColor: THEME_COLOR.ACCENT,
    color: THEME_COLOR.ACCENT,
    background: THEME_COLOR.ACCENT_LIGHT
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "default"
  }
});

type SubjectTagItemProps = {
  item: SubjectItem;
  selected: boolean;
  onToggle: (id: string) => void;
};

const SubjectTagItem = ({ item, selected, onToggle }: SubjectTagItemProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <TooltipWrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <Tooltip>
          <TooltipValue>{item.value}</TooltipValue>
        </Tooltip>
      )}
      <Tag selected={selected} onClick={() => onToggle(item.id)} type="button">
        {item.label}
      </Tag>
    </TooltipWrapper>
  );
};

type SubjectPromptCardProps = {
  subjectItems: SubjectItem[];
  subjectSelectedIds: string[];
  subjectInput: string;
  translating: boolean;
  translateError: string;
  onSubjectInputChange: (value: string) => void;
  onAddSubject: () => void;
  onEditOpen: () => void;
  onToggleSubjectItem: (id: string) => void;
};

const SubjectPromptCard = ({
  subjectItems,
  subjectSelectedIds,
  subjectInput,
  translating,
  translateError,
  onSubjectInputChange,
  onAddSubject,
  onEditOpen,
  onToggleSubjectItem
}: SubjectPromptCardProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddSubject();
  };

  return (
    <Card>
      <SubjectHeaderRow>
        <SubjectLabel htmlFor="subject-input">主題・被写体</SubjectLabel>
        {subjectItems.length > 0 && (
          <EditTrigger type="button" onClick={onEditOpen}>
            ✏ 編集
          </EditTrigger>
        )}
      </SubjectHeaderRow>
      {subjectItems.length > 0 && (
        <SubjectTagsGrid>
          {subjectItems.map(item => (
            <SubjectTagItem
              key={item.id}
              item={item}
              selected={subjectSelectedIds.includes(item.id)}
              onToggle={onToggleSubjectItem}
            />
          ))}
        </SubjectTagsGrid>
      )}
      <form onSubmit={handleSubmit}>
        <SubjectInput
          id="subject-input"
          type="text"
          placeholder="例: 花畑に立つ若い女性"
          value={subjectInput}
          onChange={e => onSubjectInputChange(e.target.value)}
        />
        <TranslateRow>
          {translateError && <TranslateError>{translateError}</TranslateError>}
          <TranslateButton
            type="submit"
            isLoading={translating}
            disabled={translating || !subjectInput.trim()}
          >
            {translating ? "追加中..." : "追加"}
          </TranslateButton>
        </TranslateRow>
      </form>
    </Card>
  );
};

export default SubjectPromptCard;
