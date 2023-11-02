import { Paper, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

export default function Posts() {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('http://localhost:3000/api/posts')
                const result = await response.json();
                setPosts(result.posts);
            } catch (e) {
                console.log(e)
                setError(e.message)
            }
        }
        fetchPosts();
    }, [])

    if (error) {
        return (
            <div>
                <Typography variant="h2">Something Went Wrong!</Typography>
                <p>{error}</p>
            </div>
        )
    }
    if (posts) {
        return (
            <Paper elevation={3} sx={{ margin: 2, padding: 1 }}>

                <Typography variant="h2">Juice Box Posts</Typography>
                {
                    posts.map(post => (
                        <div key={post.id}>
                            <Typography variant="h3">{post.title}</Typography>
                            <Typography>{post.content}</Typography>
                            <Typography>{...post.tags}</Typography>
                        </div>
                    ))
                }

            </Paper>
        )

    }
}