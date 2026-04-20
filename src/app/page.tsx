import SalaryConverter from "@/components/SalaryConverter";

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
      <SalaryConverter />

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
