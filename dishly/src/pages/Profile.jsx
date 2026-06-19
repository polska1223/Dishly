import { useState, useEffect } from "react";
import { supabase } from "../supabase.js";
import { useSession } from "../hooks/useSession";
import UploadPost from "./UploadPost";
import "./Profile.css";
import LogoutButton from "../components/LogoutButton";

export default function Profile() {
    const { session, loading: sessionLoading } = useSession();

    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const [myPosts, setMyPosts] = useState([]);

    const userId = session?.user?.id || session?.sub;

    useEffect(() => {
        if (!session) return;

        fetchProfile();
        fetchMyPosts();
    }, [session]);

    async function fetchProfile() {
        const { data, error } = await supabase
            .from("Profiel")
            .select("*")
            .eq("user_id", userId)
            .single();

        console.log(data);
        console.log(error);

        if (data) {
            setProfile(data);
            setUsername(data.Username || "");
            setBio(data.Bio || "");
        } else {
            setProfile(null);
        }
    }

    // Haalt de eigen geplaatste gerechten op
    async function fetchMyPosts() {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", userId)
            .order("id", { ascending: false });

        setMyPosts(data || []);
    }

    async function createProfile(event) {
        event.preventDefault();

        const { error } = await supabase.from("Profiel").insert({
            user_id: userId,
            Username: username,
            Bio: bio,
        });

        console.log(error);

        if (!error) {
            fetchProfile();
        }
    }

    async function updateProfile(event) {
        event.preventDefault();

        const { error } = await supabase
            .from("Profiel")
            .update({
                Username: username,
                Bio: bio,
            })
            .eq("user_id", userId);

        console.log(error);

        if (!error) {
            fetchProfile();
        }
    }

    async function deletePost(id) {
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (!error) {
            fetchMyPosts();
        }
    }

    async function uploadAvatar() {
        if (!image) return;

        const fileName = `${userId}-${Date.now()}`;

        const { error } = await supabase.storage
            .from("Avatars")
            .upload(fileName, image);

        if (error) {
            console.log(error);
            return;
        }

        const { data } = supabase.storage
            .from("Avatars")
            .getPublicUrl(fileName);

        await supabase
            .from("Profiel")
            .update({
                avatar_url: data.publicUrl,
            })
            .eq("user_id", userId);

        fetchProfile();
    }

    if (sessionLoading) return <p>Laden...</p>;
    if (!session) return <p>Niet ingelogd.</p>;

    // Geen profiel: toon aanmaakformulier
    if (!profile) {
        return (
            <div className="profile-page">
                <header className="header">
                    <div className="logo">Dishly</div>
                    <nav className="nav">
                        <a href="/">Home</a>
                        <a href="/explore">Explore</a>
                        <a href="/profile">Profiel</a>
                    </nav>
                </header>

                <main className="profile-content">
                    <section className="panel">
                        <h1>Profiel aanmaken</h1>

                        <form onSubmit={createProfile}>
                            <input
                                placeholder="Username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                            <textarea
                                placeholder="Bio"
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                            />
                            <button type="submit">Profiel aanmaken</button>
                        </form>
                    </section>
                </main>
            </div>
        );
    }

    // Wel een profiel: toon profiel + eigen posts
    return (
        <div className="profile-page">

            {/* ── HEADER ── */}
            <header className="header">
                <div className="logo">Dishly</div>
                <nav className="nav">
                    <a href="/">Home</a>
                    <a href="/explore">Explore</a>
                    <a href="/upload">Plaatsen</a>
                    <a href="/leftover">Leftover Finder</a>
                    <a href="/profile">Profiel</a>
                    <LogoutButton />
                </nav>
            </header>

            <main className="profile-content">

                {/* ── PROFIELKAART ── */}
                <section className="panel profile-header">
                    {profile.avatar_url && (
                        <img
                            className="avatar"
                            src={profile.avatar_url}
                            alt="Avatar"
                        />
                    )}
                    <div className="profile-info">
                        <h1>{username}</h1>
                        <p className="profile-bio">{bio}</p>
                        <p className="profile-count">
                            {myPosts.length} geplaatste gerecht(en)
                        </p>
                    </div>
                </section>

                {/* ── PROFIEL BEWERKEN ── */}
                <section className="panel">
                    <h2>Profiel bewerken</h2>
                    <form onSubmit={updateProfile}>
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <textarea
                            placeholder="Bio"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                        />
                        <button type="submit">Profiel opslaan</button>
                    </form>

                    <h3>Profielfoto uploaden</h3>
                    <input
                        type="file"
                        onChange={(event) => setImage(event.target.files[0])}
                    />
                    <button type="button" onClick={uploadAvatar}>
                        Upload profielfoto
                    </button>
                </section>

                {/* ── EIGEN POSTS ── */}
                <section className="panel">
                    <h2>Mijn gerechten</h2>

                    {myPosts.length === 0 && (
                        <p className="empty">Je hebt nog geen gerechten geplaatst.</p>
                    )}

                    <div className="post-grid">
                        {myPosts.map((post) => (
                            <article key={post.id} className="post-card">
                                {post.image_url && (
                                    <img
                                        className="post-image"
                                        src={post.image_url}
                                        alt={post.title}
                                    />
                                )}
                                <div className="post-body">
                                    <h3>{post.title}</h3>
                                    <p className="post-text">{post.content}</p>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deletePost(post.id)}
                                    >
                                        Verwijderen
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}