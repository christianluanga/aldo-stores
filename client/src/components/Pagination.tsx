import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {

  const handlePagination = (direction: 'back' | 'forward') => {
    direction === 'back'
      ? onPageChange(Math.max(currentPage - 1, 1))
      : onPageChange(Math.min(currentPage + 1, totalPages));
  };

  return (
    <div className="mt-4 flex justify-center items-center space-x-4 pagination">
      <button
        className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 ${
          currentPage === 1 && 'opacity-50'
        }`}
        onClick={() => handlePagination('back')}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 ${
          currentPage === totalPages && 'opacity-50'
        }`}
        onClick={() => handlePagination('forward')}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
