import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { updateProfile, onAuthStateChanged } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(args),
        });
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(args),
        });
      }
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Lemmitter</footer>
    </>
  );
}

export default App;
