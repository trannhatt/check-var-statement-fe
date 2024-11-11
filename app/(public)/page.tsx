"use client";

import { useState } from "react";

interface Contribution {
  date_time: string;
  trans_no: number;
  credit: number;
  debit: number;
  detail: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amountRange, setAmountRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [filteredContributions, setFilteredContributions] = useState<
    Contribution[]
  >([
    {
      date_time: "01/09/2024_5215.97152",
      trans_no: 1,
      credit: 3000,
      debit: 0,
      detail: "267515.010924.122904.NGUYEN THI MAO Chuyen tien",
    },
    {
      date_time: "02/09/2024_5212.22965",
      trans_no: 2,
      credit: 10000,
      debit: 0,
      detail:
        "055464.020924.064157.Ung Ho Nha Nuoc Viet Nam Va Giup do Nguoi dan (by TPBank ChatPay)",
    },
  ]);

  const handleSearch = () => {
    const filtered = filteredContributions.filter((contribution) => {
      const isMatchingSearch = contribution.detail
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isMatchingAmount =
        amountRange === "" ||
        (amountRange === "1" && contribution.credit <= 1000000) ||
        (amountRange === "2" &&
          contribution.credit > 1000000 &&
          contribution.credit <= 5000000);

      const isMatchingDate =
        (startDate === "" ||
          new Date(contribution.date_time.split("_")[0]) >=
            new Date(startDate)) &&
        (endDate === "" ||
          new Date(contribution.date_time.split("_")[0]) <= new Date(endDate));

      return isMatchingSearch && isMatchingAmount && isMatchingDate;
    });

    setFilteredContributions(filtered);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">
        Tra cứu dữ liệu “Sao Kê” của MTTQ VN
      </h1>
      <p className="text-center text-sm text-red-600 font-semibold">
        Theo danh sách công bố từ MTTQVN, từ ngày 01/09/2024 đến ngày
        10/09/2024.
      </p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="flex space-x-4">
          <select
            value={amountRange}
            onChange={(e) => setAmountRange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn khoảng số tiền</option>
            <option value="1">100,000 VND - 1,000,000 VND</option>
            <option value="2">1,000,001 VND - 5,000,000 VND</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Tìm kiếm
        </button>
      </div>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Date time</th>
            <th className="border p-2">Trans no</th>
            <th className="border p-2">Credit</th>
            <th className="border p-2">Debit</th> {}
            <th className="border p-2">Detail</th>
          </tr>
        </thead>
        <tbody>
          {filteredContributions.map((contribution) => (
            <tr key={contribution.trans_no}>
              <td className="border p-2">{contribution.date_time}</td>
              <td className="border p-2">{contribution.trans_no}</td>
              <td className="border p-2">
                {contribution.credit.toLocaleString()} VND
              </td>
              <td className="border p-2">
                {contribution.debit.toLocaleString()} VND {}
              </td>
              <td className="border p-2">{contribution.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
