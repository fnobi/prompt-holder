import { useCallback, useEffect, useState } from "react";
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

const OutputText = styled.div({
  minHeight: px(100),
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  borderRadius: px(8),
  padding: px(12),
  fontSize: px(13),
  lineHeight: 1.7,
  color: THEME_COLOR.TEXT_MAIN,
  fontFamily: "monospace",
  background: THEME_COLOR.BG,
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  marginBottom: px(12)
});

const EmptyOutput = styled.div({
  color: THEME_COLOR.TEXT_SUB_50,
  fontFamily: "sans-serif",
  fontStyle: "italic",
  fontSize: px(13)
});

const CopyButton = styled.button<{ copied: boolean }>(
  buttonReset,
  {
    width: "100%",
    padding: px(11),
    borderRadius: px(8),
    fontSize: px(14),
    fontWeight: 600,
    textAlign: "center",
    transition: "all 0.15s ease"
  },
  ({ copied }) =>
    copied
      ? {
          background: THEME_COLOR.SUCCESS,
          color: THEME_COLOR.WHITE,
          cursor: "default"
        }
      : {
          background: THEME_COLOR.ACCENT,
          color: THEME_COLOR.WHITE,
          "&:hover": { background: THEME_COLOR.ACCENT_HOVER },
          "&:active": { background: THEME_COLOR.ACCENT_DEEP }
        }
);

const ClearButton = styled.button(buttonReset, {
  width: "100%",
  padding: px(9),
  borderRadius: px(8),
  fontSize: px(13),
  fontWeight: 500,
  textAlign: "center",
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  color: THEME_COLOR.TEXT_SUB,
  marginTop: px(8),
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: THEME_COLOR.ERROR,
    color: THEME_COLOR.ERROR
  }
});

const saveButtonBase = [
  buttonReset,
  {
    flex: 1,
    padding: px(11),
    borderRadius: px(8),
    fontSize: px(14),
    fontWeight: 600,
    textAlign: "center" as const,
    transition: "all 0.15s ease"
  }
];

const OverwriteButton = styled.button<{ overwritten: boolean }>(
  ...saveButtonBase,
  ({ overwritten }) =>
    overwritten
      ? {
          background: THEME_COLOR.SUCCESS,
          color: THEME_COLOR.WHITE,
          cursor: "default"
        }
      : {
          background: THEME_COLOR.SURFACE,
          color: THEME_COLOR.ACCENT,
          border: `1.5px solid ${THEME_COLOR.ACCENT}`,
          "&:hover:not(:disabled)": { background: THEME_COLOR.ACCENT_LIGHT },
          "&:disabled": { opacity: 0.5, cursor: "default" }
        }
);

const SaveButton = styled.button<{ saved: boolean }>(
  ...saveButtonBase,
  ({ saved }) =>
    saved
      ? {
          background: THEME_COLOR.SUCCESS,
          color: THEME_COLOR.WHITE,
          cursor: "default"
        }
      : {
          background: THEME_COLOR.SURFACE,
          color: THEME_COLOR.ACCENT,
          border: `1.5px solid ${THEME_COLOR.ACCENT}`,
          "&:hover:not(:disabled)": { background: THEME_COLOR.ACCENT_LIGHT },
          "&:disabled": { opacity: 0.5, cursor: "default" }
        }
);

const SaveButtonRow = styled.div({
  display: "flex",
  gap: px(8),
  marginTop: px(8)
});

const useTimedFlag = (duration = 2000) => {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (!flag) {return;}
    const id = setTimeout(() => setFlag(false), duration);
    return () => clearTimeout(id);
  }, [flag, duration]);
  return [flag, setFlag] as const;
};

type PromptOutputPopupProps = {
  prompt: string;
  selectedCount: number;
  canSave: boolean;
  onClose: () => void;
  saveHandler: () => Promise<void>;
  overwriteHandler?: () => Promise<void>;
  onClear: () => void;
};

const PromptOutputPopup = ({
  prompt,
  selectedCount,
  canSave,
  onClose,
  saveHandler,
  overwriteHandler,
  onClear
}: PromptOutputPopupProps) => {
  const [copied, setCopied] = useTimedFlag();
  const [saved, setSaved] = useTimedFlag();
  const [overwritten, setOverwritten] = useTimedFlag();

  const handleCopy = useCallback(() => {
    if (!prompt) {return;}
    navigator.clipboard.writeText(prompt).then(() => setCopied(true));
  }, [prompt, setCopied]);

  const handleSave = useCallback(async () => {
    if (!prompt || saved) {return;}
    await saveHandler();
    setSaved(true);
  }, [saveHandler, prompt, saved, setSaved]);

  const handleOverwrite = useCallback(async () => {
    if (!prompt || overwritten || !overwriteHandler) {return;}
    await overwriteHandler();
    setOverwritten(true);
  }, [overwriteHandler, prompt, overwritten, setOverwritten]);

  const handleClear = useCallback(() => {
    onClear();
    setCopied(false);
  }, [onClear, setCopied]);

  return (
    <Overlay onClick={onClose}>
      <PopupPanel onClick={e => e.stopPropagation()}>
        <PopupHeader>
          <PopupTitle>
            生成プロンプト
            {selectedCount > 0 && `　${selectedCount} 件選択中`}
          </PopupTitle>
          <PopupClose onClick={onClose} type="button" aria-label="閉じる">
            ×
          </PopupClose>
        </PopupHeader>

        <OutputText>
          {prompt || (
            <EmptyOutput>
              カテゴリからオプションを選ぶと、ここにプロンプトが表示されます。
            </EmptyOutput>
          )}
        </OutputText>

        <CopyButton
          copied={copied}
          onClick={handleCopy}
          disabled={!prompt}
          type="button"
        >
          {copied ? "コピーしました ✓" : "クリップボードにコピー"}
        </CopyButton>

        {canSave && (
          <SaveButtonRow>
            {overwriteHandler && (
              <OverwriteButton
                overwritten={overwritten}
                onClick={handleOverwrite}
                disabled={!prompt || overwritten}
                type="button"
              >
                {overwritten ? "上書き ✓" : "上書き保存"}
              </OverwriteButton>
            )}
            <SaveButton
              saved={saved}
              onClick={handleSave}
              disabled={!prompt || saved}
              type="button"
            >
              {saved ? "保存 ✓" : overwriteHandler ? "新規保存" : "お気に入りに保存"}
            </SaveButton>
          </SaveButtonRow>
        )}

        <ClearButton onClick={handleClear} type="button">
          すべてクリア
        </ClearButton>
      </PopupPanel>
    </Overlay>
  );
};

export default PromptOutputPopup;
