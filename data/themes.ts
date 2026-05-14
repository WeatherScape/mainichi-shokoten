export type DailyTheme = {
  id: string;
  title: string;
  description: string;
  category: "still-life" | "daily-life" | "memory" | "weather" | "place" | "feeling";
  promptHint: string;
};

export const DAILY_THEMES: DailyTheme[] = [
  {
    id: "coffee-cup",
    title: "コーヒーカップ",
    description: "手の中のあたたかさや、朝の影を描いてみましょう。",
    category: "still-life",
    promptHint: "持ち手、影、飲み口の形に目を向ける"
  },
  {
    id: "key",
    title: "鍵",
    description: "小さな金属の形や、持ち歩いてきた時間を描いてみましょう。",
    category: "daily-life",
    promptHint: "光る部分、傷、輪の形を見る"
  },
  {
    id: "white-flower",
    title: "白い花",
    description: "白の中にある色や、花びらの影をそっと見つけてみましょう。",
    category: "still-life",
    promptHint: "白を塗りつぶさず、周りの色で浮かせる"
  },
  {
    id: "window-side",
    title: "窓辺",
    description: "窓の近くに落ちる光や、外との距離を描いてみましょう。",
    category: "place",
    promptHint: "窓枠、光、置かれたものの関係を見る"
  },
  {
    id: "desk",
    title: "机の上",
    description: "いつもの机にある形や散らかり方を、そのまま置いてみましょう。",
    category: "daily-life",
    promptHint: "よく使うものを一つだけ選ぶ"
  },
  {
    id: "rainy-day",
    title: "雨の日",
    description: "濡れた色、曇った光、静かな音を思い出して描いてみましょう。",
    category: "weather",
    promptHint: "窓、傘、地面の反射を探す"
  },
  {
    id: "apple",
    title: "りんご",
    description: "丸さだけでなく、色むらや置かれた影を見てみましょう。",
    category: "still-life",
    promptHint: "赤以外の色を三つ探す"
  },
  {
    id: "shoes",
    title: "靴",
    description: "歩いてきたあとや、ひも、底の形を描いてみましょう。",
    category: "daily-life",
    promptHint: "片方だけでもよい"
  },
  {
    id: "clear-glass",
    title: "透明なコップ",
    description: "透明なものを、輪郭や反射で描いてみましょう。",
    category: "still-life",
    promptHint: "水の線、反射、奥のゆがみを見る"
  },
  {
    id: "book",
    title: "本",
    description: "表紙、紙の厚み、読みかけの気配を描いてみましょう。",
    category: "daily-life",
    promptHint: "開いた本でも閉じた本でもよい"
  },
  {
    id: "earphones",
    title: "イヤホン",
    description: "線の絡まりや、小さな光をゆっくり追ってみましょう。",
    category: "daily-life",
    promptHint: "線だけで描いてもよい"
  },
  {
    id: "breakfast",
    title: "朝ごはん",
    description: "食べる前、食べたあと、どちらの朝でも描いてみましょう。",
    category: "daily-life",
    promptHint: "皿の余白や湯気を見る"
  },
  {
    id: "umbrella",
    title: "傘",
    description: "骨の線や布の広がりを、好きな角度から描いてみましょう。",
    category: "weather",
    promptHint: "たたんだ傘でもよい"
  },
  {
    id: "way-home",
    title: "帰り道",
    description: "今日見た道の色や、暮れていく光を思い出してみましょう。",
    category: "memory",
    promptHint: "実景でなく記憶の線でもよい"
  },
  {
    id: "vase",
    title: "花瓶",
    description: "入れ物の形と、そこにある静けさを描いてみましょう。",
    category: "still-life",
    promptHint: "花がなくてもよい"
  },
  {
    id: "shadow",
    title: "影",
    description: "ものではなく、影そのものを主役にしてみましょう。",
    category: "feeling",
    promptHint: "薄い影、濃い影、ぼやけた端を見る"
  },
  {
    id: "blue-thing",
    title: "青いもの",
    description: "身の回りの青をひとつ選んで描いてみましょう。",
    category: "still-life",
    promptHint: "青の中にある灰色や緑を見る"
  },
  {
    id: "small-box",
    title: "小さな箱",
    description: "角、ふた、影。小さな形をゆっくり見てみましょう。",
    category: "still-life",
    promptHint: "中身は描かなくてもよい"
  },
  {
    id: "convenience-store-item",
    title: "コンビニで買ったもの",
    description: "身近なものを、今日の記録として描いてみましょう。",
    category: "daily-life",
    promptHint: "包装の文字は省略してもよい"
  },
  {
    id: "hand",
    title: "手",
    description: "形が難しくても大丈夫。線や影だけ追ってみましょう。",
    category: "still-life",
    promptHint: "指一本だけでもよい"
  },
  {
    id: "desk-edge",
    title: "机の端",
    description: "普段見過ごしている端っこを、少しだけ主役にしてみましょう。",
    category: "place",
    promptHint: "角、影、落ちそうなものを見る"
  },
  {
    id: "old-thing",
    title: "古いもの",
    description: "長く使ってきた跡や、少し変わった色を描いてみましょう。",
    category: "memory",
    promptHint: "傷や色あせを見つける"
  },
  {
    id: "warm-thing",
    title: "あたたかいもの",
    description: "温度そのものを、色や線で置いてみましょう。",
    category: "feeling",
    promptHint: "湯気、布、手触りを思い出す"
  },
  {
    id: "sleepy-morning",
    title: "眠い朝",
    description: "ぼんやりした輪郭や、まだ起ききらない色を描いてみましょう。",
    category: "feeling",
    promptHint: "はっきり描かなくてもよい"
  },
  {
    id: "still-used",
    title: "まだ使っているもの",
    description: "買い替えていない理由や、手になじんだ形を描いてみましょう。",
    category: "memory",
    promptHint: "使い込んだ跡を見る"
  },
  {
    id: "white-plate",
    title: "白い皿",
    description: "白い面の中にある影や反射を見つけてみましょう。",
    category: "still-life",
    promptHint: "皿のふちをゆっくり追う"
  },
  {
    id: "inside-bag",
    title: "カバンの中",
    description: "中に入っているものを、今日の小さな風景として描いてみましょう。",
    category: "daily-life",
    promptHint: "全部描かず、一部分だけでもよい"
  },
  {
    id: "outside-window",
    title: "窓の外",
    description: "見えるものだけでなく、距離や空気も描いてみましょう。",
    category: "place",
    promptHint: "遠くをぼかしてもよい"
  },
  {
    id: "today-drink",
    title: "今日の飲み物",
    description: "色、容器、置いた場所を今日の一枚にしてみましょう。",
    category: "daily-life",
    promptHint: "飲みかけでもよい"
  },
  {
    id: "do-not-lose",
    title: "なくしたくないもの",
    description: "大事さを説明せず、形や色だけで置いてみましょう。",
    category: "memory",
    promptHint: "実物でも記憶でもよい"
  }
];

export function getDailyThemeByDate(dateKey: string) {
  return DAILY_THEMES[getDailyThemeIndex(dateKey)];
}

export function getDailyThemeIndex(dateKey: string) {
  const base = Date.UTC(2026, 0, 1);
  const current = Date.parse(`${dateKey}T00:00:00.000Z`);
  const dayIndex = Math.floor((current - base) / (24 * 60 * 60 * 1000));
  return ((dayIndex % DAILY_THEMES.length) + DAILY_THEMES.length) % DAILY_THEMES.length;
}
