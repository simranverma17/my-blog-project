import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./styles/Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
      const allPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(allPosts);
      setFilteredPosts(allPosts);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(search.toLowerCase()) ||
          stripHtml(post.content || "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [search, posts]);

  if (loading) {
    return <p className="text-center mt-4">Loading posts...</p>;
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <h2 className="home-heading">All Blog Posts</h2>

        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <Link to={`/post/${post.id}`}>
                <h3 className="post-title">{post.title}</h3>
              </Link>
              <p className="post-snippet">
                {stripHtml(post.content)?.length > 120
                  ? stripHtml(post.content).slice(0, 120) + "..."
                  : stripHtml(post.content)}
              </p>
              <div className="card-footer">
                <span className="chip">
                  By {post.authorName || post.authorEmail || "Anonymous"}
                </span>
                <span className="chip outline">
                  {post.createdAt
                    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-posts">No posts found.</p>
        )}
      </div>
    </div>
  );
}
