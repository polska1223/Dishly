import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Explore.css";

const categories = ["Alles", "Ontbijt", "Lunch", "Diner", "Snack", "Dessert"];

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [profiles, setProfiles] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Alles");
    const [ingredients, setIngredients] = useState("");

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

    // Filtert de posts op zoekterm, categorie en ingrediënten
    function getFilteredPosts() {
        return posts.filter((post) => {
            // 1. Zoeken op titel
            const matchesSearch = post.title
                ?.toLowerCase()
                .includes(search.toLowerCase());

            // 2. Filteren op categorie
            const matchesCategory =
                category === "Alles" || post.category === category;

            // 3. Filteren op ingrediënten (USP)
            // De gebruiker typt ingrediënten gescheiden door komma's.
            // Elk ingrediënt moet voorkomen in de ingredients-kolom.
            const wanted = ingredients
                .toLowerCase()
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item !== "");

            const postIngredients = (post.ingredients || "").toLowerCase();

            const matchesIngredients =
                wanted.length === 0 ||
                wanted.every((item) => postIngredients.includes(item));

            return matchesSearch && matchesCategory && matchesIngredients;
        });
    }

    const filteredPosts = getFilteredPosts();

    return (
        <div className="explore">

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

            {/* ── TITEL ── */}
            <section className="explore-intro">
                <h1>Ontdek gerechten</h1>
                <p>Zoek, filter op categorie of vind recepten met wat je in huis hebt.</p>
            </section>

            {/* ── FILTERS ── */}
            <section className="filters">

                {/* Zoekbalk */}
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Zoek op naam van gerecht..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                {/* Categorie-knoppen */}
                <div className="category-row">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className={
                                category === item
                                    ? "category-btn active"
                                    : "category-btn"
                            }
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Ingrediënten-filter (USP) */}
                <div className="ingredient-filter">
                    <label>Wat heb je in huis?</label>
                    <input
                        className="ingredient-input"
                        type="text"
                        placeholder="bijv. kaas, ei, brood"
                        value={ingredients}
                        onChange={(event) => setIngredients(event.target.value)}
                    />
                    <p className="hint">
                        Typ ingrediënten gescheiden door komma's.
                    </p>
                </div>
            </section>

            {/* ── RESULTATEN ── */}
            <main className="results">
                <p className="result-count">
                    {filteredPosts.length} gerecht(en) gevonden
                </p>

                <div className="post-grid">
                    {filteredPosts.map((post) => (
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

                {filteredPosts.length === 0 && (
                    <p className="empty">
                        Geen gerechten gevonden. Pas je filters aan.
                    </p>
                )}
            </main>

        </div>
    );
}