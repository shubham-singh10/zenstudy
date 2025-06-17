import React from 'react'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
const Pagination = ({currentPage, setCurrentPage, data, itemsPerPage}) => {
    
    // Calculate total number of pages
    const totalPages = Math.ceil(data / itemsPerPage);
    
    
    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <button
                className={`px-6 flex items-center border-[#543a5d] border-2 justify-center py-2 rounded-full ${currentPage === 1 ? 'bg-[#fcedfb]' : 'bg-[#f3cbf0] hover:bg-purple-200'} textPurple font-bold`}
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            >
               <FiChevronLeft  className='h-5 w-5'/> 
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
                className={`px-8 flex items-center justify-center py-2 border-[#543a5d] border-2 rounded-full ${currentPage === totalPages ? 'bg-[#fcedfb]' : 'bg-[#f3cbf0] hover:bg-purple-200'} textPurple font-bold`}
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                 <FiChevronRight className='h-5 w-5'/>
            </button>
        </div>

    )
}

export default Pagination