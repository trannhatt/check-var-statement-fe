"use client";

import { useState, useEffect, useMemo } from "react";

interface Contribution {
  date_time: string;
  trans_no: string;
  credit: string;
  debit: string;
  detail: string;
}

export default function Home() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<
    Contribution[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [amountRange, setAmountRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/trie/all");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setContributions(result.data);
      setFilteredContributions(result.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch contributions");
      setIsLoading(false);
      console.error("Error fetching contributions:", err);
    }
  };

  const fetchSearchResults = async () => {
    if (searchTerm.trim() === "") {
      setFilteredContributions(contributions); // Nếu không có từ khóa tìm kiếm, hiển thị toàn bộ dữ liệu
      return;
    }

    setIsLoading(true);
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      const response = await fetch(
        `http://localhost:3001/api/trie/search/${encodedSearchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const result = await response.json();
      setFilteredContributions(result); // Cập nhật dữ liệu với kết quả tìm kiếm
      setIsLoading(false);
      setCurrentPage(1); // Reset lại trang đầu
    } catch (err) {
      setError("Failed to fetch search results");
      setIsLoading(false);
      console.error("Error fetching search results:", err);
    }
  };

  const handleSearch = () => {
    fetchSearchResults();
  };

  const resetSearch = () => {
    setSearchTerm("");
    setAmountRange("");
    setStartDate("");
    setEndDate("");
    setFilteredContributions(contributions);
    setCurrentPage(1);
  };

  // Helper function to convert date from DD/MM/YYYY to YYYY-MM-DD
  const convertDateFormat = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredContributions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredContributions, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredContributions.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div className="text-center p-4">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">
        Tra cứu dữ liệu "Sao Kê" của MTTQ VN
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
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Tìm kiếm
          </button>
          <button
            onClick={resetSearch}
            className="bg-gray-500 text-white px-4 py-2 rounded w-full"
          >
            Hiển thị tất cả giao dịch
          </button>
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="rowsPerPage" className="text-sm">
            Số dòng mỗi trang:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}
            className="p-2 border rounded"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {filteredContributions.length === 0 ? (
        <p className="text-center text-gray-500">Không tìm thấy kết quả</p>
      ) : (
        <>
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Thời gian</th>
                <th className="border p-2">Mã</th>
                <th className="border p-2">Số tiền (VND)</th>
                <th className="border p-2">Nội dung</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((contribution) => (
                <tr key={contribution.trans_no}>
                  <td className="border p-2">
                    {contribution.date_time.split("_")[0]}
                  </td>
                  <td className="border p-2">{contribution.trans_no}</td>
                  <td className="border p-2">
                    {parseFloat(contribution.credit).toLocaleString()}
                  </td>
                  <td className="border p-2">{contribution.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages} (Tổng{" "}
              {filteredContributions.length} giao dịch)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
