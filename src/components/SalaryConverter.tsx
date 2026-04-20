"use client";

import { useState, useMemo } from "react";

type InputMode = "annual" | "monthly" | "biweekly" | "weekly" | "daily" | "hourly";

const INPUT_LABELS: Record<InputMode, string> = {
  annual: "Annual Salary",
  monthly: "Monthly Pay",
  biweekly: "Biweekly Pay",
  weekly: "Weekly Pay",
  daily: "Daily Pay",
  hourly: "Hourly Rate",
};

const US_METROS = [
  { name: "San Francisco, CA", index: 179.6 },
  { name: "New York City, NY", index: 187.2 },
  { name: "Los Angeles, CA", index: 166.2 },
  { name: "Seattle, WA", index: 149.6 },
  { name: "Boston, MA", index: 152.4 },
  { name: "Washington, DC", index: 152.1 },
  { name: "Denver, CO", index: 128.7 },
  { name: "Austin, TX", index: 110.3 },
  { name: "Chicago, IL", index: 107.8 },
  { name: "Miami, FL", index: 123.1 },
  { name: "Atlanta, GA", index: 107.4 },
  { name: "Phoenix, AZ", index: 103.2 },
  { name: "Dallas-Fort Worth, TX", index: 101.5 },
  { name: "Houston, TX", index: 96.5 },
  { name: "Minneapolis, MN", index: 106.7 },
  { name: "Nashville, TN", index: 103.8 },
  { name: "Raleigh, NC", index: 102.1 },
  { name: "Salt Lake City, UT", index: 105.4 },
  { name: "Kansas City, MO", index: 93.4 },
  { name: "Indianapolis, IN", index: 91.8 },
  { name: "Columbus, OH", index: 93.7 },
  { name: "San Antonio, TX", index: 90.8 },
  { name: "Pittsburgh, PA", index: 96.2 },
  { name: "Oklahoma City, OK", index: 87.3 },
  { name: "Memphis, TN", index: 84.6 },
];

const CURRENCIES = [
  { code: "EUR", name: "Euro", symbol: "\u20ac", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "\u00a3", rate: 0.79 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.38 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.55 },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00a5", rate: 154.5 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.88 },
  { code: "INR", name: "Indian Rupee", symbol: "\u20b9", rate: 83.5 },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", rate: 17.15 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 4.97 },
  { code: "CNY", name: "Chinese Yuan", symbol: "\u00a5", rate: 7.24 },
  { code: "KRW", name: "South Korean Won", symbol: "\u20a9", rate: 1345 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", rate: 10.65 },
];

const COUNTRIES = [
  { name: "Switzerland", flag: "\ud83c\udde8\ud83c\udded", pppIndex: 122.4, currency: "CHF" },
  { name: "Norway", flag: "\ud83c\uddf3\ud83c\uddf4", pppIndex: 116.8, currency: "NOK" },
  { name: "Australia", flag: "\ud83c\udde6\ud83c\uddfa", pppIndex: 107.3, currency: "AUD" },
  { name: "United Kingdom", flag: "\ud83c\uddec\ud83c\udde7", pppIndex: 99.2, currency: "GBP" },
  { name: "Canada", flag: "\ud83c\udde8\ud83c\udde6", pppIndex: 98.5, currency: "CAD" },
  { name: "Germany", flag: "\ud83c\udde9\ud83c\uddea", pppIndex: 93.7, currency: "EUR" },
  { name: "France", flag: "\ud83c\uddeb\ud83c\uddf7", pppIndex: 92.1, currency: "EUR" },
  { name: "Japan", flag: "\ud83c\uddef\ud83c\uddf5", pppIndex: 86.4, currency: "JPY" },
  { name: "South Korea", flag: "\ud83c\uddf0\ud83c\uddf7", pppIndex: 83.2, currency: "KRW" },
  { name: "Spain", flag: "\ud83c\uddea\ud83c\uddf8", pppIndex: 78.3, currency: "EUR" },
  { name: "Portugal", flag: "\ud83c\uddf5\ud83c\uddf9", pppIndex: 65.8, currency: "EUR" },
  { name: "Mexico", flag: "\ud83c\uddf2\ud83c\uddfd", pppIndex: 44.7, currency: "MXN" },
  { name: "Brazil", flag: "\ud83c\udde7\ud83c\uddf7", pppIndex: 42.1, currency: "BRL" },
  { name: "Thailand", flag: "\ud83c\uddf9\ud83c\udded", pppIndex: 38.5, currency: "THB" },
  { name: "India", flag: "\ud83c\uddee\ud83c\uddf3", pppIndex: 25.1, currency: "INR" },
  { name: "Vietnam", flag: "\ud83c\uddfb\ud83c\uddf3", pppIndex: 22.8, currency: "VND" },
  { name: "Philippines", flag: "\ud83c\uddf5\ud83c\udded", pppIndex: 28.3, currency: "PHP" },
  { name: "Colombia", flag: "\ud83c\udde8\ud83c\uddf4", pppIndex: 31.4, currency: "COP" },
];

function formatForeignCurrency(amount: number, symbol: string, code: string): string {
  const noDecimalCurrencies = ["JPY", "KRW"];
  const decimals = noDecimalCurrencies.includes(code) ? 0 : 2;
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol}${formatted}`;
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

export default function SalaryConverter() {
  const [inputMode, setInputMode] = useState<InputMode>("annual");
  const [amount, setAmount] = useState(60000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [paidHolidays, setPaidHolidays] = useState(10);
  const [ptoDays, setPtoDays] = useState(15);
  const [colBase, setColBase] = useState<string>("national");

  const conversions = useMemo(() => {
    const workDaysPerWeek = hoursPerWeek > 0 ? 5 : 0;
    const hoursPerDay = hoursPerWeek / workDaysPerWeek || 0;
    const totalWorkWeeks = weeksPerYear;
    const totalWorkHours = totalWorkWeeks * hoursPerWeek;

    let annual: number;
    switch (inputMode) {
      case "annual":
        annual = amount;
        break;
      case "monthly":
        annual = amount * 12;
        break;
      case "biweekly":
        annual = amount * 26;
        break;
      case "weekly":
        annual = amount * totalWorkWeeks;
        break;
      case "daily":
        annual = amount * totalWorkWeeks * workDaysPerWeek;
        break;
      case "hourly":
        annual = amount * totalWorkHours;
        break;
    }

    const hourly = totalWorkHours > 0 ? annual / totalWorkHours : 0;
    const daily = hoursPerDay > 0 ? hourly * hoursPerDay : 0;
    const weekly = annual / totalWorkWeeks;
    const biweekly = annual / 26;
    const monthly = annual / 12;

    // Effective hourly rate accounting for PTO and holidays
    const paidDaysOff = paidHolidays + ptoDays;
    const paidWeeksOff = paidDaysOff / workDaysPerWeek;
    const actualWorkWeeks = totalWorkWeeks - paidWeeksOff;
    const actualWorkHours = actualWorkWeeks * hoursPerWeek;
    const effectiveHourly = actualWorkHours > 0 ? annual / actualWorkHours : 0;

    // Overtime rate (1.5x)
    const overtimeRate = hourly * 1.5;

    return {
      annual,
      monthly,
      biweekly,
      weekly,
      daily,
      hourly,
      effectiveHourly,
      overtimeRate,
      actualWorkWeeks,
      actualWorkHours,
      totalWorkHours,
      paidDaysOff,
    };
  }, [amount, inputMode, hoursPerWeek, weeksPerYear, paidHolidays, ptoDays]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Salary to Hourly Converter
      </h1>
      <p className="text-gray-600 mb-8">
        Convert your pay between hourly, daily, weekly, biweekly, monthly, and
        annual amounts. Adjust work hours, PTO, and holidays to see your real
        effective rate.
      </p>

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I know my...
            </label>
            <select
              value={inputMode}
              onChange={(e) => setInputMode(e.target.value as InputMode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(INPUT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {INPUT_LABELS[inputMode]}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={0}
                step={inputMode === "hourly" ? 0.5 : inputMode === "annual" ? 1000 : 1}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours per Week
            </label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              min={1}
              max={80}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weeks per Year
            </label>
            <input
              type="number"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(Number(e.target.value))}
              min={1}
              max={52}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paid Holidays
            </label>
            <div className="relative">
              <input
                type="number"
                value={paidHolidays}
                onChange={(e) => setPaidHolidays(Number(e.target.value))}
                min={0}
                max={30}
                className="w-full pr-14 pl-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                days
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PTO / Vacation Days
            </label>
            <div className="relative">
              <input
                type="number"
                value={ptoDays}
                onChange={(e) => setPtoDays(Number(e.target.value))}
                min={0}
                max={60}
                className="w-full pr-14 pl-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Results */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pay Conversion
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {([
            ["Hourly", conversions.hourly],
            ["Daily", conversions.daily],
            ["Weekly", conversions.weekly],
            ["Biweekly", conversions.biweekly],
            ["Monthly", conversions.monthly],
            ["Annual", conversions.annual],
          ] as [string, number][]).map(([label, value]) => (
            <div
              key={label}
              className={`rounded-lg border p-4 text-center ${
                label.toLowerCase() === inputMode
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Effective Rate & Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Effective Hourly Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(conversions.effectiveHourly)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Accounting for {conversions.paidDaysOff} paid days off
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Overtime Rate (1.5x)</p>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(conversions.overtimeRate)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Time-and-a-half</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Actual Work Hours</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(conversions.actualWorkHours).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {conversions.actualWorkWeeks.toFixed(1)} weeks/year
          </p>
        </div>
      </div>

      {/* Estimated Take-Home */}
      {(() => {
        const { federalTax, fica, takeHome, effectiveRate } = calculateTakeHome(conversions.annual);
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Estimated Take-Home Pay
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Annual</span>
                <span className="font-medium">{formatCurrency(conversions.annual)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Federal Tax</span>
                <span className="font-medium text-red-600">-{formatCurrency(federalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">FICA (SS + Medicare)</span>
                <span className="font-medium text-red-600">-{formatCurrency(fica)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Estimated Take-Home</span>
                <span className="font-bold text-green-700">{formatCurrency(takeHome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Effective Tax Rate</span>
                <span className="font-medium">{effectiveRate.toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              This is a rough estimate for single filers with no deductions. Actual take-home varies by state, filing status, and deductions.
            </p>
          </div>
        );
      })()}

      {/* Cost of Living Comparison */}
      {(() => {
        const baseIndex = colBase === "national" ? 100 : US_METROS.find(m => m.name === colBase)!.index;
        const colComparisons = US_METROS.map(metro => {
          const equivalent = (conversions.annual / baseIndex) * metro.index;
          const difference = equivalent - conversions.annual;
          return { ...metro, equivalent, difference };
        });
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cost of Living Comparison
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              See what salary you&apos;d need in different US metro areas to maintain
              the same standard of living.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I live in...
              </label>
              <select
                value={colBase}
                onChange={(e) => setColBase(e.target.value)}
                className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="national">National Average (100)</option>
                {US_METROS.map(metro => (
                  <option key={metro.name} value={metro.name}>
                    {metro.name} ({metro.index})
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Metro</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">COL Index</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Equivalent Salary</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {colComparisons.map(metro => (
                    <tr key={metro.name} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{metro.name}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{metro.index}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(metro.equivalent)}</td>
                      <td className={`px-4 py-3 text-right font-medium ${metro.difference > 0 ? "text-red-600" : metro.difference < 0 ? "text-green-600" : "text-gray-500"}`}>
                        {metro.difference > 0 ? "+" : ""}{formatCurrency(metro.difference)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* International Currency Conversion */}
      {(() => {
        const annual = conversions.annual;
        const monthly = conversions.monthly;
        const hourly = conversions.hourly;
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              International Currency Conversion
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your salary converted to other currencies at approximate exchange rates.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Currency</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Annual</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Monthly</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Hourly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CURRENCIES.map(cur => (
                    <tr key={cur.code} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {cur.name} ({cur.code})
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatForeignCurrency(annual * cur.rate, cur.symbol, cur.code)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatForeignCurrency(monthly * cur.rate, cur.symbol, cur.code)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatForeignCurrency(hourly * cur.rate, cur.symbol, cur.code)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Exchange rates are approximate and for reference only. Actual rates fluctuate daily.
            </p>
          </div>
        );
      })()}

      {/* Global Purchasing Power */}
      {(() => {
        const pppComparisons = COUNTRIES.map(country => {
          const purchasingPower = conversions.annual * (100 / country.pppIndex);
          const change = purchasingPower - conversions.annual;
          return { ...country, purchasingPower, change };
        });
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Global Purchasing Power
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Purchasing Power Parity (PPP) adjusts for what your salary actually buys
              in each country. A lower index means your dollar goes further.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Country</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">PPP Index</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Purchasing Power (USD eq.)</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Buying Power Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pppComparisons.map(country => (
                    <tr key={country.name} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {country.flag} {country.name}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{country.pppIndex}</td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatCurrency(country.purchasingPower)}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${country.change > 0 ? "text-green-600" : country.change < 0 ? "text-red-600" : "text-gray-500"}`}>
                        {country.change > 0 ? "+" : ""}{formatCurrency(country.change)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mb-8 text-center">
        Cost of living indices and exchange rates are approximate and for comparison purposes only.
      </p>

      {/* Quick Reference Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">
          Common Salary Equivalents
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">
                  Hourly
                </th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">
                  Weekly
                </th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">
                  Monthly
                </th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">
                  Annual
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[10, 15, 20, 25, 30, 35, 40, 50, 60, 75, 100].map((hr) => {
                const annualRef = hr * hoursPerWeek * weeksPerYear;
                return (
                  <tr key={hr} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900 font-medium">
                      ${hr}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700">
                      {formatCurrency(hr * hoursPerWeek)}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700">
                      {formatCurrency(annualRef / 12)}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700">
                      {formatCurrency(annualRef)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
