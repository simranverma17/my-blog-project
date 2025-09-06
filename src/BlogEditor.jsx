import { useState } from "react";
import { db, auth } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./styles/BlogEditor.css";

function BlogEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user] = useAuthState(auth);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to post");

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        authorEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setContent("");
      alert("Post created 🎉");
    } catch (err) {
      console.error(err);
      alert("Error creating post: " + err.message);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-card">
        <h1 className="brand-title">BlogSphere</h1>
        <h2 className="editor-heading">Create a New Post</h2>
        <form onSubmit={handlePost}>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit">Publish Post</button>
        </form>
      </div>
    </div>
  );
}

export default BlogEditor;
