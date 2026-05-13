export type Material =
  | "透明水彩"
  | "アクリル"
  | "油絵"
  | "オイルパステル"
  | "色鉛筆"
  | "ペン画"
  | "鉛筆"
  | "デジタル"
  | "コラージュ"
  | "その他";

export type FrameStyle = "blank" | "wood" | "mat" | "black" | "museum";

export type ReactionType = "color" | "line" | "view";

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
};

export type Theme = {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
};

export type Artwork = {
  id: string;
  user_id: string;
  theme_id: string;
  image_url: string;
  material: Material;
  note: string | null;
  frame_style: FrameStyle;
  created_at: string;
  profiles?: Pick<Profile, "id" | "username" | "display_name"> | null;
  themes?: Pick<Theme, "id" | "title" | "date"> | null;
};

export type ArtworkStats = {
  total: number;
  streak: number;
};

export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageAdjustments = {
  brightness: number;
  contrast: number;
  saturation: number;
};
