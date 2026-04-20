import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://salaryconverter.net"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  title: "Salary Converter — Hourly, Weekly, Monthly, Yearly",
  description:
    "Free salary converter. Convert between hourly, daily, weekly, biweekly, monthly, and annual pay. See how overtime, PTO, and work hours affect your real earnings.",
  openGraph: {
    title: "Salary Converter",
    description:
      "Free salary converter. Convert between hourly, daily, weekly, biweekly, monthly, and annual pay. See how overtime, PTO, and work hours affect your real earnings.",
    type: "website",
    url: "https://salaryconverter.net",
    siteName: "Salary Converter",
  },
  twitter: {
    card: "summary",
    title: "Salary Converter",
    description:
      "Free salary converter. Convert between hourly, daily, weekly, biweekly, monthly, and annual pay. See how overtime, PTO, and work hours affect your real earnings.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-98P8L87RKZ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-98P8L87RKZ');
        `}
      </Script>
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-900">
        <header className="bg-cyan-700 border-b border-cyan-800">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <a href="/" className="flex items-center gap-2 text-white">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              <span className="text-xl font-bold">Salary Converter</span>
            </a>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 text-center mb-2">More Free Tools</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
                <a href="https://appliancecostcalculator.net" className="text-cyan-700 hover:underline">Appliance Cost Calculator</a>
                <a href="https://sidehustletaxcalculator.net" className="text-cyan-700 hover:underline">Side Hustle Tax Calculator</a>
                <a href="https://imageconverters.net" className="text-cyan-700 hover:underline">Image Converter</a>
                <a href="https://photometadata.net" className="text-cyan-700 hover:underline">Photo Metadata Viewer</a>
                <a href="https://freelancerates.net" className="text-cyan-700 hover:underline">Freelance Rate Calculator</a>
                <a href="https://imageresizers.net" className="text-cyan-700 hover:underline">Social Image Resizer</a>
                <a href="https://lendingcalculator.net" className="text-cyan-700 hover:underline">Mortgage Calculator</a>
                <a href="https://compoundinterestcalc.app" className="text-cyan-700 hover:underline">Compound Interest Calculator</a>
                <a href="https://printablepolly.com" className="text-cyan-700 hover:underline">Printable Polly</a>
                <a href="https://biblegarden.net" className="text-cyan-700 hover:underline">Bible Garden</a>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Calculations assume standard U.S. work schedules. Actual take-home
              pay varies based on taxes, benefits, and deductions. This is not
              financial advice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
