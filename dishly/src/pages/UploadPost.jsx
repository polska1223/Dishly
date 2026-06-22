import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useSession } from "../hooks/useSession";
import "./UploadPost.css";

export default function UploadPost() {
    const { session } = useSession();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [category, setCategory] = useState("Diner");
    const [message, setMessage] = useState("");

    const categories = ["Ontbijt", "Lunch", "Diner", "Snack", "Dessert"];

    async function addPost(event) {
        event.preventDefault();

        const userId = session?.user?.id || session?.sub;

        const { error } = await supabase.from("posts").insert({
            title: title,
            content: content,
            image_url: imageUrl,
            ingredients: ingredients,
            category: category,
            user_id: userId,
        });

        if (error) {
            console.log(error);
            setMessage("Fout: " + error.message);
            return;
        }

        // Velden leegmaken en terug naar home
        setTitle("");
        setContent("");
        setImageUrl("");
        setIngredients("");
        setMessage("Recept geplaatst!");

        navigate("/");
    }

    return (
        <div className="upload-page">

            {/* ── HEADER ── */}
            <header className="header">
                <div className="logo">Dishly</div>
                <nav className="nav">
                    <a href="/">Home</a>
                    <a href="/explore">Explore</a>
                    <a href="/UploadPost">Plaatsen</a>
                    <a href="/leftover">Leftover Finder</a>
                    <a href="/profile">Profiel</a>
                </nav>
            </header>

            {/* ── FORMULIER ── */}
            <main className="upload-content">
                <section className="panel">
                    <h1>Nieuw recept plaatsen</h1>

                    <form onSubmit={addPost}>
                        <label>Titel</label>
                        <input
                            placeholder="Naam van het gerecht"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />

                        <label>Foto link</label>
                        <input
                            placeholder="https://..."
                            value={imageUrl}
                            onChange={(event) => setImageUrl(event.target.value)}
                        />

                        <label>Categorie</label>
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <label>Ingrediënten</label>
                        <input
                            placeholder="bijv. kaas, ei, brood"
                            value={ingredients}
                            onChange={(event) => setIngredients(event.target.value)}
                        />
                        <p className="hint">
                            Scheid ingrediënten met komma's. Dit helpt anderen je
                            gerecht te vinden via de Leftover Finder.
                        </p>

                        <label>Beschrijving</label>
                        <textarea
                            placeholder="Beschrijf de bereiding..."
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                        />

                        <button type="submit">Recept plaatsen</button>

                        {message && <p className="upload-message">{message}</p>}
                    </form>
                </section>
            </main>

        </div>
    );
}