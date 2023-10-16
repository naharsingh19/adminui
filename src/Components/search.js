import React from "react";
import "./search.css";
export default function SearchBox({ searchData, handleSearching }) {
  return (
    <div>
      <input
        type="text"
        className="searching"
        value={searchData}
        onChange={handleSearching}
        placeholder="Search the required row data..."
      />
    </div>
  );
}