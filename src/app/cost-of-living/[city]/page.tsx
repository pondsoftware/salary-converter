import { Metadata } from "next";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const US_METROS = [
  { name: "San Francisco, CA", slug: "san-francisco", index: 179.6 },
  { name: "New York City, NY", slug: "new-york-city", index: 187.2 },
  { name: "Los Angeles, CA", slug: "los-angeles", index: 166.2 },
  { name: "Seattle, WA", slug: "seattle", index: 149.6 },
  { name: "Boston, MA", slug: "boston", index: 152.4 },
  { name: "Washington, DC", slug: "washington-dc", index: 152.1 },
  { name: "Denver, CO", slug: "denver", index: 128.7 },
  { name: "Austin, TX", slug: "austin", index: 110.3 },
  { name: "Chicago, IL", slug: "chicago", index: 107.8 },
  { name: "Miami, FL", slug: "miami", index: 123.1 },
  { name: "Atlanta, GA", slug: "atlanta", index: 107.4 },
  { name: "Phoenix, AZ", slug: "phoenix", index: 103.2 },
  { name: "Dallas-Fort Worth, TX", slug: "dallas-fort-worth", index: 101.5 },
  { name: "Houston, TX", slug: "houston", index: 96.5 },
  { name: "Minneapolis, MN", slug: "minneapolis", index: 106.7 },
  { name: "Nashville, TN", slug: "nashville", index: 103.8 },
  { name: "Raleigh, NC", slug: "raleigh", index: 102.1 },
  { name: "Salt Lake City, UT", slug: "salt-lake-city", index: 105.4 },
  { name: "Kansas City, MO", slug: "kansas-city", index: 93.4 },
  { name: "Indianapolis, IN", slug: "indianapolis", index: 91.8 },
  { name: "Columbus, OH", slug: "columbus", index: 93.7 },
  { name: "San Antonio, TX", slug: "san-antonio", index: 90.8 },
  { name: "Pittsburgh, PA", slug: "pittsburgh", index: 96.2 },
  { name: "Oklahoma City, OK", slug: "oklahoma-city", index: 87.3 },
  { name: "Memphis, TN", slug: "memphis", index: 84.6 },
];

const COMMON_SALARIES = [30000, 40000, 50000, 60000, 75000, 100000, 150000];

export function generateStaticParams() {
  return US_METROS.map((metro) => ({ city: metro.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const metro = US_METROS.find((m) => m.slug === city)!;

  return {
    title: `Cost of Living in ${metro.name} — Salary Equivalent Calculator`,
    description: `${metro.name} has a cost of living index of ${metro.index}. See what salaries are equivalent in ${metro.name} compared to the national average and other US cities.`,
  };
}

export default async function CostOfLivingPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const metro = US_METROS.find((m) => m.slug === city)!;
  const equivalent60k = Math.round(60000 * metro.index / 100);

  const faqs = [
    {
      question: `What is the cost of living in ${metro.name}?`,
      answer: `${metro.name} has a cost of living index of ${metro.index}, where the national average is 100. This means living in ${metro.name} is ${metro.index > 100 ? `${(metro.index - 100).toFixed(1)}% more expensive` : `${(100 - metro.index).toFixed(1)}% less expensive`} than the national average.`,
    },
    {
      question: `How much do I need to earn in ${metro.name} to match $60,000 nationally?`,
      answer: `To maintain the same standard of living as someone earning $60,000 at the national average cost of living, you would need to earn approximately ${formatCurrency(equivalent60k)} in ${metro.name}.`,
    },
    {
      question: `Is ${metro.name} expensive compared to the national average?`,
      answer: metro.index > 100
        ? `Yes, ${metro.name} is ${(metro.index - 100).toFixed(1)}% more expensive than the national average. Salaries need to be higher to maintain the same purchasing power.`
        : `No, ${metro.name} is ${(100 - metro.index).toFixed(1)}% less expensive than the national average. Your salary stretches further here compared to most US cities.`,
    },
    {
      question: `What salary in ${metro.name} equals $100,000 nationally?`,
      answer: `A $100,000 salary at the national average cost of living is equivalent to earning ${formatCurrency(Math.round(100000 * metro.index / 100))} in ${metro.name}.`,
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
        name: "Cost of Living",
        item: "https://salaryconverter.net/cost-of-living",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: metro.name,
        item: `https://salaryconverter.net/cost-of-living/${metro.slug}`,
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
          <span className="text-gray-700">Cost of Living</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{metro.name}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Cost of Living in {metro.name} — Salary Comparison
        </h1>

        {/* Quick Answer Card */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-8">
          <p className="text-lg text-cyan-900 font-semibold">
            {metro.name} has a cost of living index of {metro.index}{" "}
            <span className="font-normal text-cyan-700">(national average = 100)</span>
          </p>
          <p className="text-sm text-cyan-700 mt-2">
            A $60,000 national average salary is equivalent to {formatCurrency(equivalent60k)} in {metro.name}.
          </p>
        </div>

        {/* Salary Equivalents Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
            Salary Equivalents in {metro.name}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    National Average Salary
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    Equivalent in {metro.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMMON_SALARIES.map((salary) => (
                  <tr key={salary}>
                    <td className="px-6 py-3 text-gray-900">
                      {formatCurrency(salary)}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(Math.round(salary * metro.index / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inverse: What your salary in this city equals nationally */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
            What Your {metro.name} Salary Equals Nationally
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    Your Salary in {metro.name}
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    National Average Equivalent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMMON_SALARIES.map((salary) => (
                  <tr key={salary}>
                    <td className="px-6 py-3 text-gray-900">
                      {formatCurrency(salary)}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(Math.round(salary * 100 / metro.index))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison with Other Cities */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
            Cost of Living Comparison — All US Metros
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">City</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">COL Index</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">$60K Equivalent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {US_METROS.sort((a, b) => b.index - a.index).map((m) => (
                  <tr
                    key={m.slug}
                    className={m.slug === metro.slug ? "bg-cyan-50 font-semibold" : ""}
                  >
                    <td className="px-6 py-3 text-gray-900">
                      {m.slug === metro.slug ? (
                        m.name
                      ) : (
                        <Link href={`/cost-of-living/${m.slug}`} className="text-cyan-700 hover:underline">
                          {m.name}
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-900">{m.index}</td>
                    <td className="px-6 py-3 text-right text-gray-900">
                      {formatCurrency(Math.round(60000 * m.index / 100))}
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
