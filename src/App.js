import { Fragment, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./Loading.jsx";
import MainLayout from "./MainLayout.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { Toaster } from "react-hot-toast";
import CoursesNew from "./components/course/CoursesNew.jsx";
import SignInDynamic from "./components/auth/Sign-inDynamic.jsx";
import OurTeam from "./components/OurTeam.jsx";
import SignupTest from "./components/auth/SignupTest.jsx";
import PdfViewer from "./components/PdfViewer.jsx";
import DynamicSignUp from "./components/auth/Sign-upDynamic.jsx";
import HomeNew from "./studentDashboard/layout.jsx";
import { AuthProvider } from "./context/auth-context.jsx";
import PublicRoute from "./PublicRoute.jsx";
import Testing from "./components/testing.jsx";
import TestResult from "./studentDashboard/components/testseries/TestResult.jsx";
import TestResultSeries from "./studentDashboard/components/testseries/TestResultSeries.jsx";
import Demopage from "./studentDashboard/components/Demopage.jsx";
import NewCourseDetailPage from "./components/course/CourseDetailNew.jsx";
import LiveCourseDetailStudent from "./studentDashboard/components/LiveCourseDetailsStudent.jsx";
import NotFound from "./components/NotFound.jsx";
import Webinar from "./components/Webinar.jsx";
import VideoPage from "./components/VideoPage.jsx";

const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Courses = lazy(() => import("./components/course/Courses.jsx"));
const CurrentAffair = lazy(() => import("./components/currentAffairs"));
const CourseDetails = lazy(() => import("./components/course/Coursedetails.jsx"));
const CourseDetailsLive = lazy(() => import("./components/course/liveCourseDetails.jsx"));
const ContactUs = lazy(() => import("./components/Contact.jsx"));
const SignUp = lazy(() => import("./components/auth/Sign-up.jsx"));
const SignIn = lazy(() => import("./components/auth/Sign-In.jsx"));
const ResetPassword = lazy(() => import("./components/auth/Reset-Password.jsx"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy.jsx"));
const TermandConditions = lazy(() => import("./components/TermandConditions.jsx"));

//Student Dashboard Pages
const Profile = lazy(() => import("./studentDashboard/components/Profile.jsx"));
const CourseDetailsStudentView = lazy(() => import("./studentDashboard/components/CourseDetails-View.jsx"));
const MyCoursesNew = lazy(() => import("./studentDashboard/components/MyPurchasePage.jsx"));
const UPSCStudent = lazy(() => import("./studentDashboard/components/Upse.jsx"));
const DailyAffairs = lazy(() => import("./studentDashboard/components/currentAffairs/DailyAffairs.jsx"));
const MonthlyAffairs = lazy(() => import("./studentDashboard/components/currentAffairs/MonthlyAffairs.jsx"));
// const TestSeriesPage = lazy(() => import("./studentDashboard/components/TestSeries.jsx"));
const TestSeriesPage = lazy(() => import("./studentDashboard/components/testseries/index.jsx"));
const LiveClass = lazy(() => import("./studentDashboard/components/LiveClass.jsx"));
const WatchCourse = lazy(() => import("./studentDashboard/components/WatchCourse.jsx"));
const CoursesPage = lazy(() => import("./studentDashboard/components/CoursePage.jsx"));
const MaterialsPage = lazy(() => import("./studentDashboard/components/materials/index.jsx"));
const TestSeriesPreview = lazy(() => import("./components/testSeries/index.jsx"));
const FreeResources = lazy(() => import("./studentDashboard/components/free-resources/index.jsx"));
const FreeResourcesWatch = lazy(() => import("./studentDashboard/components/free-resources/WatchCourseFree.jsx"));


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
              <Route path="/webinar" element={<Webinar />} />
              <Route path="/ourteam" element={<OurTeam />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/currentAffair" element={<CurrentAffair />} />
              <Route path="/pdfViewer" element={<PdfViewer />} />
              <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/termandConditions" element={<TermandConditions />} />
              <Route path="/coursesNew" element={<CoursesNew />} />
              <Route path="/courseDetailNew" element={<NewCourseDetailPage />} />
              <Route path="/courseDetailslive/:coursename" element={<CourseDetailsLive />} />
              <Route path="/course-details/:courseId" element={<CourseDetails />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/test-series-preview" element={<TestSeriesPreview />} />
              
              {/* Public Route Start */}
              <Route path="/sign-Up" element={<PublicRoute element={<SignUp />} />} />
              <Route path="/sign-Up-Dynamic/:courseId" element={<PublicRoute element={<DynamicSignUp />} />} />
              <Route path="/signtest" element={<PublicRoute element={<SignupTest />} />} />
              <Route path="/login/:courseId" element={<PublicRoute element={<SignInDynamic />} />} />
              <Route path="/sign-In" element={<PublicRoute element={<SignIn />} />} />
              <Route path="/reset-password" element={<PublicRoute element={<ResetPassword />} />} />
              {/* Public Route End */}
            </Route>



            {/* Protected Student Routes Start */}
            <Route element={<PrivateRoute element={<HomeNew />} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/course-details-student" element={<CoursesPage />} />
              <Route path="/course-details-view/:courseId" element={<CourseDetailsStudentView />} />
              <Route path="/mycourse" element={<MyCoursesNew />} />
              <Route path="/livecourse-details-student/:coursename" element={<LiveCourseDetailStudent />} />
              <Route path="/liveClass" element={<LiveClass />} />
              <Route path="/upsc-student" element={<UPSCStudent />} />
              <Route path="/watch-course/:id" element={<WatchCourse />} />
              <Route path="/dailyAffairs" element={<DailyAffairs />} />
              <Route path="/monthlyAffairs" element={<MonthlyAffairs />} />
              <Route path="/materialsPage" element={<MaterialsPage />} />

              <Route path="/testSeries" element={<TestSeriesPage />} />
              <Route path="/testResult" element={<TestResult />} />
              <Route path="/resultSeries" element={<TestResultSeries />} />
              <Route path="/free-resources" element={<FreeResources />} />
              <Route path="/watch-course-free/:id" element={<FreeResourcesWatch />} /> 
              <Route path="/demo" element={<Demopage />} />

              {/* Protected Student Routes End */}
            </Route>

            {/* Fallback Route for 404 */}
            <Route
              path="*"
              element={
               <NotFound />
              }
            />
          </Routes>
        </Suspense>
      </Fragment>
    </AuthProvider>
  );
}

export default App;
