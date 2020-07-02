import React, { useState, useEffect } from "react";
import "./App.css";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    console.log("dev mode");
} else {
    console.log("production mode");
}

const API_URL =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : "https://backend-for-netlify.herokuapp.com";

const io = require("socket.io-client");
const socket = io(API_URL);

const App = () => {
    const [posts, setPosts] = useState([]);

    async function initPosts() {
        let posts = await fetch(`${API_URL}/posts`);
        posts = await posts.json();
        console.log({ posts });
        setPosts(posts);
    }

    useEffect(() => {
        initPosts();
    }, []);

    // * socket stuff
    socket.on("connect", () => console.log("socket connected from client"));
    socket.on("message", (message) =>
        setPosts([...posts, { name: message.name, message: message.message }])
    );

    const [postInput, setPostInput] = useState("");
    const [name, setName] = useState("");

    const handlePostChange = (e) => {
        setPostInput(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const addPost = async (e) => {
        e.preventDefault();
        try {
            let result = await fetch(`${API_URL}/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: "Joel Miller",
                    message: postInput,
                }),
            });
            result = await result.json();
            socket.emit("message", {
                name,
                message: postInput,
            });
            setPostInput("");
            // console.log(result);
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <div>
            <h1>First Netlify Try!</h1>
            <h2>Posts</h2>
            <ul style={{ listStyleType: "none" }}>
                {posts.map((post, i) => (
                    <li key={i}>
                        {post.name}: {post.message}
                    </li>
                ))}
            </ul>

            <form onSubmit={addPost}>
                <label>Message: </label>
                <input
                    type="text"
                    value={postInput}
                    onChange={handlePostChange}
                />
                <label>Name: </label>
                <input type="text" value={name} onChange={handleNameChange} />
                <button type="submit">Add Post</button>
            </form>
        </div>
    );
};

export default App;
