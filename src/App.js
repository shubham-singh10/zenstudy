import { Fragment, Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Loading from "./Loading.jsx";
import MainLayout from "./MainLayout.jsx";
import StudentLayout from "./studentDashboard/StudentLayout.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { Toaster } from "react-hot-toast";
import CoursesNew from "./components/course/CoursesNew.jsx";
import SignInDynamic from "./components/auth/Sign-inDynamic.jsx";
import Cookies from "js-cookie";
import OurTeam from "./components/OurTeam.jsx";

const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Courses = lazy(() => import("./components/course/Courses.jsx"));
const CourseDetails = lazy(() => import("./components/course/Coursedetails.jsx"));
const ContactUs = lazy(() => import("./components/Contact.jsx"));
const SignUp = lazy(() => import("./components/auth/Sign-up.jsx"));
const SignIn = lazy(() => import("./components/auth/Sign-In.jsx"));
const ResetPassword = lazy(() => import("./components/auth/Reset-Password.jsx"));

//Student Dashboard Pages
const Profile = lazy(() => import("./studentDashboard/component/Profile.jsx"))
const CourseDetailsStudent = lazy(() => import("./studentDashboard/component/CourseDeatils.jsx"))
const CourseDetailsStudentView = lazy(() => import("./studentDashboard/component/CourseDetails-View.jsx"))
const MyCourses = lazy(() => import("./studentDashboard/component/MyCourses.jsx"))
const UPSCStudent = lazy(() => import("./studentDashboard/component/Upse.jsx"))
const WatchCourse = lazy(() => import("./studentDashboard/component/WatchCourse.jsx"))
// const ZoomClasses = lazy(() => import("./studentDashboard/component/ZoomClasses.jsx"))

function isAuthenticated() {
  
  return !!Cookies.get('access_tokennew');
}

function App() {
  return (
    <Fragment>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />     
            <Route path="/ourteam" element={<OurTeam />} />            
            <Route path="/courses" element={<Courses />} />
            <Route path="/coursesNew" element={<CoursesNew />} />
            <Route path="/course-details/:courseId" element={<CourseDetails />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route 
            path="/sign-Up" 
            element={isAuthenticated() ? <Navigate to="/" /> : <SignUp />} 
          />
          <Route 
            path="/login/:courseId" 
            element={isAuthenticated() ? <Navigate to="/" /> : <SignInDynamic />} 
          />
          <Route 
            path="/sign-In" 
            element={isAuthenticated() ? <Navigate to="/" /> : <SignIn />} 
          />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<PrivateRoute element={<StudentLayout />} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/course-details-student" element={<CourseDetailsStudent />} />
            <Route path="/course-details-view/:courseId" element={<CourseDetailsStudentView />} />
            <Route path="/mycourse" element={<MyCourses />} />
            <Route path="/upsc-student" element={<UPSCStudent />} />
            <Route path="/watch-course/:id" element={<WatchCourse />} />
            {/* <Route path="/live-class" element={<ZoomClasses />} /> */}
          </Route>
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Suspense>
    </Fragment>
  );
}

export default App;

