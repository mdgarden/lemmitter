import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";

import Tweet from "./Tweet";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState("");

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
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, tweetObj));
    setTweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment();
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="무슨 일이 일어나고 있나요?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="tweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
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
