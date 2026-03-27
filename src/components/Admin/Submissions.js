import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Filter, RefreshCcw, Calculator } from "lucide-react";
import { toast } from "react-toastify";
import {
  getAdminSubmissions,
  getAdminSubmissionDetail,
  recalculateScores,
} from "../../services/SubmissionService";

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const scoreFormatter = new Intl.NumberFormat("vi-VN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatSecondsToHms = (seconds) => {
  const safeSeconds = Math.max(Number(seconds || 0), 0);
  const h = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(safeSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const statusMeta = {
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
  },
  paused: {
    label: "Paused",
    className: "bg-amber-100 text-amber-700",
  },
};

const SummaryCard = ({ label, value, helper, colorClass }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
    <p className={`text-2xl font-bold mt-2 ${colorClass}`}>{value}</p>
    {helper ? <p className="text-sm text-gray-500 mt-1">{helper}</p> : null}
  </div>
);

export default function Submissions() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    totalSubmissions: 0,
    averageScore: 0,
    highestScore: 0,
    uniqueStudents: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [filters, setFilters] = useState({
    studentName: "",
    examTitle: "",
    fromDate: "",
    toDate: "",
  });

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [recalculating, setRecalculating] = useState(false);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const resp = await recalculateScores();
      toast.success(resp?.message || "Đã tính lại điểm thành công");
      fetchSubmissions(currentPage);
    } catch (error) {
      const message = error?.response?.data?.message || "Không tính lại được điểm";
      toast.error(message);
    } finally {
      setRecalculating(false);
    }
  };

  const fetchSubmissions = useCallback(async (pageToLoad = currentPage, customFilters = filters) => {
    setLoading(true);
    try {
      const resp = await getAdminSubmissions({
        page: pageToLoad,
        limit: 10,
        ...customFilters,
      });

      setRows(resp?.data || []);
      setSummary({
        totalSubmissions: Number(resp?.summary?.totalSubmissions || 0),
        averageScore: Number(resp?.summary?.averageScore || 0),
        highestScore: Number(resp?.summary?.highestScore || 0),
        uniqueStudents: Number(resp?.summary?.uniqueStudents || 0),
      });
      setCurrentPage(Number(resp?.currentPage || pageToLoad));
      setTotalPages(Math.max(Number(resp?.totalPages || 1), 1));
    } catch (error) {
      const message = error?.response?.data?.message || "Không tải được submissions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage, fetchSubmissions]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilter = () => {
    if (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate) {
      toast.error("Khoảng thời gian không hợp lệ");
      return;
    }
    setCurrentPage(1);
    fetchSubmissions(1, filters);
  };

  const handleResetFilter = () => {
    const initial = {
      studentName: "",
      examTitle: "",
      fromDate: "",
      toDate: "",
    };
    setFilters(initial);
    setCurrentPage(1);
    fetchSubmissions(1, initial);
  };

  const handleOpenDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const resp = await getAdminSubmissionDetail(id);
      setSelectedDetail(resp?.data || null);
    } catch (error) {
      const message = error?.response?.data?.message || "Không tải được chi tiết submission";
      toast.error(message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const resolvedRows = useMemo(() => rows || [], [rows]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submissions</h2>
          <p className="text-sm text-gray-500 mt-1">Theo dõi toàn bộ bài thi đã nộp và xem chi tiết bài làm.</p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 whitespace-nowrap"
          title="Tính lại điểm cho tất cả bài thi có điểm = 0"
        >
          <Calculator size={16} />
          {recalculating ? "Đang tính lại..." : "Tính lại điểm cũ"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Submissions"
          value={summary.totalSubmissions}
          helper="Theo bộ lọc hiện tại"
          colorClass="text-gray-900"
        />
        <SummaryCard
          label="Average Score"
          value={scoreFormatter.format(summary.averageScore)}
          helper="Điểm trung bình"
          colorClass="text-blue-600"
        />
        <SummaryCard
          label="Highest Score"
          value={scoreFormatter.format(summary.highestScore)}
          helper="Điểm cao nhất"
          colorClass="text-emerald-600"
        />
        <SummaryCard
          label="Unique Students"
          value={summary.uniqueStudents}
          helper="Số học viên đã nộp"
          colorClass="text-violet-600"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <Filter size={18} />
          <p className="font-semibold">Bộ lọc submissions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <input
            type="text"
            name="studentName"
            value={filters.studentName}
            onChange={handleFilterChange}
            placeholder="Tìm học viên (tên hoặc email)..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />

          <input
            type="text"
            name="examTitle"
            value={filters.examTitle}
            onChange={handleFilterChange}
            placeholder="Tìm đề thi (tên bài thi)..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />

          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />

          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleApplyFilter}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800"
          >
            Áp dụng
          </button>
          <button
            onClick={handleResetFilter}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Exam</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Submitted At</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resolvedRows.length > 0 ? (
                resolvedRows.map((item) => {
                  const normalizedStatus = (item.status || "completed").toLowerCase();
                  const statusInfo = statusMeta[normalizedStatus] || statusMeta.completed;
                  return (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{item.student?.fullName || "Không xác định"}</p>
                        <p className="text-xs text-gray-500">{item.student?.email || ""}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.exam?.title || "Đề thi đã bị xóa"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{scoreFormatter.format(item.score)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.submittedAt ? dateTimeFormatter.format(new Date(item.submittedAt)) : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleOpenDetail(item._id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Eye size={16} />
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    {loading ? "Đang tải dữ liệu..." : "Không có submissions phù hợp"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Trang <span className="font-semibold">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {selectedDetail && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Chi tiết bài làm</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedDetail.student?.fullName} - {selectedDetail.exam?.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-72px)] space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <SummaryCard
                  label="Score"
                  value={scoreFormatter.format(selectedDetail.score)}
                  colorClass="text-blue-600"
                />
                <SummaryCard
                  label="Correct"
                  value={selectedDetail.summary?.correct || 0}
                  colorClass="text-emerald-600"
                />
                <SummaryCard
                  label="Wrong"
                  value={selectedDetail.summary?.wrong || 0}
                  colorClass="text-red-600"
                />
                <SummaryCard
                  label="Duration"
                  value={formatSecondsToHms(selectedDetail.examCompledTime)}
                  helper={`${selectedDetail.summary?.accuracy || 0}% chính xác`}
                  colorClass="text-gray-900"
                />
              </div>

              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 text-sm font-semibold text-gray-700">
                  Chi tiết đáp án theo câu
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50/80 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Question</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Section</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Your Answer</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Correct Answer</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(selectedDetail.questionDetails || []).length > 0 ? (
                        selectedDetail.questionDetails.map((q) => (
                          <tr key={q.question} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">{q.question}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{q.section}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{q.userAnswer || "(Bỏ trống)"}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{q.correctAnswer || "-"}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                  q.isCorrect
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {q.isCorrect ? "Đúng" : "Sai"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                            Không có dữ liệu chi tiết câu trả lời cho submission này
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingDetail && (
        <div className="fixed inset-0 z-[101] bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-3 text-sm font-medium text-gray-700 shadow-lg">
            Đang tải chi tiết bài làm...
          </div>
        </div>
      )}
    </div>
  );
}
