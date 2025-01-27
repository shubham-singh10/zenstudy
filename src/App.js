import { Fragment, Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Loading from "./Loading.jsx";
import MainLayout from "./MainLayout.jsx";
import StudentLayout from "./studentDashboard/StudentLayout.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { Toaster } from "react-hot-toast";
import CoursesNew from "./components/course/CoursesNew.jsx";
import SignInDynamic from "./components/auth/Sign-inDynamic.jsx";
import OurTeam from "./components/OurTeam.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import LiveClass from "./studentDashboard/component/LiveClass.jsx";
import SignupTest from "./components/auth/SignupTest.jsx";
import PdfViewer from "./components/PdfViewer.jsx";
import DynamicSignUp from "./components/auth/Sign-upDynamic.jsx";
import NewtestPage from "./components/course/newtestPage.jsx";
import HomeNew from "./studentDashboardNew/layout.jsx";
import { AuthProvider } from "./context/auth-context.jsx";
import WatchCourseNew from "./studentDashboard/component/WatchCourseNew.jsx";

const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Courses = lazy(() => import("./components/course/Courses.jsx"));
const CurrentAffair = lazy(() => import("./components/currentAffairs"));
const CourseDetails = lazy(() =>
  import("./components/course/Coursedetails.jsx")
);
const ContactUs = lazy(() => import("./components/Contact.jsx"));
const SignUp = lazy(() => import("./components/auth/Sign-up.jsx"));
const SignIn = lazy(() => import("./components/auth/Sign-In.jsx"));
const ResetPassword = lazy(() =>
  import("./components/auth/Reset-Password.jsx")
);

//Student Dashboard Pages
const Profile = lazy(() => import("./studentDashboard/component/Profile.jsx"));
const CourseDetailsStudent = lazy(() =>
  import("./studentDashboard/component/CourseDeatils.jsx")
);
const CourseDetailsStudentView = lazy(() =>
  import("./studentDashboard/component/CourseDetails-View.jsx")
);
const MyCourses = lazy(() =>
  import("./studentDashboard/component/MyCourses.jsx")
);
const UPSCStudent = lazy(() => import("./studentDashboard/component/Upse.jsx"));
const DailyAffairs = lazy(() => import("./studentDashboard/component/currentAffairs/DailyAffairs.jsx"));
const MonthlyAffairs = lazy(() => import("./studentDashboard/component/currentAffairs/MonthlyAffairs.jsx"));
const TestSeriesPage = lazy(() => import("./studentDashboard/component/TestSeries.jsx"));
const WatchCourse = lazy(() =>
  import("./studentDashboard/component/WatchCourse.jsx")
);

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function App() {
  return (
    <AuthProvider>
      <Fragment>
        <Toaster />
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/ourteam" element={<OurTeam />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/currentAffair" element={<CurrentAffair />} />
              <Route path="/pdfViewer" element={<PdfViewer />} />
              <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/coursesNew" element={<CoursesNew />} />
              <Route path="/testpage" element={<NewtestPage />} />
              <Route path="/course-details/:courseId" element={<CourseDetails />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/sign-Up" element={isAuthenticated() ? <Navigate to="/" /> : <SignUp />} />
              <Route path="/sign-Up-Dynamic/:courseId" element={isAuthenticated() ? <Navigate to="/" /> : <DynamicSignUp />} />
              <Route path="/signtest" element={isAuthenticated() ? <Navigate to="/" /> : <SignupTest />} />
              <Route path="/login/:courseId" element={isAuthenticated() ? <Navigate to="/" /> : <SignInDynamic />} />
              <Route path="/sign-In" element={isAuthenticated() ? <Navigate to="/" /> : <SignIn />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Protected Student Routes */}
            <Route element={<PrivateRoute element={<StudentLayout />} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/course-details-student" element={<CourseDetailsStudent />} />
              <Route path="/course-details-view/:courseId" element={<CourseDetailsStudentView />} />
              <Route path="/mycourse" element={<MyCourses />} />
              <Route path="/liveClass" element={<LiveClass />} />
              <Route path="/upsc-student" element={<UPSCStudent />} />
              <Route path="/watch-course/:id" element={<WatchCourse />} />
              <Route path="/watch-course/:id" element={<WatchCourse />} />
              <Route path="/testSeries" element={<TestSeriesPage />} />
              <Route path="/dailyAffairs" element={<DailyAffairs />} />
              <Route path="/monthlyAffairs" element={<MonthlyAffairs />} />
            </Route>

            {/* Protected Student Routes */}
            <Route element={<PrivateRoute element={<HomeNew />} />}>
              <Route path="/profileNew" element={<Profile />} />
              <Route path="/course-details-studentNew" element={<CourseDetailsStudent />} />
              <Route path="/course-details-viewNew/:courseId" element={<CourseDetailsStudentView />} />
              <Route path="/mycourseNew" element={<MyCourses />} />
              <Route path="/liveClassNew" element={<LiveClass />} />
              <Route path="/upsc-studentNew" element={<UPSCStudent />} />
              <Route path="/watch-courseNew/:id" element={<WatchCourseNew />} />
              <Route path="/testSeriesNew" element={<TestSeriesPage />} />
              <Route path="/dailyAffairsNew" element={<DailyAffairs />} />
              <Route path="/monthlyAffairsNew" element={<MonthlyAffairs />} />
            </Route>

            {/* Fallback Route for 404 */}
            <Route
              path="*"
              element={
                <div className="text-red-600 lg:text-4xl md:text-3xl text-2xl font-bold flex items-center justify-center h-screen ">
                  <div>Page Not Found</div>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Fragment>
    </AuthProvider>
  );
}

export default App;
