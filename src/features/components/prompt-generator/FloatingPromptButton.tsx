import styled from "@emotion/styled";
import { buttonReset, px } from "~/common/lib/css-util";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";

const Fab = styled.button(buttonReset, {
  position: "fixed",
  bottom: px(28),
  right: px(28),
  width: px(56),
  height: px(56),
  borderRadius: "50%",
  background: THEME_COLOR.ACCENT,
  color: THEME_COLOR.WHITE,
  boxShadow: `0 4px 20px ${THEME_COLOR.SHADOW_MD}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: px(24),
  zIndex: 200,
  transition: "background 0.15s ease, transform 0.15s ease",
  "&:hover": {
    background: THEME_COLOR.ACCENT_HOVER,
    transform: "scale(1.07)"
  },
  "&:active": {
    transform: "scale(0.96)"
  }
});

const FabBadge = styled.span({
  position: "absolute",
  top: px(-4),
  right: px(-4),
  background: THEME_COLOR.SUCCESS,
  color: THEME_COLOR.WHITE,
  borderRadius: "50%",
  width: px(20),
  height: px(20),
  fontSize: px(10),
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1
});

type FloatingPromptButtonProps = {
  selectedCount: number;
  onClick: () => void;
};

const FloatingPromptButton = ({
  selectedCount,
  onClick
}: FloatingPromptButtonProps) => (
  <Fab onClick={onClick} type="button" aria-label="プロンプトを表示">
    ✦{selectedCount > 0 && <FabBadge>{selectedCount}</FabBadge>}
  </Fab>
);

export default FloatingPromptButton;
