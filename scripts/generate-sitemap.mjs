import { writeFileSync } from "fs";

const DOMAIN = "https://salaryconverter.net";

const hourlyRates = [
  7.25, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
];

const salaryAmounts = [
  25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000,
  80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000,
  175000, 200000,
];

const costOfLivingCities = [
  "san-francisco", "new-york-city", "los-angeles", "seattle", "boston",
  "washington-dc", "denver", "austin", "chicago", "miami", "atlanta",
  "phoenix", "dallas-fort-worth", "houston", "minneapolis", "nashville",
  "raleigh", "salt-lake-city", "kansas-city", "indianapolis", "columbus",
  "san-antonio", "pittsburgh", "oklahoma-city", "memphis",
];

const salaryInCurrencies = [
  "eur", "gbp", "cad", "aud", "jpy", "chf", "inr", "mxn", "brl", "cny", "krw", "sek",
];

const purchasingPowerCountries = [
  "switzerland", "norway", "australia", "united-kingdom", "canada", "germany",
  "france", "japan", "south-korea", "spain", "portugal", "mexico", "brazil",
  "thailand", "india", "vietnam", "philippines", "colombia",
];

const urls = [
  "/",
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

writeFileSync("public/sitemap.xml", sitemap);
console.log(`Sitemap generated: ${urls.length} URLs`);
