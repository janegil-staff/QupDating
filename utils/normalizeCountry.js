import { createRequire } from "module";
const require = createRequire(import.meta.url);

import countries from "i18n-iso-countries";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/no.json"));

export function normalizeCountry(name) {
  if (!name) return null;

  let code = countries.getAlpha2Code(name, "en");
  if (!code) code = countries.getAlpha2Code(name, "no");
  if (!code) code = countries.getAlpha2Code(name.toUpperCase(), "en");

  return code || null;
}
