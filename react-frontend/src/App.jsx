import { useState, useEffect } from "react";
import Auth from "./Auth";
import Task from "./Task";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    setIsLoggedIn(!!userId);
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <Task setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Auth setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
};

export default App;
