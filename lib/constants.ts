import type { FrameStyle, Material, ReactionType } from "@/lib/types";

export const MATERIALS: Material[] = [
  "透明水彩",
  "アクリル",
  "油絵",
  "オイルパステル",
  "色鉛筆",
  "ペン画",
  "鉛筆",
  "デジタル",
  "コラージュ",
  "その他"
];

export const REACTIONS: Array<{ type: ReactionType; label: string }> = [
  { type: "color", label: "この色が好き" },
  { type: "line", label: "この線が好き" },
  { type: "view", label: "この見方が好き" }
];

export const FRAME_STYLES: Array<{
  id: FrameStyle;
  label: string;
  unlockLabel: string;
  requiredTotal?: number;
  requiredStreak?: number;
}> = [
  {
    id: "blank",
    label: "余白のみ",
    unlockLabel: "最初から使えます"
  },
  {
    id: "wood",
    label: "細い木枠",
    unlockLabel: "3作品で解放",
    requiredTotal: 3
  },
  {
    id: "mat",
    label: "白マット額",
    unlockLabel: "7日連続で解放",
    requiredStreak: 7
  },
  {
    id: "black",
    label: "黒フレーム",
    unlockLabel: "14日連続で解放",
    requiredStreak: 14
  },
  {
    id: "museum",
    label: "美術館フレーム",
    unlockLabel: "30作品で解放",
    requiredTotal: 30
  }
];

export const BADGE_RULES: Array<{
  type: string;
  label: string;
  description: string;
  requiredTotal?: number;
  requiredStreak?: number;
}> = [
  {
    type: "first_wall",
    label: "白い壁",
    description: "1作品を飾りました",
    requiredTotal: 1
  },
  {
    type: "small_frame",
    label: "小さな額縁",
    description: "3作品を飾りました",
    requiredTotal: 3
  },
  {
    type: "week_exhibition",
    label: "一週間の小個展",
    description: "7日連続で描きました",
    requiredStreak: 7
  },
  {
    type: "lighting_theme",
    label: "展示室の照明",
    description: "14日連続で描きました",
    requiredStreak: 14
  },
  {
    type: "monthly_catalog",
    label: "月間図録",
    description: "30作品を飾りました",
    requiredTotal: 30
  },
  {
    type: "material_shelf",
    label: "画材棚",
    description: "50作品を飾りました",
    requiredTotal: 50
  },
  {
    type: "hundred_room",
    label: "百枚の部屋",
    description: "100作品を飾りました",
    requiredTotal: 100
  }
];

export const DEFAULT_THEME_DESCRIPTION =
  "身近なものを、あなたの線と色でそっと見つめてみましょう。";
