import { Metadata } from "next";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";

const CURRENCIES = [
  { code: "EUR", slug: "eur", name: "Euro", symbol: "\u20ac", rate: 0.92 },
  { code: "GBP", slug: "gbp", name: "British Pound", symbol: "\u00a3", rate: 0.79 },
  { code: "CAD", slug: "cad", name: "Canadian Dollar", symbol: "C$", rate: 1.38 },
  { code: "AUD", slug: "aud", name: "Australian Dollar", symbol: "A$", rate: 1.55 },
  { code: "JPY", slug: "jpy", name: "Japanese Yen", symbol: "\u00a5", rate: 154.5 },
  { code: "CHF", slug: "chf", name: "Swiss Franc", symbol: "CHF ", rate: 0.88 },
  { code: "INR", slug: "inr", name: "Indian Rupee", symbol: "\u20b9", rate: 83.5 },
  { code: "MXN", slug: "mxn", name: "Mexican Peso", symbol: "MX$", rate: 17.15 },
  { code: "BRL", slug: "brl", name: "Brazilian Real", symbol: "R$", rate: 4.97 },
  { code: "CNY", slug: "cny", name: "Chinese Yuan", symbol: "\u00a5", rate: 7.24 },
  { code: "KRW", slug: "krw", name: "South Korean Won", symbol: "\u20a9", rate: 1345 },
  { code: "SEK", slug: "sek", name: "Swedish Krona", symbol: "kr ", rate: 10.65 },
];

const USD_SALARIES = [25000, 30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000];

function formatForeignCurrency(value: number, symbol: string, code: string): string {
  if (code === "JPY" || code === "KRW") {
    return `${symbol}${formatNumber(Math.round(value))}`;
  }
  return `${symbol}${formatNumber(value, 2)}`;
}

function getReverseAmounts(rate: number): number[] {
  // Pick sensible round numbers in the target currency for reverse conversion
  if (rate >= 100) {
    return [1000000, 2000000, 5000000, 10000000, 15000000, 20000000];
  } else if (rate >= 10) {
    return [100000, 250000, 500000, 750000, 1000000, 1500000];
  } else if (rate >= 1) {
    return [25000, 50000, 75000, 100000, 150000, 200000];
  } else {
    return [20000, 30000, 50000, 75000, 100000, 150000];
  }
}

export function generateStaticParams() {
  return CURRENCIES.map((c) => ({ currency: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ currency: string }>;
}): Promise<Metadata> {
  const { currency } = await params;
  const curr = CURRENCIES.find((c) => c.slug === currency)!;
  const converted = 60000 * curr.rate;
  const formattedAmount = curr.code === "JPY" || curr.code === "KRW"
    ? formatNumber(Math.round(converted))
    : formatNumber(converted, 2);

  return {
    title: `USD to ${curr.code} Salary Converter \u2014 ${curr.name} Salary Calculator`,
    description: `Convert USD salaries to ${curr.name} (${curr.code}). $60,000 USD = ${curr.symbol}${formattedAmount} ${curr.code}. See hourly, monthly, and annual salary conversions.`,
  };
}

export default async function SalaryInCurrencyPage({
  params,
}: {
  params: Promise<{ currency: string }>;
}) {
  const { currency } = await params;
  const curr = CURRENCIES.find((c) => c.slug === currency)!;
  const converted60k = 60000 * curr.rate;

  const faqs = [
    {
      question: `How much is a $60,000 USD salary in ${curr.name}?`,
      answer: `At an exchange rate of 1 USD = ${curr.rate} ${curr.code}, a $60,000 USD annual salary equals ${formatForeignCurrency(converted60k, curr.symbol, curr.code)} ${curr.code} per year, or ${formatForeignCurrency(converted60k / 12, curr.symbol, curr.code)} per month.`,
    },
    {
      question: `What is the current USD to ${curr.code} exchange rate?`,
      answer: `The approximate exchange rate used here is 1 USD = ${curr.rate} ${curr.code}. Exchange rates fluctuate daily, so check current rates for precise conversions.`,
    },
    {
      question: `How do I convert my USD salary to ${curr.name}?`,
      answer: `Multiply your USD salary by the exchange rate (${curr.rate}). For example, $100,000 USD \u00d7 ${curr.rate} = ${formatForeignCurrency(100000 * curr.rate, curr.symbol, curr.code)} ${curr.code} per year.`,
    },
    {
      question: `What is the hourly rate for a $50,000 USD salary in ${curr.code}?`,
      answer: `A $50,000 USD salary equals approximately $24.04 USD per hour. In ${curr.name}, that's ${formatForeignCurrency(50000 * curr.rate / 2080, curr.symbol, curr.code)} ${curr.code} per hour (based on 2,080 working hours per year).`,
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Salary Converter",
        item: "https://salaryconverter.net",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Salary In",
        item: "https://salaryconverter.net/salary-in",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${curr.name} (${curr.code})`,
        item: `https://salaryconverter.net/salary-in/${curr.slug}`,
      },
    ],
  };

  const reverseAmounts = getReverseAmounts(curr.rate);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Salary Converter
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Salary In</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{curr.name} ({curr.code})</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Salary in {curr.name} ({curr.code}) — USD to {curr.code} Conversion
        </h1>

        {/* Quick Answer Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-lg text-blue-900 font-semibold">
            1 USD = {curr.rate} {curr.code}
          </p>
          <p className="text-sm text-blue-700 mt-2">
            A $60,000 USD salary equals {formatForeignCurrency(converted60k, curr.symbol, curr.code)} {curr.code} per year.
          </p>
        </div>

        {/* Conversion Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
            USD to {curr.code} Salary Conversion Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">USD Annual</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">{curr.code} Annual</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">{curr.code} Monthly</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">{curr.code} Hourly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {USD_SALARIES.map((salary) => {
                  const annual = salary * curr.rate;
                  const monthly = annual / 12;
                  const hourly = annual / 2080;
                  return (
                    <tr key={salary}>
                      <td className="px-6 py-3 text-gray-900">{formatCurrency(salary)}</td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900">
                        {formatForeignCurrency(annual, curr.symbol, curr.code)}
                      </td>
                      <td className="px-6 py-3 text-right text-gray-700">
                        {formatForeignCurrency(monthly, curr.symbol, curr.code)}
                      </td>
                      <td className="px-6 py-3 text-right text-gray-700">
                        {formatForeignCurrency(hourly, curr.symbol, curr.code)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reverse Conversion */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
            {curr.code} to USD — Reverse Conversion
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    {curr.code} Salary
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    USD Equivalent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reverseAmounts.map((amount) => (
                  <tr key={amount}>
                    <td className="px-6 py-3 text-gray-900">
                      {formatForeignCurrency(amount, curr.symbol, curr.code)}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(Math.round(amount / curr.rate))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Use the Full Salary Converter
          </Link>
        </div>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
    </>
  );
}
