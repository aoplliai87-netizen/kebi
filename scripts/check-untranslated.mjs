import fs from "node:fs";

const d = JSON.parse(fs.readFileSync(new URL("./booking-descriptors.json", import.meta.url), "utf8"));
const txt = fs.readFileSync(new URL("../src/lib/booking-region-ja-zh.ts", import.meta.url), "utf8");

for (const x of d) {
  const esc = x.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`"${esc}"\\s*:\\s*\\{\\s*ja:\\s*"([^"]+)"`);
  const m = txt.match(re);
  if (m && m[1] === x.nameEn) console.log(x.slug);
}
