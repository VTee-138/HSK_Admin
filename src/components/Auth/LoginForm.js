import { useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService";
import logo from "../../images/logo.png";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const validate = () => {
    if (!email) {
      toast.error("Vui lòng điền thông tin email.");
      return false;
    }
    if (!password) {
      toast.error("Vui lòng điền thông tin mật khẩu.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await login({ email, password });
      if (response?.success && response?.token) {
        const { token, user } = response;
        localStorage.setItem("jwt", JSON.stringify({ token }));
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Chào mừng ${user.fullName || "bạn"}!`);
        navigate(from, { replace: true });
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <style>{`
        @keyframes adminFadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }
        .admin-login-wrap {
          animation: adminFadeInUp 0.45s ease both;
        }
        .admin-input:focus {
          outline: none;
          border-color: transparent !important;
          box-shadow: 0 0 0 2px #dc2626;
        }
        .admin-spin {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: adminSpin 0.7s linear infinite;
        }
      `}</style>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md admin-login-wrap">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div style={{
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              borderRadius: "14px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(220,38,38,0.35)",
            }}>
              <img src="/logo.png" alt="86HSK" style={{ height: "52px", objectFit: "contain" }} />
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#fff",
                background: "#dc2626",
                borderRadius: "6px",
                padding: "2px 8px",
                lineHeight: "1.6",
              }}
            >
              ADMIN
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Xin chào, Admin 👋
            </h1>
            <p className="text-gray-600">
              Đăng nhập để truy cập bảng điều khiển quản trị
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2z"
                    />
                    <polyline
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="22,6 12,13 2,6"
                    />
                  </svg>
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="admin@86hsk.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      />
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span className="admin-spin" />
                  Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} 86HSK · Chỉ dành cho quản trị viên
          </p>
        </div>
      </div>

      {/* Right Side - Admin Brand Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-red-600 to-red-700 items-center justify-center p-12">
        <div className="max-w-md text-white">

          {/* Shield icon */}
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(255,255,255,0.15)"
              />
              <polyline points="9 12 11 14 15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className="text-4xl font-bold mb-4">
            Bảng điều khiển<br />quản trị viên
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Quản lý toàn bộ nền tảng 86HSK từ một nơi duy nhất, an toàn và hiệu quả
          </p>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Quản lý người dùng</p>
                <p className="text-sm text-red-100">Kiểm soát tài khoản học viên & giảng viên</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Quản lý nội dung</p>
                <p className="text-sm text-red-100">Duyệt và quản lý khóa học, bài thi</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <line x1="18" y1="20" x2="18" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="20" x2="12" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="20" x2="6" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Thống kê & Báo cáo</p>
                <p className="text-sm text-red-100">Theo dõi hiệu suất toàn hệ thống</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
