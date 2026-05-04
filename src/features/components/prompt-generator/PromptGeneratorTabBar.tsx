import {
  TabBarOuter,
  TabBarScroll,
  TabPill
} from "~/features/components/prompt-generator/PromptGeneratorShared";

export type PromptGeneratorTab = { id: string; label: string };

type PromptGeneratorTabBarProps = {
  tabs: PromptGeneratorTab[];
  activeTab: string;
  onChange: (id: string) => void;
};

const PromptGeneratorTabBar = ({
  tabs,
  activeTab,
  onChange
}: PromptGeneratorTabBarProps) => (
  <TabBarOuter>
    <TabBarScroll>
      {tabs.map(tab => (
        <TabPill
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          {tab.label}
        </TabPill>
      ))}
    </TabBarScroll>
  </TabBarOuter>
);

export default PromptGeneratorTabBar;
