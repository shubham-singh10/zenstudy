import React from 'react'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

const PaginationNew = ({ currentPage, setCurrentPage, data, itemsPerPage }) => {
    const totalPages = data.length > 0 ? Math.ceil(data.length / itemsPerPage) : 1;

    return (
        <div className="flex flex-col items-center space-y-4 mt-10">
            {/* Pagination Info */}
            <span className="text-gray-700 text-sm md:text-base">
                {`Page ${currentPage} of ${totalPages}`}
            </span>

            {/* Pagination Buttons */}
            <div className="flex items-center space-x-4">
                {/* Previous Button */}
                <button
                    className={`flex items-center px-6 py-2  border-[#543a5d] border-2 rounded-full text-sm font-medium transition ${currentPage === 1
                        ? "bg-purple-100 textPurple cursor-not-allowed"
                        : "bg-purple-200 textPurple hover:scale-105"
                        }`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <FiChevronLeft className="w-5 h-5 mr-1" />
                    Previous
                </button>

                {/* Next Button */}
                <button
                    className={`flex items-center border-[#543a5d] border-2 px-6 py-2 rounded-full text-sm font-medium transition ${currentPage === totalPages
                        ? "bg-purple-100 textPurple cursor-not-allowed"
                        : "bg-purple-200 textPurple hover:scale-105"
                        }`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <FiChevronRight className="w-5 h-5 ml-1" />
                </button>
            </div>
        </div>
    )
}

export default PaginationNew
