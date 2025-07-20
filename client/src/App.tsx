import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Loader from "./components/shared/Loader";
import Layout from "./components/shared/Layout";
const PageNotFound = lazy(() => import("./features/pagenotfound/index"));
const Home = lazy(() => import("./features/home/index"));
const Login = lazy(() => import("./features/auth/login/Login"));
const Signup = lazy(() => import("./features/auth/signup/Signup"));
const ForgotPassword = lazy(
  () => import("./features/auth/forgotpassword/ForgotPassword")
);
const ResetPassword = lazy(
  () => import("./features/auth/resetPassword/ResetPassword")
);
const VerifyEmail = lazy(
  () => import("./features/auth/emailVerification/VerifyEmail")
);

const App = () => {
  const queryClient = new QueryClient();
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
            </Route>

            <Route path="/signup" element={<Signup />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
