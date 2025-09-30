import { FaVideo } from "react-icons/fa";
import { useAuth } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";

function FreeLandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const freeCourseId = "68a585edd48cd1dc34b3fb80";

  const handleWatchNow = () => {
    if (user) {
      // User logged in → go directly to course
      navigate(`/watch-course-free/${freeCourseId}`);
    } else {
      // User not logged in → go to signin with state
      navigate("/sign-in", { state: { freeCourseId } });
    }
  };

  return (
    <div className="py-20 flex flex-col items-center justify-center bgGradient-purple-light p-4">
      <div>
        <img
          src="../assets/freeNcert.png"
          alt="Free Course Banner"
          className="w-full lg:h-96 md:h-80 h-64 object-contain"
        />
        <div className="text-center my-8 px-4">
          <button
            onClick={handleWatchNow}
            className="flex items-center justify-center gap-2 bgGredient-purple w-full animate-glow textGold px-6 py-3 rounded-full text-lg font-semibold hover:scale-105 transition duration-200"
          >
            <FaVideo className="w-5 h-5" />
            <span className="inline-block animate-bounce">Click to Watch Classes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FreeLandingPage;
