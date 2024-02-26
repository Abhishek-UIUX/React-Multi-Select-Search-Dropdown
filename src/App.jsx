import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => {
    const fetchUsers = () => {
      setActiveSuggestion(0);
      if (inputValue.trim() == "") {
        setSuggestions([]);
        return;
      }

      fetch(`https://dummyjson.com/users/search?q=${inputValue}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => console.log("Error", err));
    };
    fetchUsers();
  }, [inputValue]);

  const handleSelectedUser = (user) => {
    setSelectedUser([...selectedUser, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setInputValue("");
    setSuggestions([]);
    inputRef.current.focus();
  };
  console.log(selectedUser);
  const handleRemoveUser = (user) => {
    const updatedUser = selectedUser.filter((Users) => Users.id != user.id);
    setSelectedUser(updatedUser);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setSelectedUserSet(updatedEmails);
  };

  const HandleKeyDown = (e) => {
    if (
      e.key == "Backspace" &&
      e.target.value === "" &&
      selectedUser.length > 0
    ) {
      const lastUser = selectedUser[selectedUser.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    } else if (e.key == "ArrowDown" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) =>
        prevIndex < suggestions.users.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key == "ArrowUp" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (
      e.key == "Enter" &&
      activeSuggestion >= 0 &&
      activeSuggestion < suggestions.users.length
    ) {
      handleSelectedUser(suggestions.users[activeSuggestion]);
    }
  };
  // console.log("suggestions",suggestions);
  return (
    <div className="input-container">
      <div className="search-input">
        {/* Pills */}
        {selectedUser.map((user) => {
          return (
            <Pill
              key={user.email}
              image={user.image}
              onClick={() => handleRemoveUser(user)}
              text={`${user.firstName} ${user.lastName}`}
            />
          );
        })}
        {/* Input Field with search suggestion*/}
        <div className="width-98">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search User ..."
            onKeyDown={HandleKeyDown}
          />

          <ul className="suggestion-list">
            {suggestions?.users?.map((user, index) => {
              return !selectedUserSet.has(user.email) ? (
                <li
                  className={index === activeSuggestion ? "active" : ""}
                  key={user.email}
                  onClick={() => {
                    handleSelectedUser(user);
                  }}
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
