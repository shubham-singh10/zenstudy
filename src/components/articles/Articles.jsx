import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import he from 'he';
import Pagination from '../pagination/Pagination';
const Articles = () => {
    const [articlePost, setArticlePost] = useState([]);
    const [articleTotal, setArticleTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState("none");
    const itemperpage = 6
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()

    // Artcile get data API
    useEffect(() => {
        const getarcticle = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${process.env.REACT_APP_API}zenstudy/api/post/getposts?page=${currentPage}&limit=${itemperpage}&category=${category}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                //console.log("Article_data", data)
                setArticlePost(data.posts);
                setArticleTotal(data.totalPages);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        getarcticle()
    }, [currentPage, category])


    const filteredData = articlePost.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())

    );

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
        </div>
    }


    if (error) {
        // navigate(0)
        return <div className="flex items-center justify-center h-screen">
            <div className="text-4xl font-bold text-red-600"> Error: {error.message}. Please refresh the page.</div>
        </div>;
    }

    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

    return (
        <div className="px-0 md:px-10 lg:px-12 m-10">
            <h1 className=' text-2xl mt-10 md:text-3xl lg:text-4xl mb-8 text-center text-[#054BB4] font-semibold'>O<span className='border-b-8 border-[#054BB4]'>ur Blog Pos</span>ts</h1>

            <div className="flex flex-col md:flex-row lg:flex-row justify-between gap-4 my-8 mx-50px">
                <div className="flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4 w-full md:w-1/2 lg:w-1/2 ">
                    <input
                        type="text"
                        placeholder="Search Our Blog Post"
                        onChange={(e) => setSearchText(e.target.value)}
                        className="bg-blue-100 rounded-l-full focus:outline-none  py-2 w-full text-gray-700"
                    />
                    <button className="text-blue-500">
                        <FaSearch /> {/* Assuming Font Awesome is included in the project */}
                    </button>
                </div>
                <div className="flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4 w-full md:w-1/2 lg:w-1/3 ">
                    <select
                        className="bg-blue-100 rounded-l-full focus:outline-none  py-2 w-full text-gray-700"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                    >
                        <option value="none">All Category</option>
                        <option value='HISTORY'>HISTORY</option>
                        <option value='POLITY'>POLITY</option>
                        <option value='GEOGRAPHY'>GEOGRAPHY</option>
                        <option value='ECONOMY'>ECONOMICS</option>
                        <option value='INTERNATIONAL RELATIONS'>INTERNATIONAL RELATIONS</option>
                        <option value='ENVIRONMENT'>ENVIRONMENT</option>
                        <option value='SCIENCE 4 TECH'>SCIENCE & TECH</option>
                        <option value='Security'>Security</option>
                        <option value='Society'>Society</option>
                        <option value='Governance'>Governance</option>
                        <option value='Govt-schemes'>Govt-schemes</option>
                        <option value='Ethics'>Ethics</option>
                        <option value='Others'>Others</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4 mt-10 ">
                {filteredData.length === 0 ? (
                    <div className='text-5xl flex items-center justify-center m-55'>
                        <h1>No Data Found</h1>
                    </div>
                ) : (filteredData.map((post, index) => (
                    <div key={index} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden mb-10 hover:shadow-lg transition duration-300">
                        <img src={post.image} alt={post.title} className="h-full w-full md:w-1/3 object-cover object-center" />
                        <div className="p-4 flex flex-col justify-between flex-1">
                            <div>
                                <h2 className="text-xl font-bold">{post.title}</h2>
                                <p className="text-gray-600 mt-2 text-justify">{stripHtmlTags(he.decode(post.content)).substring(0, 500)}...</p>
                                <div className="flex justify-between mt-2">
                                    <h1 className="text-blue-500 font-extrabold">{post.category}</h1>
                                    <h1 className="text-gray-600 font-extrabold">Author-<span className='text-indigo-500'>{post.userId?.name}</span></h1>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex justify-center gap-1" onClick={() => navigate("/article-details", { state: { postId: post._id } })}>Read More <FiArrowRight className='h-5 w-5' /></button>
                                <span className="text-gray-500">{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                )))}
            </div>
            {!searchText && (<Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                data={articleTotal}
                itemsPerPage={itemperpage}
            />)}
        </div>
    );
};

export default Articles;