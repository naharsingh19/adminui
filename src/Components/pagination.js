import React from "react";
import "./pagination.css";

export default function Pagination({
  totalUsers,
  rowsPerPage,
  currentPage,
  handlePagination
}) {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalUsers / rowsPerPage);
  for (let pageButton = 0; pageButton < totalPages; pageButton++) {
    pageNumbers.push(pageButton + 1);
  }
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  return (
    <div>
      <div className="button-container">
        <button
          type="button"
          className="visit-Page-Button"
          onClick={() => handlePagination(1)}
          disabled={isFirstPage}
        >
          {"<<"}
        </button>
        <button
          type="button"
          className="visit-Page-Button"
          onClick={() => handlePagination(currentPage - 1)}
          disabled={isFirstPage}
        >
          {"<"}
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            type="button"
            className={`visit-Page-Button ${
              number === currentPage ? "active" : ""
            }`}
            onClick={() => handlePagination(number)}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          className="visit-Page-Button"
          onClick={() => handlePagination(currentPage + 1)}
          disabled={isLastPage}
        >
          {">"}
        </button>
        <button
          type="button"
          className="visit-Page-Button"
          onClick={() => handlePagination(pageNumbers.length)}
          disabled={isLastPage}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}
