import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import TweetFactory from "components/TweetFactory";
import Tweet from "./Tweet";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "tweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);

  return (
    <div>
      <TweetFactory userObj={userObj} />
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweetObj={tweet}
          isOwner={tweet.creatorId === userObj.uid}
        />
      ))}
    </div>
  );
};
export default Home;
