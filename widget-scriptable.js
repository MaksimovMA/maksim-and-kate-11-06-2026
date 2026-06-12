// Виджет «Мы вместе» для iOS-приложения Scriptable (scriptable.app)
//
// Установка:
// 1. Установите бесплатное приложение Scriptable из App Store
// 2. Создайте в нём новый скрипт и вставьте этот код целиком
// 3. Назовите скрипт «Мы вместе»
// 4. На главном экране: долгое нажатие → «+» → Scriptable →
//    выберите размер (маленький или средний) → в настройках виджета
//    Script = «Мы вместе»

const START = new Date(2026, 5, 11); // 11 июня 2026
const DAY = 86400000;

const GOLD = new Color("#d6b27c");
const GOLD_SOFT = new Color("#e9d3ae");
const GOLD_DIM = new Color("#d6b27c", 0.55);
const INK = new Color("#f5efe6");
const INK_DIM = new Color("#f5efe6", 0.6);

function plural(n, one, few, many) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}

const now = new Date();
const days = Math.max(0, Math.floor((now - START) / DAY));

// ближайшая веха
function addDays(d, n) { return new Date(d.getTime() + n * DAY); }
function addMonths(d, n) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; }

const milestones = [
  { date: addDays(START, 100), title: "100 дней" },
  { date: addMonths(START, 6), title: "полгода" },
  { date: addDays(START, 365), title: "1 год" },
  { date: addDays(START, 500), title: "500 дней" },
  { date: addDays(START, 1000), title: "1000 дней" }
];
for (let y = 2; y <= 50; y++) {
  milestones.push({ date: addMonths(START, 12 * y), title: `${y} ${plural(y, "год", "года", "лет")}` });
}
milestones.sort((a, b) => a.date - b.date);
const next = milestones.find(m => m.date > now);
const left = Math.ceil((next.date - now) / DAY);

// ---------- виджет ----------
const w = new ListWidget();
w.backgroundGradient = (() => {
  const g = new LinearGradient();
  g.colors = [new Color("#1d0b14"), new Color("#2b1020"), new Color("#14080e")];
  g.locations = [0, 0.5, 1];
  g.startPoint = new Point(0, 0);
  g.endPoint = new Point(1, 1);
  return g;
})();
w.setPadding(14, 16, 14, 16);

const isSmall = config.widgetFamily === "small" || config.widgetFamily == null;

const title = w.addText("Мы вместе");
title.font = Font.italicSystemFont(isSmall ? 15 : 18);
title.textColor = GOLD_SOFT;
title.centerAlignText();

w.addSpacer(4);

const heart = w.addText("♡");
heart.font = Font.lightSystemFont(isSmall ? 12 : 14);
heart.textColor = GOLD;
heart.centerAlignText();

w.addSpacer();

const num = w.addText(String(days));
num.font = new Font("Times New Roman", isSmall ? 34 : 44);
num.textColor = INK;
num.centerAlignText();
num.minimumScaleFactor = 0.5;

const unit = w.addText(plural(days, "день", "дня", "дней").toUpperCase());
unit.font = Font.lightSystemFont(isSmall ? 9 : 10);
unit.textColor = GOLD_DIM;
unit.centerAlignText();

w.addSpacer();

const ms = w.addText(`до «${next.title}» — ${left} ${plural(left, "день", "дня", "дней")}`);
ms.font = Font.lightSystemFont(isSmall ? 9 : 11);
ms.textColor = INK_DIM;
ms.centerAlignText();
ms.minimumScaleFactor = 0.7;

// открывать сайт по тапу
w.url = "https://maksimovma.github.io/maksim-and-kate-11-06-2026/";

// обновляться после полуночи
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 5, 0, 0);
w.refreshAfterDate = tomorrow;

if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  w.presentSmall();
}
Script.complete();
