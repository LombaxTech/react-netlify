import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
    const [posts, setPosts] = useState([]);

    async function initPosts() {
        let posts = await fetch("http://localhost:8000/posts");
        posts = await posts.json();
        console.log({ posts });
        setPosts(posts);
    }

    useEffect(() => {
        initPosts();
    }, []);

    const [postInput, setPostInput] = useState("");

    const handlePostChange = (e) => {
        setPostInput(e.target.value);
    };

    const addPost = async () => {
        try {
            let result = await fetch("http://localhost:8000/post", {
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
            console.log(result);
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <div>
            <h1>First Netlify Try</h1>
            <h2>Posts</h2>
            <ul style={{ listStyleType: "none" }}>
                {posts.map((post) => (
                    <li key={post._id}>
                        {post.name}: {post.message}
                    </li>
                ))}
            </ul>

            <input type="text" value={postInput} onChange={handlePostChange} />
            <button onClick={addPost}>Add Post</button>
        </div>
    );
};

export default App;
