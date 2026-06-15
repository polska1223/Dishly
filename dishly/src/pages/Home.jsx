import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import InsertPost from "./UploadPost";
import "./Home.css";
import { Link } from "react-router-dom";

const trendingFilters = ["All", "Breakfast", "Dinner", "Dessert"];

const communityActivity = [
];

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("id", { ascending: false });

        if (!error) {
            setPosts(data);
        }
    }

    async function handleNewPost() {
        await loadPosts();
    }

    async function handleDeletePost(postId) {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

        if (!error) {
            await loadPosts();
        }
    }

    async function handleUpdatePost(postId, newContent) {
        const { error } = await supabase
            .from("posts")
            .update({ content: newContent })
            .eq("id", postId);

        if (!error) {
            await loadPosts();
        }
    }

    return (
        <div className="home-page">

            {/* HEADER */}
            <header className="header">
                <div className="header-logo">
                    <span className="logo-icon"></span>
                    <span className="logo-text">Dishly</span>
                </div>

                <nav className="header-nav">
                    <Link to="/">Home</Link>
                    <Link to="/discover">Discover</Link>
                    <Link to="/community">Community</Link>
                </nav>

                <div className="header-right">
                    <input type="text" placeholder="Search recipes..." className="header-search" />
                    <Link to="/profile">Profile</Link>
                </div>
            </header>

            {/* PAGE BODY */}
            <div className="page-body">

                {/* LEFT: MAIN CONTENT */}
                <div className="content-left">

                    {/* Welcome banner */}
                    <div className="welcome-banner">
                        <p className="banner-label">New Feature</p>
                        <h2>Welcome to Dishly!</h2>
                        <p>Discover trending recipes from your community today</p>
                        <Link to="/upload" className="banner-btn">+ Share a Recipe</Link>
                    </div>


                    {/* Trending Today */}
                    <section className="section">
                        <div className="trending-header">
                            <h3>Trending Today</h3>
                            <div className="filter-row">
                                {trendingFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        className={activeFilter === filter ? "filter-btn active" : "filter-btn"}
                                        onClick={() => setActiveFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="feed-grid">
                            {posts.map((post) => (
                                <article key={post.id} className="post-card">
                                    <div className="post-image">
                                        <p>Photo</p>
                                    </div>
                                    <div className="post-info">
                                        <p className="post-title">{post.title}</p>
                                        <p>{post.content}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                </div>

                {/* RIGHT: SIDEBAR */}
                <aside className="content-right">

                    {/* Quick Actions */}
                    <div className="sidebar-block quick-actions">
                        <h3>Quick Actions</h3>
                        <Link to="/upload" className="quick-action-item">
                            <span className="quick-action-icon"></span>
                            <div>
                                <p className="quick-action-title">Create Recipe</p>
                                <p className="quick-action-sub">Share your creation</p>
                            </div>
                        </Link>
                        <Link to="/saved" className="quick-action-item">
                            <span className="quick-action-icon"></span>
                            <div>
                                <p className="quick-action-title">Saved Recipes</p>
                                <p className="quick-action-sub">View your collection</p>
                            </div>
                        </Link>
                    </div>

                    {/* Community Activity */}
                    <div className="sidebar-block">
                        <h3>Community Activity</h3>
                        <ul className="activity-list">
                            {communityActivity.map((item) => (
                                <li key={item.id} className="activity-item">
                                    <span className="activity-avatar"></span>
                                    <div>
                                        <p><strong>{item.name}</strong> {item.action}</p>
                                        <p className="activity-time">{item.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </aside>

            </div>

        </div>
    );
}