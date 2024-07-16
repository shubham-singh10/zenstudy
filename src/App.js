import { Fragment, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Loading from "./Loading.jsx";

const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Articles = lazy(() => import("./components/articles/Articles.jsx"));
const ArticleDetail = lazy(() => import("./components/articles/ArticlesDetails.jsx"));
const Courses = lazy(() => import("./components/course/Courses.jsx"));
const CourseDetails = lazy(() => import("./components/course/Coursedetails.jsx"));
const Upsc = lazy(() => import("./components/upsc/Upsc.jsx"));
const UPSCDetails = lazy(() => import("./components/upsc/UPSCDetails.jsx"));
const ContactUs = lazy(() => import("./components/Contact.jsx"));
const Register = lazy(() => import("./components/auth/Register.jsx"));

function App() {
  return (
    <Fragment>
      <NavBar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/article" element={<Articles />} />
          <Route path="/article-details" element={<ArticleDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course-details" element={<CourseDetails />} />
          <Route path="/upsc" element={<Upsc />} />
          <Route path="/upsc-details" element={<UPSCDetails />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Suspense>
      <Footer />
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
