import styled from "@emotion/styled";
import { buttonReset, px } from "~/common/lib/css-util";
import {
  Overlay,
  PopupClose,
  PopupHeader,
  PopupPanel,
  PopupTitle
} from "~/features/components/prompt-generator/PromptGeneratorShared";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";
import { type SubjectItem } from "~/features/schema/PromptState";

const EditListItem = styled.div({
  display: "flex",
  alignItems: "center",
  gap: px(8),
  padding: px(10, 0),
  borderBottom: `1px solid ${THEME_COLOR.BORDER}`,
  "&:last-child": { borderBottom: "none" }
});

const EditItemInfo = styled.div({
  flex: 1,
  minWidth: 0
});

const EditItemLabelText = styled.div({
  fontSize: px(13),
  fontWeight: 600,
  color: THEME_COLOR.TEXT_MAIN
});

const EditItemValue = styled.div({
  fontSize: px(11),
  color: THEME_COLOR.TEXT_SUB,
  fontFamily: "monospace",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginTop: px(2)
});

const EditItemActions = styled.div({
  display: "flex",
  gap: px(4),
  flexShrink: 0
});

const SmallIconBtn = styled.button(buttonReset, {
  width: px(28),
  height: px(28),
  borderRadius: px(6),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: px(13),
  color: THEME_COLOR.TEXT_SUB,
  border: `1px solid ${THEME_COLOR.BORDER}`,
  transition: "all 0.15s ease",
  "&:hover:not(:disabled)": {
    borderColor: THEME_COLOR.ACCENT,
    color: THEME_COLOR.ACCENT,
    background: THEME_COLOR.ACCENT_LIGHT
  },
  "&:disabled": {
    opacity: 0.3,
    cursor: "default"
  }
});

const DeleteIconBtn = styled(SmallIconBtn)({
  "&:hover:not(:disabled)": {
    borderColor: THEME_COLOR.ERROR,
    color: THEME_COLOR.ERROR,
    background: THEME_COLOR.ERROR_BG
  }
});

const EditEmptyState = styled.div({
  textAlign: "center",
  color: THEME_COLOR.TEXT_SUB_50,
  fontSize: px(13),
  padding: px(24, 0),
  fontStyle: "italic"
});

type SubjectEditPopupProps = {
  subjectItems: SubjectItem[];
  onClose: () => void;
  onMoveSubjectItem: (fromIndex: number, toIndex: number) => void;
  onRemoveSubjectItem: (id: string) => void;
};

const SubjectEditPopup = ({
  subjectItems,
  onClose,
  onMoveSubjectItem,
  onRemoveSubjectItem
}: SubjectEditPopupProps) => (
  <Overlay onClick={onClose}>
    <PopupPanel onClick={e => e.stopPropagation()}>
      <PopupHeader>
        <PopupTitle>主題・被写体を編集</PopupTitle>
        <PopupClose onClick={onClose} type="button" aria-label="閉じる">
          ×
        </PopupClose>
      </PopupHeader>
      {subjectItems.length === 0 ? (
        <EditEmptyState>登録済みの項目がありません</EditEmptyState>
      ) : (
        subjectItems.map((item, index) => (
          <EditListItem key={item.id}>
            <EditItemInfo>
              <EditItemLabelText>{item.label}</EditItemLabelText>
              <EditItemValue>{item.value}</EditItemValue>
            </EditItemInfo>
            <EditItemActions>
              <SmallIconBtn
                type="button"
                onClick={() => onMoveSubjectItem(index, index - 1)}
                disabled={index === 0}
                aria-label="上に移動"
              >
                ↑
              </SmallIconBtn>
              <SmallIconBtn
                type="button"
                onClick={() => onMoveSubjectItem(index, index + 1)}
                disabled={index === subjectItems.length - 1}
                aria-label="下に移動"
              >
                ↓
              </SmallIconBtn>
              <DeleteIconBtn
                type="button"
                onClick={() => onRemoveSubjectItem(item.id)}
                aria-label="削除"
              >
                ×
              </DeleteIconBtn>
            </EditItemActions>
          </EditListItem>
        ))
      )}
    </PopupPanel>
  </Overlay>
);

export default SubjectEditPopup;
