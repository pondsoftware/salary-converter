import { Metadata } from "next";
import Link from "next/link";

const HOURLY_RATES = [
  7.25, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 32, 35, 38, 40, 42, 45, 48, 50, 55, 60, 65, 70, 75, 80,
  85, 90, 95, 100,
];

export function generateStaticParams() {
  return HOURLY_RATES.map((rate) => ({ amount: String(rate) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const hourly = parseFloat(amount);
  const annual = hourly * 2080;
  const formattedHourly = hourly % 1 === 0 ? `$${hourly}` : `$${hourly.toFixed(2)}`;
  const formattedAnnual = annual.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return {
    title: `${formattedHourly} an Hour Is How Much a Year? — Salary Breakdown`,
    description: `${formattedHourly} per hour equals ${formattedAnnual} per year before taxes. See the full breakdown: daily, weekly, biweekly, monthly, and annual pay plus estimated after-tax take-home.`,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateTakeHome(annual: number) {
  // Federal tax brackets (2024, single filer)
  let federalTax = 0;
  const brackets = [
    { limit: 11600, rate: 0.1 },
    { limit: 47150, rate: 0.12 },
    { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243725, rate: 0.32 },
    { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ];

  let remaining = annual;
  let prev = 0;
  for (const bracket of brackets) {
    const taxable = Math.min(remaining, bracket.limit - prev);
    if (taxable <= 0) break;
    federalTax += taxable * bracket.rate;
    remaining -= taxable;
    prev = bracket.limit;
  }

  const fica = annual * 0.0765;
  const takeHome = annual - federalTax - fica;
  const effectiveRate = annual > 0 ? ((federalTax + fica) / annual) * 100 : 0;

  return { federalTax, fica, takeHome, effectiveRate };
}

export default async function HourlyToSalaryPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const hourly = parseFloat(amount);
  const daily = hourly * 8;
  const weekly = hourly * 40;
  const biweekly = weekly * 2;
  const monthly = (hourly * 2080) / 12;
  const annual = hourly * 2080;

  const formattedHourly = hourly % 1 === 0 ? `$${hourly}` : `$${hourly.toFixed(2)}`;
  const { federalTax, fica, takeHome, effectiveRate } = calculateTakeHome(annual);

  const faqs = [
    {
      question: `How much is ${formattedHourly} an hour per year?`,
      answer: `At ${formattedHourly} per hour, working 40 hours a week for 52 weeks, you would earn ${formatCurrency(annual)} per year before taxes.`,
    },
    {
      question: `What is the monthly pay for ${formattedHourly} an hour?`,
      answer: `${formattedHourly} per hour equals approximately ${formatCurrency(monthly)} per month, based on a standard 40-hour work week.`,
    },
    {
      question: `How much is ${formattedHourly} an hour after taxes?`,
      answer: `After roughly 25% in combined federal and FICA taxes, ${formattedHourly}/hr (${formatCurrency(annual)}/year) leaves approximately ${formatCurrency(takeHome)} in take-home pay. Actual amounts vary by state and filing status.`,
    },
    {
      question: `Is ${formattedHourly} an hour a good salary?`,
      answer: hourly >= 30
        ? `${formattedHourly}/hr is at or above the U.S. median hourly wage (~$30/hr). This translates to ${formatCurrency(annual)}/year, which is a solid income in most areas.`
        : `${formattedHourly}/hr is below the U.S. median hourly wage (~$30/hr). This translates to ${formatCurrency(annual)}/year. Whether it's enough depends on your location and cost of living.`,
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
        name: `${formattedHourly}/hr to Salary`,
        item: `https://salaryconverter.net/hourly-to-salary/${amount}`,
      },
    ],
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-cyan-700">
            Salary Converter
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{formattedHourly}/hr to Salary</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {formattedHourly} an Hour Is How Much a Year?
        </h1>

        {/* Quick Answer Card */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-8">
          <p className="text-lg text-cyan-900 font-semibold">
            {formattedHourly}/hr = {formatCurrency(annual)}/year{" "}
            <span className="font-normal text-cyan-700">(before taxes)</span>
          </p>
          <p className="text-sm text-cyan-700 mt-2">
            Based on 40 hours/week, 52 weeks/year (2,080 hours total)
          </p>
        </div>

        {/* Full Breakdown Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
            Full Pay Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    Period
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    Gross Pay
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-gray-900">Hourly</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(hourly)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-900">Daily (8 hrs)</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(daily)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-900">Weekly (40 hrs)</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(weekly)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-900">Biweekly</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(biweekly)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-900">Monthly</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(monthly)}
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-3 text-gray-900 font-semibold">
                    Annual
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-green-700">
                    {formatCurrency(annual)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* After-Tax Estimate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            After Typical Deductions
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Annual</span>
              <span className="font-medium">{formatCurrency(annual)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Federal Tax</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(federalTax)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">FICA (SS + Medicare)</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(fica)}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">
                Estimated Take-Home
              </span>
              <span className="font-bold text-green-700">
                {formatCurrency(takeHome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Effective Tax Rate</span>
              <span className="font-medium">{effectiveRate.toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            This is a rough estimate for single filers with no deductions. Actual
            take-home varies by state, filing status, and deductions.
          </p>
        </div>

        {/* Comparison Context */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            How Does {formattedHourly}/hr Compare?
          </h2>
          <p className="text-gray-600 mb-3">
            The U.S. median hourly wage is approximately $30/hr (based on BLS
            data). At {formattedHourly}/hr, you{" "}
            {hourly >= 30
              ? "are at or above the national median."
              : `earn ${(((30 - hourly) / 30) * 100).toFixed(0)}% below the national median.`}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-cyan-700 h-3 rounded-full"
              style={{ width: `${Math.min((hourly / 100) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>$7.25 (min wage)</span>
            <span>$30 (median)</span>
            <span>$100/hr</span>
          </div>
        </div>

        {/* Link back */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-800 transition"
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
