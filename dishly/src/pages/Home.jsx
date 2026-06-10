import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import InsertPost from "./UploadPost";
import LogoutButton from"../components/LogoutButton";


export default function Home() {
    const [posts, setPosts] = useState([]);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        loadPosts();
        loadProfiles();
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

    async function loadProfiles() {
        const { data } = await supabase
            .from("Profiel")
            .select("*");

        setProfiles(data || []);
    }
    async function deletePost(id) {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", id);

        if (!error) {
            loadPosts();
        }
    }

    function getUsername(userId) {
        const profile = profiles.find(
            (profile) => profile.user_id === userId
        );

        if (profile) {
            return profile.Username;
        }

        return "Onbekende gebruiker";
    }

    return (

        <main>
            <h1>Dishly</h1>

            <LogoutButton />

            <InsertPost />

            <h2>Posts</h2>

            {posts.map((post) => (
                <article key={post.id}>
                    <p>Geplaatst door: {getUsername(post.user_id)}</p>
                    {post.image_url && (
                        <img
                            src={post.image_url}
                            alt={post.title}
                            width="300"
                        />
                    )}

                    <h3>{post.title}</h3>

                    <p>{post.content}</p>

                    <button onClick={() => deletePost(post.id)}>
                        Delete
                    </button>

                </article>
            ))}


        </main>
    );
}