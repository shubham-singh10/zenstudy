import React, { useCallback, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FaThumbsUp } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import he from "he";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { ImSpinner2 } from "react-icons/im";

const ArticleDetail = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(false);
  const [articlePost, setArticlePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingC, setLoadingC] = useState(false);
  const [loadingL, setLoadingL] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set()); // Track expanded comments
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = location.state || {};
  const maxWordCount = 200;

  useEffect(() => {
    const token = Cookies.get("access_tokennew");
    if (token) {
      try {
        setCurrentUser(token);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    const storedLikedComments = JSON.parse(
      localStorage.getItem("likedComments")
    );
    if (storedLikedComments) {
      setLikedComments(new Set(storedLikedComments));
    }
  }, []);

  const handleCommentChange = (e) => {
    if (e.target.value.split(" ").length <= maxWordCount) {
      setComment(e.target.value);
    }
  };

  const handleAddComment = async () => {
    setLoadingC(true);
    try {
      const sendData = {
        postId: postId,
        userId: currentUser,
        content: comment,
      };
      if (!comment) {
        return response.status(400).json({ message: "Fill The Comment Box" });
      }
      const response = await fetch(`
        ${process.env.REACT_APP_API}zenstudy/api/comment/createnew`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      //console.log("Comment", data);
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Comment Sent Successfully!",
          timer: 3000,
          text: "Thank you for reaching out. We will get back to you soon.",
        });
      }
      setLoadingC(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingC(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    //console.log("Id", commentId);
    setLoadingL(true);
    try {
      const response = await fetch(`
        ${process.env.REACT_APP_API}zenstudy/api/comment/likeCommentNew/${commentId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      //console.log("Comment_Like", data);
      if (data.comment.likes && data.comment.likes.includes(currentUser)) {
        setLikedComments((prev) => {
          const updatedLikes = new Set(prev).add(commentId);
          localStorage.setItem(
            "likedComments",
            JSON.stringify([...updatedLikes])
          );
          return updatedLikes;
        });
        setLikeCounts((prev) => ({
          ...prev,
          [commentId]: (prev[commentId] || 0) + 1,
        }));
        Swal.fire({
          icon: "success",
          title: "Liked!",
          text: "You liked this comment.",
          timer: 2000,
        });
      } else {
        setLikedComments((prev) => {
          const updatedLikes = new Set(prev);
          updatedLikes.delete(commentId);
          localStorage.setItem(
            "likedComments",
            JSON.stringify([...updatedLikes])
          );
          return updatedLikes;
        });
        setLikeCounts((prev) => ({
          ...prev,
          [commentId]: (prev[commentId] || 1) - 1,
        }));
        Swal.fire({
          icon: "error",
          title: "Disliked!",
          text: "You disliked this comment.",
          timer: 2000,
        });
      }
      setLoadingL(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingL(false);
    }
  };

  const getComment = useCallback(async () => {
    try {
      const response = await fetch(`
        ${process.env.REACT_APP_API}zenstudy/api/comment/getPostComments/${postId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setComments(data);
      const initialLikeCounts = data.reduce((acc, comment) => {
        acc[comment._id] = comment.likes.length;
        return acc;
      }, {});
      setLikeCounts(initialLikeCounts);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [postId]);

  useEffect(() => {
    const getArticle = async () => {
      try {
        const response = await fetch(`
          ${process.env.REACT_APP_API}zenstudy/api/post/getPostDetails/${postId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setArticlePost(data.postDetails);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getArticle();
    getComment();
  }, [postId, getComment]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <div className="text-4xl font-bold animate-pulse">Zenstudy</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold text-red-600">
          {" "}
          Error: Please refresh the page.
        </div>
      </div>
    );
  }

  const decodedContent = articlePost ? he.decode(articlePost.content) : "";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mx-auto p-4">
      <button
        className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4 flex justify-between ml-2 lg:ml-12 mt-2 "
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="w-5 h-5" />
        Back
      </button>
      <h1 className="text-2xl font-bold text-blue-600 text-center">
        {articlePost !== null && articlePost?.title}
      </h1>

      <div className="my-4 px-6  md:px-32 lg:px-40">
        <img
          src={articlePost !== null && articlePost?.image}
          alt={articlePost?.title}
          className="w-full h-fit"
        />
      </div>

      <div
        className="p-4 md:p-8 lg:p-12 space-y-4 -mt-20 lg:-mt-14"
        dangerouslySetInnerHTML={{ __html: decodedContent }}
      />

      {currentUser ? (
        <div className="sm:px-2 md:px-6 lg:px-12">
          <div className="flex items-center mb-4">
            <img
              src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="User"
              className="w-10 h-10 rounded-full mr-2 object-cover"
            />
            <span className="text-blue-600 font-bold">Name</span>
          </div>

          <div className="bg-blue-100 p-4 rounded-3xl sm:px-0 md:px-20 lg:px-52 mx-0 text-center">
            <textarea
              className="w-full h-20 p-4 bg-white-200 rounded-full outline-none"
              placeholder="Add Comment"
              value={comment}
              onChange={handleCommentChange}
            />
            <div className="text-left text-blue-600 mt-2">
              {maxWordCount - comment.split(" ").length} Words left
            </div>
          </div>
          <div
            style={{ marginTop: "-20px", float: "right", marginRight: "50px" }}
          >
            <button
              className="bg-blue-600 text-right text-white px-10 py-2 rounded-full mt-2"
              onClick={handleAddComment}
              disabled={loadingC}
            >
              {loadingC ? "Please wait..." : "Send"}
            </button>
          </div>
          <br />

          {comments ? (
            comments.map((cdata) => {
              const isExpanded = expandedComments.has(cdata._id);
              const commentContent = cdata?.content || "";
              const truncatedContent =
                commentContent.length > maxWordCount
                  ? commentContent.substring(0, maxWordCount) + "..."
                  : commentContent;

              return (
                <div className="flex items-start m-4" key={cdata?._id}>
                  <img
                    src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="User"
                    className="lg:w-10 lg:h-10 h-7 w-7 rounded-full mr-2 object-cover"
                  />
                  <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg w-full hover:shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-600 font-bold lg:text-lg md:text-lg text-sm">
                        {cdata?.userId?.name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <p className="text-justify lg:text-sm md:text-sm text-[12px] text-gray-700">
                        {isExpanded ? commentContent : truncatedContent}
                      </p>
                      {commentContent.length > maxWordCount && (
                        <button
                          className="text-blue-500 font-medium lg:text-sm md:text-sm text-[10px] text-start"
                          onClick={() => {
                            setExpandedComments((prev) => {
                              const newExpandedComments = new Set(prev);
                              if (isExpanded) {
                                newExpandedComments.delete(cdata._id);
                              } else {
                                newExpandedComments.add(cdata._id);
                              }
                              return newExpandedComments;
                            });
                          }}
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                        </button>
                      )}
                      <div className="flex justify-between items-center ">
                        <span className="text-blue-300 lg:text-sm md:text-sm text-[10px] font-medium">
                          {formatDate(cdata?.createdAt)}
                        </span>
                        <div className="flex gap-5 items-center">
                          {loadingL && likedComments.has(cdata._id) ? (
                            <ImSpinner2 className="text-blue-500 h-8 w-8 animate-spin" />
                          ) : (
                            <FaThumbsUp
                              className={`lg:h-5 md:h-5 h-4  w-auto cursor-pointer ${
                                likedComments.has(cdata._id)
                                  ? "text-blue-500"
                                  : "text-gray-500"
                              }`}
                              onClick={() => handleLikeComment(cdata._id)}
                            />
                          )}
                          <span>{likeCounts[cdata._id] || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h1>No comment Found</h1>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap text-center justify-center m-4">
          <div className="text-2xl lg:text-4xl md:text-3xl">
            Please login to comment
          </div>
          <button className="bg-blue-600 text-white rounded-lg p-2 ml-4">
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;