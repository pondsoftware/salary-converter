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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SalaryConverter() {
  const [inputMode, setInputMode] = useState<InputMode>("annual");
  const [amount, setAmount] = useState(60000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [paidHolidays, setPaidHolidays] = useState(10);
  const [ptoDays, setPtoDays] = useState(15);

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
