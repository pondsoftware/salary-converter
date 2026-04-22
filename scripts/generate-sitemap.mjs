import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// Read all dynamic route files to extract their parameters directly from source.
// This ensures the sitemap always matches what generateStaticParams produces.

function extractArrayFromSource(source, varName) {
  // Matches: const VARNAME = [ ... ];
  const regex = new RegExp(
    `(?:const|let|var)\\s+${varName}\\s*=\\s*\\[([\\s\\S]*?)\\];`
  );
  const match = source.match(regex);
  if (!match) return null;
  return match[1];
}

function extractNumbers(arrayContent) {
  return [...arrayContent.matchAll(/[\d.]+/g)].map((m) => parseFloat(m[0]));
}

function extractSlugs(arrayContent) {
  return [...arrayContent.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

// --- Hourly to Salary ---
const hourlySource = readFileSync(
  resolve(projectRoot, "src/app/hourly-to-salary/[amount]/page.tsx"),
  "utf8"
);
const hourlyArrayContent = extractArrayFromSource(hourlySource, "HOURLY_RATES");
const hourlyRates = extractNumbers(hourlyArrayContent);

// --- Salary to Hourly ---
const salarySource = readFileSync(
  resolve(projectRoot, "src/app/salary-to-hourly/[amount]/page.tsx"),
  "utf8"
);
const salaryArrayContent = extractArrayFromSource(salarySource, "SALARY_AMOUNTS");
const salaryAmounts = extractNumbers(salaryArrayContent);

// --- Cost of Living ---
const colSource = readFileSync(
  resolve(projectRoot, "src/app/cost-of-living/[city]/page.tsx"),
  "utf8"
);
const colArrayContent = extractArrayFromSource(colSource, "US_METROS");
const costOfLivingCities = extractSlugs(colArrayContent);

// --- Salary In Currency ---
const currencySource = readFileSync(
  resolve(projectRoot, "src/app/salary-in/[currency]/page.tsx"),
  "utf8"
);
const currencyArrayContent = extractArrayFromSource(currencySource, "CURRENCIES");
const salaryInCurrencies = extractSlugs(currencyArrayContent);

// --- Purchasing Power ---
const ppSource = readFileSync(
  resolve(projectRoot, "src/app/purchasing-power/[country]/page.tsx"),
  "utf8"
);
const ppArrayContent = extractArrayFromSource(ppSource, "COUNTRIES");
const purchasingPowerCountries = extractSlugs(ppArrayContent);

// Validate all data was extracted
const checks = [
  ["hourlyRates", hourlyRates],
  ["salaryAmounts", salaryAmounts],
  ["costOfLivingCities", costOfLivingCities],
  ["salaryInCurrencies", salaryInCurrencies],
  ["purchasingPowerCountries", purchasingPowerCountries],
];
for (const [name, arr] of checks) {
  if (!arr || arr.length === 0) {
    throw new Error(`Failed to extract ${name} from source files`);
  }
}

const DOMAIN = "https://salaryconverter.net";

const urls = [
  "/",
  "/browse",
  ...hourlyRates.map((rate) => `/hourly-to-salary/${rate}`),
  ...salaryAmounts.map((amount) => `/salary-to-hourly/${amount}`),
  ...costOfLivingCities.map((city) => `/cost-of-living/${city}`),
  ...salaryInCurrencies.map((currency) => `/salary-in/${currency}`),
  ...purchasingPowerCountries.map((country) => `/purchasing-power/${country}`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${DOMAIN}${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>${url === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

writeFileSync(resolve(projectRoot, "public/sitemap.xml"), sitemap);
console.log(`Sitemap generated: ${urls.length} URLs (${hourlyRates.length} hourly, ${salaryAmounts.length} salary, ${costOfLivingCities.length} cities, ${salaryInCurrencies.length} currencies, ${purchasingPowerCountries.length} countries)`);
