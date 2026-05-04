import { type ReactNode } from "react";
import PromptGeneratorTabBar, {
  type PromptGeneratorTab
} from "~/features/components/prompt-generator/PromptGeneratorTabBar";
import {
  Body,
  Root
} from "~/features/components/prompt-generator/PromptGeneratorShared";

type PromptGeneratorLayoutProps = {
  tabs: PromptGeneratorTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
};

const PromptGeneratorLayout = ({
  tabs,
  activeTab,
  onTabChange,
  children
}: PromptGeneratorLayoutProps) => (
  <Root>
    <PromptGeneratorTabBar
      tabs={tabs}
      activeTab={activeTab}
      onChange={onTabChange}
    />
    <Body>{children}</Body>
  </Root>
);

export default PromptGeneratorLayout;
