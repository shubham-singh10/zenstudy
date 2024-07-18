import { Fragment, Suspense, lazy } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import Loading from "./Loading.jsx";
import MainLayout from "./MainLayout.jsx";
import StudentLayout from "./studentDashboard/StudentLayout.jsx";

const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Articles = lazy(() => import("./components/articles/Articles.jsx"));
const ArticleDetail = lazy(() => import("./components/articles/ArticlesDetails.jsx"));
const Courses = lazy(() => import("./components/course/Courses.jsx"));
const CourseDetails = lazy(() => import("./components/course/Coursedetails.jsx"));
const Upsc = lazy(() => import("./components/upsc/Upsc.jsx"));
const UPSCDetails = lazy(() => import("./components/upsc/UPSCDetails.jsx"));
const ContactUs = lazy(() => import("./components/Contact.jsx"));
const SignUp = lazy(() => import("./components/auth/Sign-up.jsx"));
const SignIn = lazy(() => import("./components/auth/Sign-In.jsx"));
const ResetPassword = lazy(() => import("./components/auth/Reset-Password.jsx"));

//Student Dashboard Pages
const Profile = lazy(() => import("./studentDashboard/component/Profile.jsx"))
const CourseDetailsStudent = lazy(() => import("./studentDashboard/component/CourseDeatils.jsx"))
const UPSCStudent = lazy(() => import("./studentDashboard/component/Upse.jsx"))

function App() {
  const navigate = useNavigate()
  const isAuthenticated = !!Cookies.get('access_token')
  return (
    <Fragment>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/article" element={<Articles />} />
            <Route path="/article-details" element={<ArticleDetail />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course-details" element={<CourseDetails />} />
            <Route path="/upsc" element={<Upsc />} />
            <Route path="/upsc-details" element={<UPSCDetails />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/sign-Up" element={<SignUp />} />
            <Route path="/sign-In" element={<SignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<StudentLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/course-details-student" element={<CourseDetailsStudent />} />
            <Route path="/course-details-student" element={<CourseDetailsStudent />} />
            <Route path="/upsc-student" element={<UPSCStudent />} />
          </Route>
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Suspense>
    </Fragment>
  );
}

export default App;



// import { Fragment } from "react";
// import NavBar from "./components/NavBar";
// import { Route, Routes } from "react-router-dom"
// import Home from "./components/Home";
// import About from "./components/About";
// import Articles from "./components/Articles";
// import Footer from "./components/Footer";
// import ArticleDetail from "./components/ArticlesDetails";
// import Courses from "./components/Courses";
// import Upsc from "./components/Upsc";
// import ContactUs from "./components/Contact";
// function App() {
//   return (
//     <Fragment>
//       <NavBar />
//       <Routes>
//         <Route path="/" element={<Home/>}/>
//         <Route path="/about" element={<About/>}/>
//         <Route path="/article" element={<Articles/>}/>
//         <Route path="/article-details" element={<ArticleDetail/>}/>
//         <Route path="/courses" element={<Courses/>}/>
//         <Route path="/upsc" element={<Upsc/>}/>
//         <Route path="/contact" element={<ContactUs/>}/>
//       </Routes>
//       <Footer/>
//     </Fragment>
//   );
// }

// export default App;
