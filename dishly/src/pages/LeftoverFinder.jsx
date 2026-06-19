import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./LeftoverFinder.css";

export default function LeftoverFinder() {
    const [posts, setPosts] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [ingredients, setIngredients] = useState("");
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        loadPosts();
        loadProfiles();
    }, []);

    async function loadPosts() {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .order("id", { ascending: false });

        setPosts(data || []);
    }

    async function loadProfiles() {
        const { data } = await supabase.from("Profiel").select("*");
        setProfiles(data || []);
    }

    function getUsername(userId) {
        const profile = profiles.find((p) => p.user_id === userId);
        return profile ? profile.Username : "Onbekende gebruiker";
    }

    // De ingrediënten die de gebruiker heeft ingevoerd, als lijst
    const wanted = ingredients
        .toLowerCase()
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

    // Gerechten waarvan ALLE ingevoerde ingrediënten voorkomen
    const matches = posts.filter((post) => {
        if (wanted.length === 0) return false;

        const postIngredients = (post.ingredients || "").toLowerCase();
        return wanted.every((item) => postIngredients.includes(item));
    });

    function handleSearch() {
        setSearched(true);
    }

    return (
        <div className="leftover-page">

            {/* ── HEADER ── */}
            <header className="header">
                <div className="logo">Dishly</div>
                <nav className="nav">
                    <a href="/">Home</a>
                    <a href="/explore">Explore</a>
                    <a href="/upload">Plaatsen</a>
                    <a href="/leftover">Leftover Finder</a>
                    <a href="/profile">Profiel</a>
                </nav>
            </header>

            {/* ── INTRO ── */}
            <section className="leftover-intro">
                <h1>Leftover Finder</h1>
                <p>
                    Voer in wat je nog in huis hebt en ontdek welke gerechten je
                    ermee kunt maken.
                </p>
            </section>

            {/* ── ZOEKVAK ── */}
            <section className="leftover-search">
                <input
                    type="text"
                    placeholder="bijv. kaas, ei, brood"
                    value={ingredients}
                    onChange={(event) => setIngredients(event.target.value)}
                />
                <button onClick={handleSearch}>Zoek gerechten</button>
                <p className="hint">Scheid je ingrediënten met komma's.</p>
            </section>

            {/* ── RESULTATEN ── */}
            <main className="results">
                {searched && (
                    <p className="result-count">
                        {matches.length} gerecht(en) gevonden
                    </p>
                )}

                <div className="post-grid">
                    {matches.map((post) => (
                        <article key={post.id} className="post-card">
                            {post.image_url && (
                                <img
                                    className="post-image"
                                    src={post.image_url}
                                    alt={post.title}
                                />
                            )}
                            <div className="post-body">
                                <p className="post-author">Gemaakt door {getUsername(post.user_id)}</p>
                                <h3>{post.title}</h3>
                                {post.ingredients && (
                                    <p className="post-ingredients">
                                        Ingrediënten: {post.ingredients}
                                    </p>
                                )}
                                <p className="post-text">{post.content}</p>
                            </div>
                        </article>
                    ))}
                </div>

                {searched && matches.length === 0 && (
                    <p className="empty">
                        Geen gerechten gevonden met deze ingrediënten.
                    </p>
                )}
            </main>

        </div>
    );
}