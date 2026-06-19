import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useSession } from "../hooks/useSession";

export default function LikeButton({ postId }) {
    const { session } = useSession();
    const userId = session?.user?.id || session?.sub;

    const [count, setCount] = useState(0);   // totaal aantal likes
    const [liked, setLiked] = useState(false); // heeft deze gebruiker geliket?

    useEffect(() => {
        loadLikes();
    }, [postId, userId]);

    async function loadLikes() {
        // Haal alle likes van dit gerecht op
        const { data } = await supabase
            .from("likes")
            .select("*")
            .eq("post_id", postId);

        const likes = data || [];
        setCount(likes.length);

        // Kijk of de huidige gebruiker er een like tussen heeft
        const myLike = likes.find((like) => like.user_id === userId);
        setLiked(myLike ? true : false);
    }

    async function toggleLike() {
        if (!userId) return; // niet ingelogd

        if (liked) {
            // Like weghalen
            await supabase
                .from("likes")
                .delete()
                .eq("post_id", postId)
                .eq("user_id", userId);
        } else {
            // Like toevoegen
            await supabase.from("likes").insert({
                post_id: postId,
                user_id: userId,
            });
        }

        loadLikes();
    }

    return (
        <button
            className={liked ? "like-btn liked" : "like-btn"}
            onClick={toggleLike}
        >
            {liked ? "♥" : "♡"} {count}
        </button>
    );
}
