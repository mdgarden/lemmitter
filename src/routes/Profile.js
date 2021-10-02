import React, { useEffect } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where } from "@firebase/firestore";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
