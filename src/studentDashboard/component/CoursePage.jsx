import React from "react"
import { useState, useEffect } from "react"
import { BiSort } from "react-icons/bi"
import { FiChevronDown, FiChevronRight, FiSearch } from "react-icons/fi"
import { RiSortAsc, RiSortDesc } from "react-icons/ri"

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    title: "Introduction to React",
    instructor: "John Doe",
    price: 49.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    students: 1234,
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    instructor: "Jane Smith",
    price: 69.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    students: 2345,
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Bob Johnson",
    price: 59.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    students: 3456,
  },
  {
    id: 4,
    title: "Machine Learning Fundamentals",
    instructor: "Alice Brown",
    price: 79.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    students: 4567,
  },
  {
    id: 5,
    title: "Web Design Principles",
    instructor: "Charlie Green",
    price: 39.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.4,
    students: 5678,
  },
  {
    id: 6,
    title: "Mobile App Development with React Native",
    instructor: "David White",
    price: 69.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    students: 6789,
  },
  {
    id: 7,
    title: "Database Management with SQL",
    instructor: "Eva Black",
    price: 54.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    students: 7890,
  },
  {
    id: 8,
    title: "Cybersecurity Essentials",
    instructor: "Frank Gray",
    price: 64.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    students: 8901,
  },
  {
    id: 9,
    title: "Digital Marketing Strategies",
    instructor: "Grace Taylor",
    price: 49.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    students: 9012,
  },
  {
    id: 10,
    title: "Cloud Computing with AWS",
    instructor: "Henry Lee",
    price: 74.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    students: 10123,
  },
]

const CoursesPage= () => {
  const [courses, setCourses] = useState(mockCourses)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("rating")
  const [sortOrder, setSortOrder] = useState("desc")
  const coursesPerPage = 6

  useEffect(() => {
    // Sort and filter courses based on search term and sort options
    const filteredCourses = mockCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filteredCourses.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] - b[sortBy]
      } else {
        return b[sortBy] - a[sortBy]
      }
    })

    setCourses(filteredCourses)
    setCurrentPage(1)
  }, [searchTerm, sortBy, sortOrder])

  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("desc")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Courses</h1>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleSort("price")}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              Price
              {sortBy === "price" && (sortOrder === "asc" ? <RiSortAsc size={20} /> : <RiSortDesc size={20} />)}
            </button>
            <button
              onClick={() => handleSort("rating")}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              Rating
              {sortBy === "rating" && (sortOrder === "asc" ? <RiSortAsc size={20} /> : <RiSortDesc size={20} />)}
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">${course.price.toFixed(2)}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-2">({course.students} students)</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Buy Now
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <FiChevronDown className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === index + 1
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(courses.length / coursesPerPage)}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default CoursesPage

