import React from 'react'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
const PaginationNew = ({currentPage, setCurrentPage, data, itemsPerPage}) => {

    // Calculate the indices for slicing the data array
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  
    // Calculate total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return (
        <div className="flex items-center justify-center space-x-4 mt-10">
            <button
                className={`px-6 flex items-center text-sm justify-center py-2 rounded-full ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-100 hover:bg-blue-200'} text-blue-700 font-bold`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
               <FiChevronLeft  className='h-5 w-5'/> Previous
            </button>
            <span className='text-sm'>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
                className={`px-8 flex items-center justify-center text-sm py-2 rounded-full ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-100 hover:bg-blue-200'} text-blue-700 font-bold`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next <FiChevronRight className='h-5 w-5'/>
            </button>
        </div>

    )
}

export default PaginationNew