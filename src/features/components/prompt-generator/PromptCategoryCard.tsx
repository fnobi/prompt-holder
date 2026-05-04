import { useState } from "react";
import {
  Card,
  CategoryTitle,
  Tag,
  TagsGrid,
  Tooltip,
  TooltipDesc,
  TooltipValue,
  TooltipWrapper
} from "~/features/components/prompt-generator/PromptGeneratorShared";
import {
  type PromptCategory,
  type PromptItem
} from "~/features/schema/PromptItem";

type TooltipItemProps = {
  item: PromptItem;
  selected: boolean;
  onToggle: (id: string) => void;
};

const TooltipItem = ({ item, selected, onToggle }: TooltipItemProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <TooltipWrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <Tooltip>
          <TooltipValue>{item.value}</TooltipValue>
          <TooltipDesc>{item.description}</TooltipDesc>
        </Tooltip>
      )}
      <Tag selected={selected} onClick={() => onToggle(item.id)} type="button">
        {item.label}
      </Tag>
    </TooltipWrapper>
  );
};

type PromptCategoryCardProps = {
  category: PromptCategory;
  selectedIds: string[];
  onToggle: (id: string) => void;
};

const PromptCategoryCard = ({
  category,
  selectedIds,
  onToggle
}: PromptCategoryCardProps) => (
  <Card>
    <CategoryTitle>{category.label}</CategoryTitle>
    <TagsGrid>
      {category.items.map(item => (
        <TooltipItem
          key={item.id}
          item={item}
          selected={selectedIds.includes(item.id)}
          onToggle={onToggle}
        />
      ))}
    </TagsGrid>
  </Card>
);

export default PromptCategoryCard;
