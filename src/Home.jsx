import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "./styles/Home.css";
import Loader from "./components/Loader";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="brand-title">BlogSphere</h1>
        <h2 className="home-heading">Latest Posts</h2>

        {posts.length === 0 && (
          <p className="no-posts">No posts yet. Create one!</p>
        )}

        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`/post/${post.id}`} className="post-link">
            <h3>{post.title}</h3>
            </Link>
            <p
              className="post-snippet"
              dangerouslySetInnerHTML={{
                __html:
                  post.content.length > 200
                    ? post.content.slice(0, 200) + "..."
                    : post.content,
              }}
            />
            <p className="post-meta">
              By <strong>{post.authorEmail}</strong> •{" "}
              {post.createdAt?.toDate
                ? post.createdAt.toDate().toLocaleString()
                : "Unknown date"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
