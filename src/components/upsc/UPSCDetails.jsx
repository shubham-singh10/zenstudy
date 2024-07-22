import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiThumbsUp } from "react-icons/fi";
import { BsFillReplyFill, BsReply } from "react-icons/bs";
import { useLocation, useNavigate } from 'react-router-dom';
import he from 'he';


const UPSCDetails = () => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [currentUser, setcurrentUser] = useState(false)
    const [articlePost, setArticlePost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const location = useLocation()
    const { postId } = location.state || {}
    const maxWordCount = 200;


    const handleCommentChange = (e) => {
        if (e.target.value.split(' ').length <= maxWordCount) {
            setComment(e.target.value);
        }
    };


    const handleAddComment = () => {
        if (comment.trim()) {
            setComments([...comments, comment]);
            setComment('');
        }
    };


    // Perticular Artcile get data API
    useEffect(() => {


        const getArticle = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API2}zenstudy/api/post/getPostDetails/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("UPSC_Deatils_data", data);
                setArticlePost(data.postDetails);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        getArticle()


    }, [postId])


    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            <div className="text-4xl font-bold animate-pulse">ZenStudy.</div>
        </div>
    }


    if (error) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-4xl font-bold text-red-600"> Error: Please refresh the page.</div>
        </div>;
    }
    const decodedContent = articlePost ? he.decode(articlePost.content) : '';


    return (
        <div className="container mx-auto p-4">
            <button className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4 flex justify-between ml-2 lg:ml-12 mt-2 ' onClick={() => navigate(-1)}><FiArrowLeft className='w-5 h-5' />Back</button>
            <h1 className="text-2xl font-bold text-blue-600 text-center">{articlePost !== null && (articlePost?.title)}</h1>


            <div className="my-4 px-6 md:px-32 lg:px-40">
                <img src={articlePost !== null && (articlePost?.image)} alt={articlePost?.title} className="w-full h-fit" />
            </div>


            <div className="p-4 md:p-8 lg:p-12 space-y-4 -mt-20 lg:-mt-14 " dangerouslySetInnerHTML={{ __html: decodedContent }} />


            {currentUser ? (<div className="sm:px-2 md:px-6 lg:px-12">
                <div className="flex items-center mb-4">
                    <img
                        src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="User"
                        className="w-10 h-10 rounded-full mr-2 object-cover"
                    />
                    <span className="text-blue-600 font-bold">Name</span>
                </div>


                <div className="bg-blue-100 p-4  rounded-3xl   sm:px-0 md:px-20 lg:px-52  mx-0 text-center">
                    <textarea
                        className=" w-full h-20 p-4 bg-white-200 rounded-full outline-none "
                        placeholder="Add Comment"
                        value={comment}
                        onChange={handleCommentChange}
                    />
                    <div className="text-left text-blue-600 mt-2">
                        {maxWordCount - comment.split(' ').length} Words left
                    </div>


                </div>
                <div style={{ marginTop: "-20px", float: 'right', marginRight: "50px" }}>
                    <button
                        className="bg-blue-600 text-right text-white px-10 py-2 rounded-full mt-2 "
                        onClick={handleAddComment}>
                        Send
                    </button>
                </div>
                <br></br>


                <div className="flex items-start m-4">
                    <img
                        src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="User"
                        className="w-10 h-10 rounded-full mr-2 object-cover" />
                    <div className="flex flex-col bg-white p-4 rounded-lg shadow-md w-full">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-600 font-bold">Name</span>
                        </div>
                        <div className='flex flex-col'>
                            <p className='mb-4 text-justify'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos aliquam beatae illo eius accusantium provident eos corrupti asperiores vero, inventore reiciendis eaque aliquid. Rerum dolor suscipit voluptate officiis libero, minus assumenda adipisci eaque perferendis fugiat, possimus temporibus, soluta magni numquam? Dolorem eveniet cupiditate quaerat nisi laborum nulla enim deleniti distinctio ipsa sunt. Officia minus itaque ipsum quidem sit at, voluptatem adipisci minima omnis vitae. Quia accusamus perspiciatis, totam enim possimus sint quas repellat eius doloremque tempore, eos molestiae obcaecati laudantium est laboriosam culpa officia at animi? Debitis repudiandae iste voluptate eveniet veniam aliquam harum nam, tenetur adipisci, perferendis nulla earum rerum consequuntur nisi quasi ipsum error magnam, officia esse voluptatibus nesciunt assumenda accusantium? Aut, ea atque quia, laudantium mollitia dolores, omnis suscipit labore veniam sint nisi. Blanditiis consectetur ducimus sapiente magni numquam dolorem? Excepturi possimus doloremque ab esse similique nam, provident consectetur maiores cum illum atque eius reprehenderit deleniti nihil magnam quos, obcaecati non cumque quisquam amet at odio eaque! Laborum, omnis obcaecati earum rerum quod explicabo reiciendis corrupti itaque, inventore, atque mollitia nihil natus repellat alias? Eligendi illo neque porro numquam minima maxime doloremque laboriosam esse aspernatur repellat quo magni culpa perspiciatis facere, ducimus sapiente reprehenderit alias aut veritatis?
                            </p>
                            <div className='flex justify-end items-center gap-5'>
                                <FiThumbsUp className='text-blue-500 h-10 w-10 cursor-pointer' />


                                <BsFillReplyFill className='text-blue-500 h-10 w-10 cursor-pointer' />


                            </div>
                        </div>
                    </div>
                </div>


            </div>) : (
                <div className='flex flex-wrap text-center justify-center m-4'>
                    <div className='text-2xl md:text-3xl lg:text-4xl '>Please login to comment</div>
                    <button className='bg-blue-600 text-white rounded-lg p-2 ml-4'>Login</button>
                </div>
            )}
        </div>
    );
}




export default UPSCDetails;