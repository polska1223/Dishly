import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import InsertPost from "./UploadPost";
import "./Home.css";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("id", { ascending: false });

        if (!error) {
            setPosts(data);
        }
    }
    async function deletePost(id) {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", id);

        if (!error) {
            loadPosts(); // Reload posts to reflect the deletion
        }
    }

    return (
        <div className="home-page">

            {/* SIDEBAR */}
            <aside className="sidebar">
                <h2>Dishly</h2>
                <nav>
                    <ul>
                        <li>Home</li>
                        <li>Explore</li>
                        <li>Profile</li>
                        <li>Settings</li>
                    </ul>
                </nav>
            </aside>

            {/* MAIN */}
            <main className="main-content">

                <InsertPost />

                <h2>Posts</h2>

                <div className="feed-grid">
                    {posts.map((post) => (
                        <article key={post.id} className="post-card">
                            <div className="post-image">
                                <p>Photo</p>
                            </div>
                            <div className="post-info">
                                <p>{post.content}</p>
                            </div>
                            <button className="delete-button" onClick={() => deletePost(post.id)}>
                                Delete
                            </button>
                        </article>
                    ))}
                </div>

            </main>

        </div>
    );
}