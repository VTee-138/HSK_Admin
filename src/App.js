import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get } from "./common/apiClient"; // nếu chưa có, tạo apiClient giống FE hoặc import nếu có
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import LoginForm from "./components/Auth/LoginForm";
import Home from "./components/Admin/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        {/* <Route path="/exam-papers" element={<ExamPapersComponent />} />
        <Route
          path="exam-papers/detail/:examId"
          element={<ExecuteTestComponent />}
        />
        <Route
          path="/practice-exercises"
          element={<PracticeExercisesComponent />}
        />
        <Route
          path="exam-papers/view-selected-answer/:examId"
          element={<ViewSelectedAnswer />}
        /> */}

        {/* <Route path="/user-ranks" element={<ViewRankUsers />} />
        <Route path="/account-info" element={<AccountInfo />} /> */}
      </Route>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginForm />} />
      </Route>
    </Route>
  )
);
function App() {
  const currentVersionRef = useRef(null);
  const VERSION_CHECK_INTERVAL_MS = 60 * 1000;

  useEffect(() => {
    let isMounted = true;

    const checkAppVersion = async () => {
      try {
        const response = await get("/version");
        const serverVersion = response?.version || "0.0.0";

        if (!isMounted) return;

        if (!currentVersionRef.current) {
          currentVersionRef.current = serverVersion;
          console.info("Admin version initialized", serverVersion);
          return;
        }

        if (serverVersion !== currentVersionRef.current) {
          console.info("Admin new version detected", serverVersion, "old", currentVersionRef.current);
          toast.info("Đã phát hiện bản mới. Tự động nạp lại...");
          currentVersionRef.current = serverVersion;
          setTimeout(() => window.location.reload(), 1200);
        }
      } catch (err) {
        console.warn("Không thể kiểm tra version Admin", err);
      }
    };

    checkAppVersion();
    const interval = setInterval(checkAppVersion, VERSION_CHECK_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
