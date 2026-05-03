import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { buttonReset, px } from "~/common/lib/css-util";
import { TITLE_BAR_HEIGHT } from "~/features/components/LayoutRoot";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";

export const Root = styled.div({
  minHeight: "100vh",
  background: THEME_COLOR.BG,
  paddingBottom: px(100)
});

export const Body = styled.div({
  maxWidth: px(760),
  margin: "0 auto",
  padding: px(24, 16)
});

export const Card = styled.div({
  background: THEME_COLOR.SURFACE,
  border: `1px solid ${THEME_COLOR.BORDER}`,
  borderRadius: px(10),
  padding: px(20)
});

export const TabBarOuter = styled.div({
  background: THEME_COLOR.SURFACE,
  borderBottom: `1px solid ${THEME_COLOR.BORDER}`,
  position: "sticky",
  top: px(TITLE_BAR_HEIGHT),
  zIndex: 10
});

export const TabBarScroll = styled.div({
  display: "flex",
  overflowX: "auto",
  padding: px(10, 16),
  gap: px(8),
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" }
});

const tabPillBase = css(buttonReset, {
  flexShrink: 0,
  padding: px(7, 16),
  borderRadius: px(999),
  fontSize: px(13),
  fontWeight: 500,
  whiteSpace: "nowrap",
  transition: "background 0.15s ease, color 0.15s ease",
  border: `1.5px solid transparent`
});

export const TabPill = styled.button<{ active: boolean }>(
  tabPillBase,
  ({ active }) =>
    active
      ? {
          background: THEME_COLOR.ACCENT,
          color: THEME_COLOR.WHITE
        }
      : {
          background: THEME_COLOR.SURFACE,
          color: THEME_COLOR.TEXT_SUB,
          border: `1.5px solid ${THEME_COLOR.BORDER}`,
          "&:hover": {
            borderColor: THEME_COLOR.ACCENT,
            color: THEME_COLOR.ACCENT,
            background: THEME_COLOR.ACCENT_LIGHT
          }
        }
);

export const CategoryTitle = styled.h2({
  fontSize: px(13),
  fontWeight: 700,
  color: THEME_COLOR.TEXT_SUB,
  margin: px(0, 0, 12),
  textTransform: "uppercase",
  letterSpacing: "0.08em"
});

export const TagsGrid = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: px(8)
});

const tagBase = css(buttonReset, {
  position: "relative",
  padding: px(6, 12),
  borderRadius: px(20),
  fontSize: px(13),
  fontWeight: 500,
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  background: THEME_COLOR.SURFACE,
  color: THEME_COLOR.TEXT_MAIN,
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: THEME_COLOR.ACCENT,
    color: THEME_COLOR.ACCENT,
    background: THEME_COLOR.ACCENT_LIGHT
  }
});

const tagSelected = css({
  background: THEME_COLOR.ACCENT,
  borderColor: THEME_COLOR.ACCENT,
  color: THEME_COLOR.WHITE,
  "&:hover": {
    background: THEME_COLOR.ACCENT_HOVER,
    borderColor: THEME_COLOR.ACCENT_HOVER,
    color: THEME_COLOR.WHITE
  }
});

export const Tag = styled.button<{ selected: boolean }>(
  tagBase,
  ({ selected }) => (selected ? tagSelected : {})
);

export const TooltipWrapper = styled.div({
  position: "relative",
  display: "inline-block"
});

export const Tooltip = styled.div({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%)",
  background: THEME_COLOR.TOOLTIP_BG,
  color: THEME_COLOR.TOOLTIP_TEXT,
  borderRadius: px(8),
  padding: px(10, 12),
  width: px(220),
  zIndex: 100,
  pointerEvents: "none",
  boxShadow: `0 4px 16px ${THEME_COLOR.SHADOW_SM}`,
  "&::after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    borderWidth: px(6),
    borderStyle: "solid",
    borderColor: `${THEME_COLOR.TOOLTIP_BG} transparent transparent transparent`
  }
});

export const TooltipValue = styled.div({
  fontSize: px(11),
  color: THEME_COLOR.TOOLTIP_VALUE,
  fontFamily: "monospace",
  marginBottom: px(4),
  wordBreak: "break-word"
});

export const TooltipDesc = styled.div({
  fontSize: px(12),
  lineHeight: 1.5
});

export const Overlay = styled.div({
  position: "fixed",
  inset: 0,
  background: THEME_COLOR.BLACK_OVERLAY,
  zIndex: 300,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  "@media (min-width: 600px)": {
    alignItems: "center"
  }
});

export const PopupPanel = styled.div({
  background: THEME_COLOR.SURFACE,
  borderRadius: px(16, 16, 0, 0),
  padding: px(24),
  width: "100%",
  maxWidth: px(600),
  maxHeight: "80vh",
  overflowY: "auto",
  "@media (min-width: 600px)": {
    borderRadius: px(16),
    margin: px(16)
  }
});

export const PopupHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: px(16)
});

export const PopupTitle = styled.div({
  fontSize: px(14),
  fontWeight: 700,
  color: THEME_COLOR.TEXT_MAIN
});

export const PopupClose = styled.button(buttonReset, {
  width: px(32),
  height: px(32),
  borderRadius: "50%",
  background: THEME_COLOR.BG,
  color: THEME_COLOR.TEXT_SUB,
  fontSize: px(18),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": { background: THEME_COLOR.BORDER }
});
