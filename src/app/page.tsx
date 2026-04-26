import Link from "next/link";
import SalaryConverter from "@/components/SalaryConverter";

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salary Converter",
  description: "Free salary converter. Convert between hourly, daily, weekly, biweekly, monthly, and annual pay. See how overtime, PTO, and work hours affect your real earnings.",
  url: "https://salaryconverter.net",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  const faqs = [
    {
      question: "$50,000 a year is how much an hour?",
      answer: "A $50,000 annual salary equals about $24.04 per hour based on a standard 40-hour work week (2,080 hours per year). After accounting for PTO and holidays, the effective hourly rate is higher."
    },
    {
      question: "$25 an hour is how much a year?",
      answer: "At $25 per hour working 40 hours a week for 52 weeks, you would earn $52,000 per year before taxes. Use the calculator above to adjust for your specific work schedule."
    },
    {
      question: "How many working hours are in a year?",
      answer: "A standard work year has 2,080 hours (40 hours x 52 weeks). After subtracting typical PTO (15 days) and holidays (10 days), actual working hours are closer to 1,880."
    },
    {
      question: "What is biweekly pay?",
      answer: "Biweekly pay means getting paid every two weeks, resulting in 26 paychecks per year. This is different from semi-monthly pay (twice a month, 24 paychecks). Biweekly is the most common pay frequency in the US."
    },
    {
      question: "How do I calculate my effective hourly rate?",
      answer: "Divide your annual salary by your actual working hours (after subtracting PTO, holidays, and sick days). A $60,000 salary with 25 paid days off works out to roughly $31.91/hour effective rate vs $28.85 nominal."
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <SalaryConverter />

      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Salary Data</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Hourly to Salary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Hourly to Salary</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {[15, 20, 25, 50].map((rate) => (
                <Link
                  key={rate}
                  href={`/hourly-to-salary/${rate}`}
                  className="rounded-md bg-green-50 border border-green-200 px-2.5 py-1 text-sm font-medium text-green-700 hover:bg-green-100 transition"
                >
                  ${rate}/hr
                </Link>
              ))}
            </div>
            <Link href="/browse#hourly-to-salary" className="text-sm font-medium text-green-700 hover:text-green-800">
              View all 42 &rarr;
            </Link>
          </div>

          {/* Salary to Hourly */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Salary to Hourly</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {[50000, 75000, 100000].map((amount) => (
                <Link
                  key={amount}
                  href={`/salary-to-hourly/${amount}`}
                  className="rounded-md bg-green-50 border border-green-200 px-2.5 py-1 text-sm font-medium text-green-700 hover:bg-green-100 transition"
                >
                  ${amount.toLocaleString("en-US")}
                </Link>
              ))}
            </div>
            <Link href="/browse#salary-to-hourly" className="text-sm font-medium text-green-700 hover:text-green-800">
              View all 35 &rarr;
            </Link>
          </div>

          {/* Cost of Living */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Cost of Living by City</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { name: "NYC", slug: "new-york-city" },
                { name: "SF", slug: "san-francisco" },
                { name: "Austin", slug: "austin" },
              ].map((city) => (
                <Link
                  key={city.slug}
                  href={`/cost-of-living/${city.slug}`}
                  className="rounded-md bg-green-50 border border-green-200 px-2.5 py-1 text-sm font-medium text-green-700 hover:bg-green-100 transition"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <Link href="/browse#cost-of-living" className="text-sm font-medium text-green-700 hover:text-green-800">
              View all 44 &rarr;
            </Link>
          </div>

          {/* Foreign Currencies */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Salary in Foreign Currencies</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { name: "EUR", slug: "eur" },
                { name: "GBP", slug: "gbp" },
                { name: "JPY", slug: "jpy" },
              ].map((c) => (
                <Link
                  key={c.slug}
                  href={`/salary-in/${c.slug}`}
                  className="rounded-md bg-green-50 border border-green-200 px-2.5 py-1 text-sm font-medium text-green-700 hover:bg-green-100 transition"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <Link href="/browse#foreign-currencies" className="text-sm font-medium text-green-700 hover:text-green-800">
              View all 25 &rarr;
            </Link>
          </div>

          {/* Purchasing Power */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Purchasing Power by Country</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { name: "UK", slug: "united-kingdom" },
                { name: "Japan", slug: "japan" },
                { name: "India", slug: "india" },
              ].map((c) => (
                <Link
                  key={c.slug}
                  href={`/purchasing-power/${c.slug}`}
                  className="rounded-md bg-green-50 border border-green-200 px-2.5 py-1 text-sm font-medium text-green-700 hover:bg-green-100 transition"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <Link href="/browse#purchasing-power" className="text-sm font-medium text-green-700 hover:text-green-800">
              View all 34 &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/browse"
            className="inline-block rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-800 transition"
          >
            Browse All 180 Pages &rarr;
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Financial Tools */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Financial Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="https://lendingcalculator.net" className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition group">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">Mortgage Calculator</h3>
            <p className="text-sm text-gray-500">Calculate monthly payments, total interest, and amortization for any home loan.</p>
          </a>
          <a href="https://compoundinterestcalc.app" className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition group">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">Compound Interest Calculator</h3>
            <p className="text-sm text-gray-500">See how your savings or investments grow over time with compound interest.</p>
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
          })
        }}
      />
    </>
  );
}
