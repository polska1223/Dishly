import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import UploadPost from "./UploadPost";
import "./Home.css";
import LikeButton from "../components/LikeButton";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [search, setSearch] = useState("");

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
        const { data } = await supabase.from("Profiel").select("*");
        setProfiles(data || []);
    }

    async function deletePost(id) {
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (!error) {
            loadPosts();
        }
    }

    function getUsername(userId) {
        const profile = profiles.find((p) => p.user_id === userId);
        return profile ? profile.Username : "Onbekende gebruiker";
    }

    // Posts die voldoen aan de zoekterm (op titel)
    const foundPosts = posts.filter((post) =>
        post.title?.toLowerCase().includes(search.toLowerCase())
    );

    // Trending = de 3 nieuwste gerechten
    const trendingPosts = posts.slice(0, 3);

    return (
        <div className="home">

            {/* ── HEADER ── */}
            <header className="header">
                <div className="logo">Dishly</div>
                <nav className="nav">
                    <a href="/">Home</a>
                    <a href="/explore">Explore</a>
                    <a href="/profile">Profiel</a>
                </nav>
            </header>

            {/* ── HERO ── */}
            <section className="hero">
                <h1>Deel jouw favoriete recepten</h1>
                <p>Ontdek wat de community kookt en plaats je eigen gerechten.</p>

                {/* Zoekbalk */}
                <input
                    className="hero-search"
                    type="text"
                    placeholder="Zoek een gerecht..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </section>

            {/* ── HOOFDINHOUD ── */}
            <main className="content">

                {/* Trending gerechten */}
                <section className="panel">
                    <h2>Trending gerechten</h2>
                    <div className="post-grid">
                        {trendingPosts.map((post) => (
                            <article key={post.id} className="post-card">
                                {post.image_url && (
                                    <img
                                        className="post-image"
                                        src={post.image_url}
                                        alt={post.title}
                                    />
                                )}
                                <div className="post-body">
                                    <p className="post-author">{getUsername(post.user_id)}</p>
                                    <h3>{post.title}</h3>
                                    <p className="post-text">{post.content}</p>

                                    <LikeButton postId={post.id} />

                                    <button className="delete-btn" onClick={() => deletePost(post.id)}>
                                        Verwijderen
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                    {trendingPosts.length === 0 && (
                        <p className="empty">Nog geen trending gerechten.</p>
                    )}
                </section>

                {/* Recente posts */}
                <section className="panel">
                    <h2>Recente recepten</h2>

                    {foundPosts.length === 0 && (
                        <p className="empty">Geen recepten gevonden.</p>
                    )}

                    <div className="post-grid">
                        {foundPosts.map((post) => (
                            <article key={post.id} className="post-card">
                                {post.image_url && (
                                    <img
                                        className="post-image"
                                        src={post.image_url}
                                        alt={post.title}
                                    />
                                )}

                                <div className="post-body">
                                    <p className="post-author">{getUsername(post.user_id)}</p>
                                    <h3>{post.title}</h3>
                                    <p className="post-text">{post.content}</p>

                                    <LikeButton postId={post.id} />

                                    <button className="delete-btn" onClick={() => deletePost(post.id)}>
                                        Verwijderen
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-brand">Dishly</div>
                    <nav className="footer-nav">
                        <a href="/">Home</a>
                        <a href="/explore">Explore</a>
                        <a href="/profile">Profiel</a>
                    </nav>
                    <p className="footer-copy">
                        &copy; 2026 Dishly &mdash; gemaakt met liefde voor lekker eten.
                    </p>
                </div>
            </footer>

        </div>
    );
}