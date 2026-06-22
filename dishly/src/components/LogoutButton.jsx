// LogoutButton.jsx
// Een knop die de huidige gebruiker uitlogt.
// Na het uitloggen wordt de sessie automatisch leeg (via useSession),
// waardoor PrivateRoute de gebruiker terugstuurt naar /login.

import { supabase } from "../supabase";

export default function LogoutButton() {
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log(error);
        }
    }

    return (
        <button className="logout-btn" onClick={handleLogout}>
            Uitloggen
        </button>
    );
}
