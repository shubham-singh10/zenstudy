import React, { useState, useEffect } from "react"
import { FiSearch, FiBook } from "react-icons/fi"
import ResourceCard from "./resource-card"
import ResourceSkeleton from "./resource-skeleton"
import toast from "react-hot-toast"
import Pagination from "../../../components/pagination/Pagination"
import { debounce } from "lodash"

const FreeResourcesIndex = () => {
    const [resources, setResources] = useState({
        courses: [],
        testSeries: [],
        currentAffairs: [],
    })
    const [loading, setLoading] = useState({
        mainLoading: true,
        paginationLoading: false,
    })

    const [paginatedData, setPaginatedData] = useState({
        currentPage: 1,
        itemperpage: 6,
        totalData: 0,
    })
    const [searchText, setSearchText] = useState("")
    const [activeTab, setActiveTab] = useState("courses")
    const [contentVisible, setContentVisible] = useState(false)


    useEffect(() => {
        const getCourse = async () => {
            setLoading((prev) => ({ ...prev, paginationLoading: true }))
            //   setContentVisible(false)

            try {
                const response = await fetch(`${process.env.REACT_APP_API}zenstudy/api/course/fetchFreeCoursesWithFilters?page=${paginatedData.currentPage}&limit=${paginatedData.itemperpage}&search=${searchText}&catId=${null}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                })

                if (response.status === 404) {
                    setResources(prev => ({
                        ...prev,
                        courses: [],
                    }));
                    setLoading({ mainLoading: false, paginationLoading: false })
                    setTimeout(() => {
                        setContentVisible(true)
                    }, 300)
                    return
                }

                if (!response.ok) throw new Error("Network response was not ok")

                const data = await response.json()
                const mainData = data.courses
                const metaData = data.meta
                setPaginatedData((prev) => ({ ...prev, totalData: metaData.total }))

              
                setResources(prev => ({
                    ...prev,
                    courses: mainData,
                }));
                setLoading({ mainLoading: false, paginationLoading: false })

                // Add a small delay before showing content for a smoother transition
                setTimeout(() => {
                    setContentVisible(true)
                }, 300)
            } catch (error) {
                toast.error(`Oops!! Something went wrong`, { position: "top-center" })
                setLoading({ mainLoading: false, paginationLoading: false })
                setTimeout(() => {
                    setContentVisible(true)
                }, 300)
            }
        }

        getCourse()
    }, [paginatedData.currentPage, searchText, paginatedData.itemperpage, activeTab])


    // Debounced search handler to reduce API calls
    const handleSearchChange = debounce((value) => {
        setSearchText(value)
        setPaginatedData((prev) => ({ ...prev, currentPage: 1 })) // Reset to first page on search
    }, 500)

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    const setCurrentPage = (newPage) => {
        setPaginatedData((prev) => ({ ...prev, currentPage: newPage }))
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className="min-h-screen bg-purple-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold textPurpleGradient mb-4">Free UPSC Resources</h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full md:w-96">
                        <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#543a5d] focus:border-[#543a5d]"
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => handleTabChange("courses")}
                            className={`flex items-center gap-2 py-3 px-6 font-medium text-sm ${activeTab === "courses"
                                ? "border-b-2 border-[#543a5d] textPurple"
                                : "textPurple hover:border-[#efdb78]"
                                }`}
                        >
                            <FiBook className="h-4 w-4" />
                            <span>Free Courses</span>
                        </button>

                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* Courses Tab */}
                    {activeTab === "courses" && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loading.paginationLoading ? (
                                    Array(6)
                                        .fill(0)
                                        .map((_, index) => <ResourceSkeleton key={index} />)
                                ) : resources?.courses?.length === 0 ? (
                                    <div className="col-span-3 text-center py-12">
                                        <p className="text-xl text-gray-500">No courses found matching your search.</p>
                                    </div>
                                ) : (
                                    resources?.courses?.map((course) => (
                                        <ResourceCard
                                            key={course._id}
                                            courseId={course._id}
                                            title={course.title}
                                            description={course.description}
                                            imageUrl={course.thumbnailS3}
                                            language={course.language}
                                            buttonText="Start Learning"
                                            type="course"
                                        />
                                    ))
                                )}
                            </div>
                            <div
                                className={`transition-opacity duration-500 ease-in-out ${contentVisible ? "opacity-100" : "opacity-0"}`}
                            >
                                <Pagination
                                    data={paginatedData.totalData}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={paginatedData.currentPage}
                                    itemsPerPage={paginatedData.itemperpage}
                                />
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default FreeResourcesIndex