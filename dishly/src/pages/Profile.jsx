import { useState, useEffect } from "react";
import { supabase } from "../supabase.js";
import { useSession } from "../hooks/useSession";
import "./Profile.css";

export default function Profile() {
    const { session, loading: sessionLoading } = useSession();

    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);

    const userId = session?.user?.id || session?.sub;

    useEffect(() => {
        if (!session) return;

        fetchProfile();
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

    if (!profile) {
        return (
            <main>
                <h1>Profiel aanmaken</h1>

                <form onSubmit={createProfile}>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />

                    <br />

                    <textarea
                        placeholder="Bio"
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                    />

                    <br />

                    <button type="submit">Profiel aanmaken</button>
                </form>
            </main>
        );
    }

    return (
        <main>
            <h1>Mijn profiel</h1>

            {profile.avatar_url && (
                <img src={profile.avatar_url} alt="Avatar" width="150" />
            )}

            <form onSubmit={updateProfile}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />

                <br />

                <textarea
                    placeholder="Bio"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                />

                <br />

                <button type="submit">Profiel opslaan</button>
            </form>

            <h2>Profielfoto uploaden</h2>

            <input
                type="file"
                onChange={(event) => setImage(event.target.files[0])}
            />

            <button type="button" onClick={uploadAvatar}>
                Upload profielfoto
            </button>

            <h2>Mijn gegevens</h2>

            <p>Username: {username}</p>
            <p>Bio: {bio}</p>
            <div className="back-link">
                <a href="/">Terug naar Home</a>
            </div>
        </main>
    );
}