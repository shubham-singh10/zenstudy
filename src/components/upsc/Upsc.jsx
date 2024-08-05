

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import he from 'he';
import { FiArrowRight } from 'react-icons/fi';
import PaginationNew from '../../components/pagination/PaginationNew';

const Upsc = () => {
  const [UpscPost, setUpscPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState("none");
  const itemperpage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  // Artcile get data API
  useEffect(() => {
    const getupscarcticle = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}zenstudy/api/post/getposts`, {
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
        const otherPosts = data.posts.filter(post => post.category === 'Others');
       // //console.log("Upsc_data", otherPosts)
        setUpscPost(otherPosts);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }


    getupscarcticle()
  }, [currentPage])

  const filteredData = UpscPost.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchText.toLowerCase());
    return titleMatch
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, category])
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

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemperpage,
    currentPage * itemperpage
  )

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="px-0 md:px-10 lg:px-12 m-10 mt-20">
      {paginatedData.map((card, index) => (
        <div key={index} className="bg-white shadow-md rounded-md overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row">
            <img
              src={card.image}
              alt="Course"
              className="w-full md:w-1/4 object-cover"
            />
            <div className="p-4 md:p-6 flex-1">
              <h2 className="text-lg md:text-xl font-bold mb-2">{card.title}</h2>
              <p className="text-sm md:text-base mb-4">{stripHtmlTags(he.decode(card.content)).substring(0, 500)}...</p>
              <div className="flex justify-between items-center">

                <span className="text-gray-500">{formatDate(card.createdAt)}</span>
              </div>
              <button className="mt-4 flex justify-center items-center gap-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={() => navigate("/upsc-details", { state: { postId: card._id } })}>
                Read More <FiArrowRight className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
      ))}
      <PaginationNew
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        data={filteredData}
        itemsPerPage={itemperpage}
      />
    </div>
  );
};


export default Upsc;
