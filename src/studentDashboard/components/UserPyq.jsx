import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiFileText } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import Loading from "../../Loading";


const UserPYQ = () => {
  const [Pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    year: "all",
    paper: "all",
    subject: "all",
  });

useEffect(() => {
  setLoading(true);
  const fetchPyqs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API2}zenstudy/api/main/pyq`
      );

      console.log("Response:", response.data.data);
      setPyqs(response.data.data); // axios gives you the data directly
    } catch (error) {
      console.error("Error fetching PYQs:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPyqs();
}, []);



  console.log("Filter:", searchTerm);
  const years = Array.from(new Set(Pyqs?.map((pyq) => pyq.year))).sort(
    (a, b) => b - a
  );
  const subjects = Array.from(new Set(Pyqs?.map((pyq) => pyq.subject)));

  const filteredPYQs = Pyqs?.filter((pyq) => {
    if (filter.year !== "all" && pyq.year !== parseInt(filter.year))
      return false;
    if (filter.paper !== "all" && pyq.paper !== filter.paper) return false;
    if (filter.subject !== "all" && pyq.subject !== filter.subject)
      return false;
    if (
      searchTerm &&
      !pyq.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });


    if (loading) {
      return <Loading />;
    }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Previous Year Questions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Access UPSC previous year question papers for better preparation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="space-y-4">
          <div className="max-w-lg">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiSearch
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search question papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <label
                htmlFor="yearFilter"
                className="block text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <select
                id="yearFilter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter.year}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, year: e.target.value }))
                }
              >
                <option value="all">All Years</option>
                {years?.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label
                htmlFor="paperFilter"
                className="block text-sm font-medium text-gray-700"
              >
                Paper
              </label>
              <select
                id="paperFilter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter.paper}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, paper: e.target.value }))
                }
              >
                <option value="all">All Papers</option>
                <option value="prelims">Prelims</option>
                <option value="mains">Mains</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label
                htmlFor="subjectFilter"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <select
                id="subjectFilter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter.subject}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, subject: e.target.value }))
                }
              >
                <option value="all">All Subjects</option>
                {subjects?.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Question Papers Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPYQs && filteredPYQs?.map((pyq) => (
          <div
            key={pyq._id}
            className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <FiFileText className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {pyq.title}
                  </h3>
                  <p className="text-sm text-gray-500">{pyq.subject}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {pyq.year}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {pyq.paper.charAt(0).toUpperCase() + pyq.paper.slice(1)}
                </span>
              </div>

              <div className="mt-4">
                <a
                  href={pyq.fileUrl}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaEye className="h-4 w-4 mr-2" />
                  View PYQs
                </a>
              </div>
            </div>
          </div>
        ))}

        {Array.isArray(filteredPYQs) && filteredPYQs.length === 0 &&  (
          <div className="col-span-full text-center py-12">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No question papers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters or check back later for new
              uploads.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPYQ;
