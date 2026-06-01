import { useState } from "react";
import { supabase } from "../supabase";
import { useSession } from "../hooks/useSession";

function InsertPost() {
    const [content, setContent] = useState("");

    const { session } = useSession();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { error } = await supabase.from("posts").insert({
            user_id: session.sub,
            content: content,
        });

        if (!error) {
            setContent("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
      <textarea
          rows="4"
          value={content}
          onChange={(event) => setContent(event.target.value)}
      />

            <button>Post!</button>
        </form>
    );
}

export default InsertPost;