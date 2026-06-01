import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import InsertPost from "./UploadPost";

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

    return (
        <main>
            <h1>Dishly</h1>

            <InsertPost />

            <h2>Posts</h2>

            {posts.map((post) => (
                <article key={post.id}>
                    <p>{post.content}</p>
                </article>
            ))}
        </main>
    );
}