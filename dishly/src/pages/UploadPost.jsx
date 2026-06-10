import { useState } from "react";
import { supabase } from "../supabase";
import { useSession } from "../hooks/useSession";

export default function UploadPost() {
    const { session } = useSession();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    async function addPost(event) {
        event.preventDefault();

        const userId = session?.user?.id || session?.sub;

        const { error } = await supabase.from("posts").insert({
            title: title,
            content: content,
            image_url: imageUrl,
            user_id: userId,
        });

        console.log(error);

        if (!error) {
            setTitle("");
            setContent("");
            setImageUrl("");
        }
    }

    return (
        <form onSubmit={addPost}>
            <input
                placeholder="Titel"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />

            <br />

            <input
                placeholder="Foto link"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
            />

            <br />

            <textarea
                placeholder="Beschrijving"
                value={content}
                onChange={(event) => setContent(event.target.value)}
            />

            <br />

            <button type="submit">Post plaatsen</button>
        </form>
    );
}