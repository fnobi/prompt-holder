import { type Metadata } from "next";
import makeMetadata from "~/common/lib/makeMetadata";
import { PAGE_TOP } from "~/features/lib/page-path";
import ASSETS_OGP from "~/assets/meta/ogp.png";
import ASSETS_ICON from "~/assets/meta/icon_prompt-holder.png";

const DEFAULT_TITLE = "prompt-holder";
const DEFAULT_DESCRIPTION =
  "AI画像・動画生成用のプロンプトをカテゴリから選んで組み合わせるプロンプトビルダー。アートスタイル・構図・ライティングなど豊富なプリセットからワンクリックでプロンプトを構築し、お気に入りを保存できます。";
const DEFAULT_KEYWORDS = [
  "AIプロンプト",
  "プロンプトビルダー",
  "AI画像生成",
  "画像生成AI",
  "動画生成",
  "Stable Diffusion",
  "Midjourney",
  "プロンプト作成"
];

const makePageMetaTitle = (...pageTitle: string[]) =>
  [...pageTitle, DEFAULT_TITLE].join(" | ");

export const defaultMetadata: Metadata = makeMetadata({
  page: PAGE_TOP,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  shareImageAsset: ASSETS_OGP,
  keywords: DEFAULT_KEYWORDS,
  faviconUrl: ASSETS_ICON.src,
  appleIconUrl: ASSETS_ICON.src
});

export const makeSubPageMetadata = ({
  subPageTitle,
  title,
  ...rest
}: Parameters<typeof makeMetadata>[0] & {
  subPageTitle?: string;
}) => {
  return makeMetadata({
    ...rest,
    title: subPageTitle ? makePageMetaTitle(subPageTitle) : title
  });
};
