const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const THEME_SWITCH_HOUR_JST = 5;

function getJstShiftedDate(now: Date) {
  return new Date(now.getTime() + JST_OFFSET_MS);
}

function toDateKeyFromJstShifted(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, month, day };
}

function jstLocalTimeToInstant(year: number, month: number, day: number, hour: number) {
  return new Date(Date.UTC(year, month - 1, day, hour - 9, 0, 0, 0));
}

export function getJstNow(): Date {
  return new Date();
}

export function getThemeDateJST(now: Date = getJstNow()): string {
  const jst = getJstShiftedDate(now);

  if (jst.getUTCHours() < THEME_SWITCH_HOUR_JST) {
    jst.setUTCDate(jst.getUTCDate() - 1);
  }

  return toDateKeyFromJstShifted(jst);
}

export function getThemeDeadlineJST(now: Date = getJstNow()): Date {
  const themeDate = getThemeDateJST(now);
  const { year, month, day } = parseDateKey(themeDate);
  return jstLocalTimeToInstant(year, month, day + 1, THEME_SWITCH_HOUR_JST);
}

export function getNextThemeOpenText(_now: Date = getJstNow()): string {
  return "新しいテーマは、毎朝5:00に切り替わります。";
}

export function getRemainingTime(
  now: Date = getJstNow()
): { hours: number; minutes: number; isAlmostClosed: boolean } {
  const deadline = getThemeDeadlineJST(now);
  const remainingMs = Math.max(0, deadline.getTime() - now.getTime());
  const totalMinutes = Math.ceil(remainingMs / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours,
    minutes,
    isAlmostClosed: remainingMs < 2 * 60 * 60 * 1000
  };
}

export function getRemainingTimeText(now: Date = getJstNow()): string {
  const remaining = getRemainingTime(now);

  if (remaining.hours === 0 && remaining.minutes === 0) {
    return "新しいテーマがひらきます。";
  }

  if (remaining.isAlmostClosed) {
    return "今日の展示は、もうすぐ閉じます。描けそうなら、一枚だけ。";
  }

  return `残り ${remaining.hours}時間${String(remaining.minutes).padStart(2, "0")}分`;
}

export function getThemeDeadlineDisplayText(now: Date = getJstNow()): string {
  const displayDeadline = new Date(getThemeDeadlineJST(now).getTime() - 60 * 1000);
  const text = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false
  }).format(displayDeadline);

  return `${text}まで飾れます`;
}
