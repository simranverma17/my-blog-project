import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles/BlogEditor.css";

export default function BlogEditor() {
  const { postId } = useParams();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const quillRef = useRef();

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          setTitle(data.title);
          setContent(data.content);
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching post!");
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    const interval = setInterval(() => {
      if (title || content) saveDraft();
    }, 15000);
    return () => clearInterval(interval);
  }, [title, content, postId]);

  const saveDraft = async () => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        title,
        content,
        updatedAt: serverTimestamp(),
      });
      console.log("Draft saved!");
    } catch (err) {
      console.error("Autosave error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login first!");
    if (!title || !content) return alert("Title and content are required!");

    setLoading(true);

    const postData = {
      title,
      content,
      authorId: user.uid,
      authorName: user.displayName || user.email, 
      authorEmail: user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (postId) {
        
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, postData);
      } else {
        
        const newPostRef = doc(db, "posts", Date.now().toString());
        await setDoc(newPostRef, postData);
      }
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Error saving post!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-editor-page">
      <div className="editor-container">
        <h2 className="editor-heading">{postId ? "Edit Post" : "New Post"}</h2>

        <form onSubmit={handleSubmit} className="editor-form">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-title-input"
            required
          />

          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            ref={quillRef}
            placeholder="Write your post here..."
            className="editor-quill"
          />

          <button type="submit" className="editor-submit-btn" disabled={loading}>
            {loading ? "Saving..." : postId ? "Update Post" : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
