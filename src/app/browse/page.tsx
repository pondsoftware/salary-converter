import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browse All Salary Conversions — Salary Converter",
  description:
    "Explore 180+ salary conversion pages: hourly-to-salary rates, salary-to-hourly breakdowns, cost of living by US city, salary in foreign currencies, and purchasing power by country.",
  alternates: {
    canonical: "/browse",
  },
};

const HOURLY_RATES = [
  7.25, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 32, 35, 38, 40, 42, 45, 48, 50, 55, 60, 65, 70, 75, 80,
  85, 90, 95, 100,
];

const SALARY_AMOUNTS = [
  25000, 30000, 35000, 40000, 42000, 45000, 48000, 50000, 52000, 55000, 58000,
  60000, 62000, 65000, 68000, 70000, 72000, 75000, 78000, 80000, 82000, 85000,
  88000, 90000, 92000, 95000, 100000, 110000, 120000, 130000, 140000, 150000,
  175000, 200000, 250000,
];

const CITIES = [
  { name: "San Francisco, CA", slug: "san-francisco" },
  { name: "New York City, NY", slug: "new-york-city" },
  { name: "Los Angeles, CA", slug: "los-angeles" },
  { name: "Seattle, WA", slug: "seattle" },
  { name: "Boston, MA", slug: "boston" },
  { name: "Washington, DC", slug: "washington-dc" },
  { name: "Denver, CO", slug: "denver" },
  { name: "Austin, TX", slug: "austin" },
  { name: "Chicago, IL", slug: "chicago" },
  { name: "Miami, FL", slug: "miami" },
  { name: "Atlanta, GA", slug: "atlanta" },
  { name: "Phoenix, AZ", slug: "phoenix" },
  { name: "Dallas-Fort Worth, TX", slug: "dallas-fort-worth" },
  { name: "Houston, TX", slug: "houston" },
  { name: "Minneapolis, MN", slug: "minneapolis" },
  { name: "Nashville, TN", slug: "nashville" },
  { name: "Raleigh, NC", slug: "raleigh" },
  { name: "Salt Lake City, UT", slug: "salt-lake-city" },
  { name: "Kansas City, MO", slug: "kansas-city" },
  { name: "Indianapolis, IN", slug: "indianapolis" },
  { name: "Columbus, OH", slug: "columbus" },
  { name: "San Antonio, TX", slug: "san-antonio" },
  { name: "Pittsburgh, PA", slug: "pittsburgh" },
  { name: "Oklahoma City, OK", slug: "oklahoma-city" },
  { name: "Memphis, TN", slug: "memphis" },
  { name: "Portland, OR", slug: "portland" },
  { name: "Charlotte, NC", slug: "charlotte" },
  { name: "Jacksonville, FL", slug: "jacksonville" },
  { name: "Fort Worth, TX", slug: "fort-worth" },
  { name: "Milwaukee, WI", slug: "milwaukee" },
  { name: "Baltimore, MD", slug: "baltimore" },
  { name: "Louisville, KY", slug: "louisville" },
  { name: "Las Vegas, NV", slug: "las-vegas" },
  { name: "Tucson, AZ", slug: "tucson" },
  { name: "Fresno, CA", slug: "fresno" },
  { name: "Sacramento, CA", slug: "sacramento" },
  { name: "Mesa, AZ", slug: "mesa" },
  { name: "Omaha, NE", slug: "omaha" },
  { name: "Cleveland, OH", slug: "cleveland" },
  { name: "Tampa, FL", slug: "tampa" },
  { name: "New Orleans, LA", slug: "new-orleans" },
  { name: "Cincinnati, OH", slug: "cincinnati" },
  { name: "St. Louis, MO", slug: "st-louis" },
  { name: "Orlando, FL", slug: "orlando" },
];

const CURRENCIES = [
  { code: "EUR", slug: "eur", name: "Euro" },
  { code: "GBP", slug: "gbp", name: "British Pound" },
  { code: "CAD", slug: "cad", name: "Canadian Dollar" },
  { code: "AUD", slug: "aud", name: "Australian Dollar" },
  { code: "JPY", slug: "jpy", name: "Japanese Yen" },
  { code: "CHF", slug: "chf", name: "Swiss Franc" },
  { code: "INR", slug: "inr", name: "Indian Rupee" },
  { code: "MXN", slug: "mxn", name: "Mexican Peso" },
  { code: "BRL", slug: "brl", name: "Brazilian Real" },
  { code: "CNY", slug: "cny", name: "Chinese Yuan" },
  { code: "KRW", slug: "krw", name: "South Korean Won" },
  { code: "SEK", slug: "sek", name: "Swedish Krona" },
  { code: "THB", slug: "thb", name: "Thai Baht" },
  { code: "VND", slug: "vnd", name: "Vietnamese Dong" },
  { code: "TRY", slug: "try", name: "Turkish Lira" },
  { code: "PLN", slug: "pln", name: "Polish Zloty" },
  { code: "CZK", slug: "czk", name: "Czech Koruna" },
  { code: "HUF", slug: "huf", name: "Hungarian Forint" },
  { code: "ILS", slug: "ils", name: "Israeli Shekel" },
  { code: "ZAR", slug: "zar", name: "South African Rand" },
  { code: "NGN", slug: "ngn", name: "Nigerian Naira" },
  { code: "EGP", slug: "egp", name: "Egyptian Pound" },
  { code: "COP", slug: "cop", name: "Colombian Peso" },
  { code: "CLP", slug: "clp", name: "Chilean Peso" },
  { code: "PEN", slug: "pen", name: "Peruvian Sol" },
];

const COUNTRIES = [
  { name: "Switzerland", slug: "switzerland" },
  { name: "Norway", slug: "norway" },
  { name: "Denmark", slug: "denmark" },
  { name: "Australia", slug: "australia" },
  { name: "Ireland", slug: "ireland" },
  { name: "Finland", slug: "finland" },
  { name: "Belgium", slug: "belgium" },
  { name: "Austria", slug: "austria" },
  { name: "United Kingdom", slug: "united-kingdom" },
  { name: "Canada", slug: "canada" },
  { name: "Germany", slug: "germany" },
  { name: "France", slug: "france" },
  { name: "Israel", slug: "israel" },
  { name: "Japan", slug: "japan" },
  { name: "South Korea", slug: "south-korea" },
  { name: "Spain", slug: "spain" },
  { name: "Greece", slug: "greece" },
  { name: "Czech Republic", slug: "czech-republic" },
  { name: "Portugal", slug: "portugal" },
  { name: "Poland", slug: "poland" },
  { name: "Hungary", slug: "hungary" },
  { name: "Turkey", slug: "turkey" },
  { name: "Chile", slug: "chile" },
  { name: "Mexico", slug: "mexico" },
  { name: "Brazil", slug: "brazil" },
  { name: "South Africa", slug: "south-africa" },
  { name: "Thailand", slug: "thailand" },
  { name: "Peru", slug: "peru" },
  { name: "Colombia", slug: "colombia" },
  { name: "Philippines", slug: "philippines" },
  { name: "India", slug: "india" },
  { name: "Egypt", slug: "egypt" },
  { name: "Vietnam", slug: "vietnam" },
  { name: "Nigeria", slug: "nigeria" },
];

function formatSalary(amount: number): string {
  return amount.toLocaleString("en-US");
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://salaryconverter.net",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Browse All",
      item: "https://salaryconverter.net/browse",
    },
  ],
};

export default function BrowsePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="text-green-700 hover:underline">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span>Browse All</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Browse All Salary Conversions
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore 180+ pages covering hourly-to-salary conversions,
            salary-to-hourly breakdowns, cost of living comparisons, currency
            conversions, and purchasing power across the globe.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 transition"
          >
            Open Salary Calculator
          </Link>
        </div>

        {/* Hourly to Salary */}
        <section id="hourly-to-salary" className="mb-12 scroll-mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Hourly to Salary
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {HOURLY_RATES.length} hourly rates converted to annual salary
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {HOURLY_RATES.map((rate) => (
              <Link
                key={rate}
                href={`/hourly-to-salary/${rate}`}
                className="block rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition text-center"
              >
                ${rate}/hour
              </Link>
            ))}
          </div>
        </section>

        {/* Salary to Hourly */}
        <section id="salary-to-hourly" className="mb-12 scroll-mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Salary to Hourly
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {SALARY_AMOUNTS.length} annual salaries converted to hourly rate
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {SALARY_AMOUNTS.map((amount) => (
              <Link
                key={amount}
                href={`/salary-to-hourly/${amount}`}
                className="block rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition text-center"
              >
                ${formatSalary(amount)} salary
              </Link>
            ))}
          </div>
        </section>

        {/* Cost of Living by City */}
        <section id="cost-of-living" className="mb-12 scroll-mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Cost of Living by City
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {CITIES.length} US metro areas compared by cost of living
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/cost-of-living/${city.slug}`}
                className="block rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition text-center"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Salary in Foreign Currencies */}
        <section id="foreign-currencies" className="mb-12 scroll-mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Salary in Foreign Currencies
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {CURRENCIES.length} currencies with USD salary equivalents
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {CURRENCIES.map((currency) => (
              <Link
                key={currency.slug}
                href={`/salary-in/${currency.slug}`}
                className="block rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition text-center"
              >
                {currency.name} ({currency.code})
              </Link>
            ))}
          </div>
        </section>

        {/* Purchasing Power by Country */}
        <section id="purchasing-power" className="mb-12 scroll-mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Purchasing Power by Country
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {COUNTRIES.length} countries compared by purchasing power parity
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {COUNTRIES.map((country) => (
              <Link
                key={country.slug}
                href={`/purchasing-power/${country.slug}`}
                className="block rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition text-center"
              >
                {country.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
