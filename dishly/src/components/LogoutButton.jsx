import { supabase } from "../supabase";

export default function LogoutButton() {
    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}