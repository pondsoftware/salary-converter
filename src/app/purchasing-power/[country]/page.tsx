import { Metadata } from "next";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const COUNTRIES = [
  { name: "Switzerland", slug: "switzerland", flag: "\ud83c\udde8\ud83c\udded", pppIndex: 122.4, currency: "CHF" },
  { name: "Norway", slug: "norway", flag: "\ud83c\uddf3\ud83c\uddf4", pppIndex: 116.8, currency: "NOK" },
  { name: "Australia", slug: "australia", flag: "\ud83c\udde6\ud83c\uddfa", pppIndex: 107.3, currency: "AUD" },
  { name: "United Kingdom", slug: "united-kingdom", flag: "\ud83c\uddec\ud83c\udde7", pppIndex: 99.2, currency: "GBP" },
  { name: "Canada", slug: "canada", flag: "\ud83c\udde8\ud83c\udde6", pppIndex: 98.5, currency: "CAD" },
  { name: "Germany", slug: "germany", flag: "\ud83c\udde9\ud83c\uddea", pppIndex: 93.7, currency: "EUR" },
  { name: "France", slug: "france", flag: "\ud83c\uddeb\ud83c\uddf7", pppIndex: 92.1, currency: "EUR" },
  { name: "Japan", slug: "japan", flag: "\ud83c\uddef\ud83c\uddf5", pppIndex: 86.4, currency: "JPY" },
  { name: "South Korea", slug: "south-korea", flag: "\ud83c\uddf0\ud83c\uddf7", pppIndex: 83.2, currency: "KRW" },
  { name: "Spain", slug: "spain", flag: "\ud83c\uddea\ud83c\uddf8", pppIndex: 78.3, currency: "EUR" },
  { name: "Portugal", slug: "portugal", flag: "\ud83c\uddf5\ud83c\uddf9", pppIndex: 65.8, currency: "EUR" },
  { name: "Mexico", slug: "mexico", flag: "\ud83c\uddf2\ud83c\uddfd", pppIndex: 44.7, currency: "MXN" },
  { name: "Brazil", slug: "brazil", flag: "\ud83c\udde7\ud83c\uddf7", pppIndex: 42.1, currency: "BRL" },
  { name: "Thailand", slug: "thailand", flag: "\ud83c\uddf9\ud83c\udded", pppIndex: 38.5, currency: "THB" },
  { name: "India", slug: "india", flag: "\ud83c\uddee\ud83c\uddf3", pppIndex: 25.1, currency: "INR" },
  { name: "Vietnam", slug: "vietnam", flag: "\ud83c\uddfb\ud83c\uddf3", pppIndex: 22.8, currency: "VND" },
  { name: "Philippines", slug: "philippines", flag: "\ud83c\uddf5\ud83c\udded", pppIndex: 28.3, currency: "PHP" },
  { name: "Colombia", slug: "colombia", flag: "\ud83c\udde8\ud83c\uddf4", pppIndex: 31.4, currency: "COP" },
];

const COMMON_SALARIES = [30000, 40000, 50000, 60000, 75000, 100000, 150000, 200000];

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = COUNTRIES.find((ct) => ct.slug === country)!;
  const equivalent = Math.round(60000 * 100 / c.pppIndex);

  return {
    title: `Purchasing Power in ${c.name} \u2014 How Far Does Your Salary Go?`,
    description: `See how far a US salary goes in ${c.name}. PPP index: ${c.pppIndex}. $60,000 USD has the purchasing power of ${formatCurrency(equivalent)} in ${c.name}.`,
  };
}

export default async function PurchasingPowerPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = COUNTRIES.find((ct) => ct.slug === country)!;
  const equivalent60k = Math.round(60000 * 100 / c.pppIndex);
  const percentageDiff = Math.abs(c.pppIndex - 100).toFixed(0);

  const faqs = [
    {
      question: `What is the purchasing power parity index for ${c.name}?`,
      answer: `${c.name} has a PPP index of ${c.pppIndex} relative to the US (100). This means ${c.pppIndex < 100 ? `your US dollar goes ${((100 - c.pppIndex) / c.pppIndex * 100).toFixed(0)}% further in ${c.name} than in the US` : `${c.name} is ${((c.pppIndex - 100) / 100 * 100).toFixed(0)}% more expensive than the US`}.`,
    },
    {
      question: `How far does a $100,000 US salary go in ${c.name}?`,
      answer: `A $100,000 US salary has the purchasing power equivalent of ${formatCurrency(Math.round(100000 * 100 / c.pppIndex))} in ${c.name}. ${c.pppIndex < 100 ? "Your money buys more goods and services there." : "You would need a higher salary to maintain the same lifestyle."}`,
    },
    {
      question: `Is ${c.name} cheaper or more expensive than the US?`,
      answer: c.pppIndex < 100
        ? `${c.name} is less expensive than the US. With a PPP index of ${c.pppIndex}, goods and services cost roughly ${(100 - c.pppIndex).toFixed(0)}% less on average compared to the US.`
        : `${c.name} is more expensive than the US. With a PPP index of ${c.pppIndex}, goods and services cost roughly ${(c.pppIndex - 100).toFixed(0)}% more on average compared to the US.`,
    },
    {
      question: `What salary do I need in ${c.name} to live like I do on $60,000 in the US?`,
      answer: `Based on purchasing power parity, you would need the equivalent of ${formatCurrency(Math.round(60000 * c.pppIndex / 100))} (in local purchasing terms) to maintain the same standard of living as $60,000 in the US. However, actual salaries in ${c.name} are paid in ${c.currency}.`,
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
        name: "Purchasing Power",
        item: "https://salaryconverter.net/purchasing-power",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: c.name,
        item: `https://salaryconverter.net/purchasing-power/${c.slug}`,
      },
    ],
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Salary Converter
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Purchasing Power</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{c.name}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Purchasing Power in {c.name} — What Your Salary Buys
        </h1>

        {/* Quick Answer Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-lg text-blue-900 font-semibold">
            {c.flag} {c.name} has a PPP index of {c.pppIndex}{" "}
            <span className="font-normal text-blue-700">(US = 100)</span>
          </p>
          <p className="text-sm text-blue-700 mt-2">
            A $60,000 US salary has the purchasing power of {formatCurrency(equivalent60k)} in {c.name}.
          </p>
          <p className="text-sm text-blue-700 mt-1">
            {c.pppIndex < 100
              ? `Your dollar goes ${percentageDiff}% further in ${c.name}.`
              : `${c.name} is ${percentageDiff}% more expensive than the US.`}
          </p>
        </div>

        {/* Salary Purchasing Power Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
            Salary Purchasing Power in {c.name}
          </h2>
          <p className="px-6 pb-4 text-sm text-gray-600">
            What US salaries buy in {c.name} (USD equivalent purchasing power):
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">US Salary</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    Purchasing Power in {c.name}
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    {c.pppIndex < 100 ? "Gain" : "Loss"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMMON_SALARIES.map((salary) => {
                  const pp = Math.round(salary * 100 / c.pppIndex);
                  const diff = pp - salary;
                  return (
                    <tr key={salary}>
                      <td className="px-6 py-3 text-gray-900">{formatCurrency(salary)}</td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900">
                        {formatCurrency(pp)}
                      </td>
                      <td className={`px-6 py-3 text-right font-medium ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {diff >= 0 ? "+" : ""}{formatCurrency(diff)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Comparison Context */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Cost of Living Context
          </h2>
          {c.pppIndex < 100 ? (
            <p className="text-gray-600">
              {c.name} has a significantly lower cost of living compared to the United States.
              With a PPP index of {c.pppIndex}, everyday goods, services, housing, and food
              cost considerably less. This makes {c.name} an attractive destination for remote
              workers earning US salaries, digital nomads, and retirees looking to stretch their
              income further. A US salary of $60,000 provides a lifestyle equivalent to
              earning {formatCurrency(equivalent60k)} domestically.
            </p>
          ) : (
            <p className="text-gray-600">
              {c.name} has a higher cost of living compared to the United States.
              With a PPP index of {c.pppIndex}, everyday goods, services, housing, and food
              tend to cost more. If you&apos;re relocating to {c.name}, expect to need a higher
              salary to maintain the same standard of living. A US salary of $60,000 would
              only provide the purchasing power of {formatCurrency(Math.round(60000 * 100 / c.pppIndex))} in {c.name} terms,
              meaning you&apos;d need to earn more to match your US lifestyle.
            </p>
          )}
        </div>

        {/* Comparison with Other Countries */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
            Purchasing Power Comparison — All Countries
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Country</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">PPP Index</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">$60K Buys</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COUNTRIES.sort((a, b) => b.pppIndex - a.pppIndex).map((ct) => (
                  <tr
                    key={ct.slug}
                    className={ct.slug === c.slug ? "bg-blue-50 font-semibold" : ""}
                  >
                    <td className="px-6 py-3 text-gray-900">
                      {ct.slug === c.slug ? (
                        <span>{ct.flag} {ct.name}</span>
                      ) : (
                        <Link href={`/purchasing-power/${ct.slug}`} className="text-blue-600 hover:underline">
                          {ct.flag} {ct.name}
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-900">{ct.pppIndex}</td>
                    <td className="px-6 py-3 text-right text-gray-900">
                      {formatCurrency(Math.round(60000 * 100 / ct.pppIndex))}
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
