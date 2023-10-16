import "./tableOfUsers.css";
import SearchBox from "./search";
import DeleteSelected from "./deleteRows";
import Pagination from "./pagination";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TableData() {
    
  const [usersdata, setUsersdata] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchData, setSearchData] = useState("");

  const [allChecked, setAllChecked] = useState(false);
  const [pageAllChecked, setPageAllChecked] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});

  const [rowsSelected, setRowsSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;
  const firstUser_Index = (currentPage - 1) * rowsPerPage;
  const lastUser_Index = Math.min(
    firstUser_Index + rowsPerPage,
    filteredUsers.length
  );
  const currentPageUsers = filteredUsers.slice(firstUser_Index, lastUser_Index);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const requiredData = response.data;
      setUsersdata(requiredData);
      setFilteredUsers(requiredData);
    } catch (error) {
      console.error("Unable to fetch required data", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearching = (e) => {
    const dataSearched = e.target.value;
    setSearchData(dataSearched);
    const filteredData = usersdata.filter(
      (user) =>
        user.id.toLowerCase().includes(dataSearched.toLowerCase()) ||
        user.name.toLowerCase().includes(dataSearched.toLowerCase()) ||
        user.email.toLowerCase().includes(dataSearched.toLowerCase()) ||
        user.role.toLowerCase().includes(dataSearched.toLowerCase())
    );
    setFilteredUsers(filteredData);
    const firstPage = 1;
    setCurrentPage(firstPage);
  };

  const handleChecked = () => {
    const currentPageRows = filteredUsers.slice(
      firstUser_Index,
      lastUser_Index
    );
    const updatedPageRows = currentPageRows.map((user) => ({
      ...user,
      isChecked: !pageAllChecked
    }));

    setFilteredUsers((prev) => {
      const newRows = [...prev];
      newRows.forEach((row, index) => {
        if (index < firstUser_Index || index >= lastUser_Index) {
          row.isChecked = false;
        }
      });
      newRows.splice(firstUser_Index, rowsPerPage, ...updatedPageRows);
      return newRows;
    });

    const selectedIds = updatedPageRows
      .filter((user) => user.isChecked)
      .map((user) => user.id);

    setRowsSelected(selectedIds);
    setAllChecked(allChecked);
    setPageAllChecked(!pageAllChecked);
  };

  const handleOneChecked = (userId) => {
    const updateChecked = filteredUsers.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          isChecked: !user.isChecked
        };
      }
      return user;
    });

    const allRowChecked = updateChecked.every((user) => user.isChecked);
    setAllChecked(allRowChecked);
    setFilteredUsers(updateChecked);
    const selectedIds = updateChecked
      .filter((user) => user.isChecked)
      .map((user) => user.id);
    setRowsSelected(selectedIds);
  };

  const handleEdit = (userId) => {
    setEditRowId(userId);
    const userToEdit = filteredUsers.find((user) => user.id === userId);
    setEditedUserData({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role
    });
  };

  const handleSave = (userId) => {
    const updatedUsers = filteredUsers.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          name: editedUserData.name,
          email: editedUserData.email,
          role: editedUserData.role
        };
      }
      return user;
    });
    setUsersdata(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditRowId(null);
    setEditedUserData({});
  };

  const handle_UnSave = (userId) => {
    setEditRowId(null);
  };
  const handleDelete = (userId) => {
    const updatedUsers = filteredUsers.filter((user) => user.id !== userId);
    setUsersdata(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = filteredUsers.filter((user) => !user.isChecked);
    setUsersdata(updatedUsers);
    setFilteredUsers(updatedUsers);
    setRowsSelected([]);
    const totalPages = Math.ceil(updatedUsers.length / rowsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  };

  const handlePagination = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    let totalPagesLength = filteredUsers.length / rowsPerPage;
    if (pageNumber > Math.ceil(totalPagesLength))
      pageNumber = Math.ceil(totalPagesLength);
    setCurrentPage(pageNumber);
    setPageAllChecked(false);
  };

  return (
    <div>
      {
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />
      }
      <h2>ADMIN UI</h2>
      <SearchBox searchData={searchData} handleSearching={handleSearching} />
      <div className="container">
        <table className="table">
          <thead>
            <tr className="table-head">
              <th>
                <input
                  type="checkbox"
                  className="checkBox"
                  onChange={handleChecked}
                  checked={pageAllChecked}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {currentPageUsers.map((user) => (
              <tr
                className={`row-data ${user.isChecked ? "checked" : ""}`}
                key={user.id}
              >
                <td>
                  <input
                    type="checkbox"
                    className="AllcheckBox"
                    checked={allChecked || user.isChecked}
                    onChange={() => handleOneChecked(user.id)}
                  />
                </td>
                <td>
                  {editRowId === user.id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editedUserData.name || ""}
                      onChange={(e) =>
                        setEditedUserData({
                          ...editedUserData,
                          name: e.target.value
                        })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editRowId === user.id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editedUserData.email || ""}
                      onChange={(e) =>
                        setEditedUserData({
                          ...editedUserData,
                          email: e.target.value
                        })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editRowId === user.id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editedUserData.role || ""}
                      onChange={(e) =>
                        setEditedUserData({
                          ...editedUserData,
                          role: e.target.value
                        })
                      }
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td className="actions">
                  {editRowId === user.id ? (
                    <>
                      <span
                        title="save changes"
                        class="material-symbols-outlined"
                        id="save"
                        onClick={() => handleSave(user.id)}
                      >
                        save_as
                      </span>
                      <span
                        title="unsave changes"
                        class="material-symbols-outlined"
                        id="unsave"
                        onClick={() => handle_UnSave(user.id)}
                      >
                        cancel
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="material-symbols-outlined"
                        id="edit"
                        onClick={() => handleEdit(user.id)}
                      >
                        edit_note
                      </span>
                      <span
                        className="material-symbols-outlined"
                        title="Delete Data"
                        id="delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        delete
                      </span>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteSelected
        handleDeleteSelected={handleDeleteSelected}
        rowsSelected={rowsSelected}
      />
      <Pagination
        totalUsers={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        handlePagination={handlePagination}
      />
    </div>
  );
}
