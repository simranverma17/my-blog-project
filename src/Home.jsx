import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Blog Posts</h2>
      {posts.length === 0 && <p>No posts yet. Create one!</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            background: "#f9f9f9",
          }}
        >
          <h3>
            <Link
              to={`/post/${post.id}`}
              style={{ textDecoration: "none", color: "#282c34" }}
            >
              {post.title}
            </Link>
          </h3>
          <p
            dangerouslySetInnerHTML={{
              __html:
                post.content.length > 200
                  ? post.content.slice(0, 200) + "..."
                  : post.content,
            }}
          />
          <p style={{ fontSize: "12px", color: "gray" }}>
            By: {post.authorEmail} |{" "}
            {post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleString()
              : "Unknown date"}
          </p>
          <p>Likes: {post.likes?.length || 0}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
