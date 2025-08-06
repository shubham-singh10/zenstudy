import { Fragment, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth-context.jsx";
import { Toaster } from "react-hot-toast";

const Loading = lazy(() => import("./Loading.jsx"));
const MainLayout = lazy(() => import("./MainLayout.jsx"));
const PrivateRoute = lazy(() => import("./PrivateRoute.jsx"));
const PublicRoute = lazy(() => import("./PublicRoute.jsx"));

const SignInDynamic = lazy(() => import("./components/auth/Sign-inDynamic.jsx"));
const SignupTest = lazy(() => import("./components/auth/SignupTest.jsx"));
const DynamicSignUp = lazy(() => import("./components/auth/Sign-upDynamic.jsx"));

const HomeNew = lazy(() => import("./studentDashboard/layout.jsx"));
const TestResult = lazy(() => import("./studentDashboard/components/testseries/TestResult.jsx"));
const TestResultSeries = lazy(() => import("./studentDashboard/components/testseries/TestResultSeries.jsx"));
const Demopage = lazy(() => import("./studentDashboard/components/Demopage.jsx"));
const LiveCourseDetailStudent = lazy(() => import("./studentDashboard/components/LiveCourseDetailsStudent.jsx"));
const UserPYQ = lazy(() => import("./studentDashboard/components/UserPyq.jsx"));

const PdfViewer = lazy(() => import("./components/PdfViewer.jsx"));
const OurTeam = lazy(() => import("./components/OurTeam.jsx"));
const Testing = lazy(() => import("./components/testing.jsx"));
const NewCourseDetailPage = lazy(() => import("./components/course/CourseDetailNew.jsx"));
const Webinar = lazy(() => import("./components/Webinar.jsx"));
const NotFound = lazy(() => import("./components/NotFound.jsx"));

const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const WhatsappChannel = lazy(() => import("./components/WhatsappChannel.jsx"));
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
const TestSeriesPage = lazy(() => import("./studentDashboard/components/testseries/index.jsx"));
const LiveClass = lazy(() => import("./studentDashboard/components/LiveClass.jsx") );
const WatchCourse = lazy(() => import("./studentDashboard/components/WatchCourse.jsx"));
const CourseDetailNew = lazy(() => import("./studentDashboard/components/CourseDetailNew.jsx"));
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
              <Route path="/whatsapp-link" element={<WhatsappChannel />} />
              <Route path="/webinar" element={<Webinar />} />
              <Route path="/ourteam" element={<OurTeam />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/currentAffair" element={<CurrentAffair />} />
              <Route path="/pdfViewer" element={<PdfViewer />} />
              <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
              <Route
                path="/termandConditions"
                element={<TermandConditions />}
              />
              <Route
                path="/courseDetailNew/:courseId"
                element={<NewCourseDetailPage />}
              />
              <Route
                path="/courseDetailslive/:coursename"
                element={<CourseDetailsLive />}
              />
              <Route
                path="/course-details/:courseId"
                element={<CourseDetails />}
              />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/testing" element={<Testing />} />
              <Route
                path="/test-series-preview"
                element={<TestSeriesPreview />}
              />

               {/* Public Route Start */}
              <Route
                path="/sign-up"
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                }
              />
              <Route
                path="/sign-up-dynamic/:courseId"
                element={
                  <PublicRoute>
                    <DynamicSignUp />
                  </PublicRoute>
                }
              />
              <Route
                path="/signtest"
                element={
                  <PublicRoute>
                    <SignupTest />
                  </PublicRoute>
                }
              />
              <Route
                path="/login/:courseId"
                element={
                  <PublicRoute>
                    <SignInDynamic />
                  </PublicRoute>
                }
              />
              <Route
                path="/sign-in"
                element={
                  <PublicRoute>
                    <SignIn />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPassword />
                  </PublicRoute>
                }
              />
              {/* Public Route End */}
            </Route>

            {/* Protected Student Routes Start */}
            <Route
              element={
                <PrivateRoute>
                  <HomeNew />
                </PrivateRoute>
              }
            >
              <Route path="/profile" element={<Profile />} />
              <Route path="/course-details-student" element={<CoursesPage />} />
              <Route
                path="/course-details-view/:courseId"
                element={<CourseDetailsStudentView />}
              />
              <Route
                path="/course-detail-new/:courseId"
                element={<CourseDetailNew />}
              />
              <Route path="/mycourse" element={<MyCoursesNew />} />
              <Route
                path="/livecourse-details-student/:coursename"
                element={<LiveCourseDetailStudent />}
              />
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
              <Route
                path="/watch-course-free/:id"
                element={<FreeResourcesWatch />}
              />
              <Route path="/demo" element={<Demopage />} />
              <Route path="/pyqs" element={<UserPYQ />} />

              {/* Protected Student Routes End */}
            </Route>

            {/* Fallback Route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Fragment>
    </AuthProvider>
  );
}

export default App;
