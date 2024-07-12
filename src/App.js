import { Fragment } from "react";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom"
import Home from "./components/Home";
import About from "./components/About";
import Articles from "./components/Articles";
import Footer from "./components/Footer";
import ArticleDetail from "./components/ArticlesDetails";
import Courses from "./components/Courses";
import Upsc from "./components/Upsc";
import ContactUs from "./components/Contact";
function App() {
  return (
    <Fragment>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/article" element={<Articles/>}/>
        <Route path="/article-details" element={<ArticleDetail/>}/>
        <Route path="/courses" element={<Courses/>}/>
        <Route path="/upsc" element={<Upsc/>}/>
        <Route path="/contact" element={<ContactUs/>}/>
      </Routes>
      <Footer/>
    </Fragment>
  );
}

export default App;
