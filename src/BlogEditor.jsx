import { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function BlogEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required!");
      return;
    }

    try {
      
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        content,
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        createdAt: serverTimestamp(), 
        likes: [],
        slug: title.toLowerCase().replace(/\s+/g, "-"),
      });

      alert("Post published successfully!");
      navigate("/home"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Create a Blog Post</h2>
      <form
        onSubmit={handlePublish}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        />
        <button type="submit">Publish</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default BlogEditor;
