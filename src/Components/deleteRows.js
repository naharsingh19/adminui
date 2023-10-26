import React from "react";
import "./deleteRows.css";
export default function DeleteSelected({ handleDeleteSelected, rowsSelected }) {
  return (
    <div>
      <button
        type="button"
        className="deleteButton"
        onClick={() => handleDeleteSelected()}
        disabled={rowsSelected.length === 0}
      >
        Delete Selected
      </button>
    </div>
  );
}
