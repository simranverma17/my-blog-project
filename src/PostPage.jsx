import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaHeart, FaRegHeart, FaCloud, FaReply } from "react-icons/fa";
import "./styles/PostPage.css";

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [replyMap, setReplyMap] = useState({});
  const [user] = useAuthState(auth);

  // Fetch post data with live updates
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "posts", postId), (docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      }
    });
    return () => unsub();
  }, [postId]);

  // Handle Likes
  const handleLike = async () => {
    if (!user) return alert("Please login to like posts");
    try {
      const postRef = doc(db, "posts", postId);
      if (post.likes?.includes(user.uid)) {
        await updateDoc(postRef, { likes: arrayRemove(user.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(user.uid) });
      }
    } catch (err) {
      console.error(err);
      alert("Error updating like!");
    }
  };

  // Handle Comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    if (!comment.trim()) return;
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: Date.now(),
          text: comment,
          user: user.displayName || user.email,
          createdAt: new Date(),
          replies: [],
        }),
      });
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Error posting comment!");
    }
  };

  // Handle Reply
  const handleReply = async (commentId, replyText) => {
    if (!user) return alert("Please login to reply");
    if (!replyText.trim()) return;
    try {
      const postRef = doc(db, "posts", postId);
      const updatedComments = post.comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                id: Date.now(),
                text: replyText,
                user: user.displayName || user.email,
                createdAt: new Date(),
              },
            ],
          };
        }
        return c;
      });
      await updateDoc(postRef, { comments: updatedComments });
      setReplyMap({ ...replyMap, [commentId]: "" });
    } catch (err) {
      console.error(err);
      alert("Error posting reply!");
    }
  };

  if (!post) return <p className="text-center mt-3">Loading...</p>;

  return (
    <div className="post-page">
      <div className="post-container">
        <h2 className="post-title">{post.title}</h2>

        {/* Render Quill HTML safely */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <p className="post-meta">
          By {post.authorName || post.authorEmail || "Anonymous"} •{" "}
          {post.createdAt
            ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
            : ""}
        </p>

        {/* Actions */}
        <div className="post-actions">
          <button
            onClick={handleLike}
            className={`like-button ${
              user && post.likes?.includes(user.uid) ? "liked" : ""
            }`}
          >
            {user && post.likes?.includes(user.uid) ? (
              <FaHeart className="icon liked-icon" />
            ) : (
              <FaRegHeart className="icon" />
            )}
            {post.likes ? post.likes.length : 0}
          </button>

          <span className="comment-count">
            <FaCloud className="icon cloud-icon" />{" "}
            {post.comments ? post.comments.length : 0}
          </span>
        </div>

        {/* Comment Section */}
        <div className="comments-section">
          <h3>Comments</h3>
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit">Post</button>
          </form>

          {post.comments?.length > 0 ? (
            post.comments.map((c) => (
              <div key={c.id} className="comment-card">
                <p>
                  <strong>{c.user}</strong>: {c.text}
                </p>
                <small>
                  {c.createdAt
                    ? new Date(c.createdAt.seconds * 1000).toLocaleString()
                    : ""}
                </small>

                {/* Replies */}
                {c.replies?.map((r) => (
                  <div key={r.id} className="reply-card">
                    <p>
                      <strong>{r.user}</strong>: {r.text}
                    </p>
                    <small>
                      {r.createdAt
                        ? new Date(r.createdAt.seconds * 1000).toLocaleString()
                        : ""}
                    </small>
                  </div>
                ))}

                {/* Reply Input */}
                <form
                  className="reply-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReply(c.id, replyMap[c.id] || "");
                  }}
                >
                  <input
                    type="text"
                    placeholder="Reply..."
                    value={replyMap[c.id] || ""}
                    onChange={(e) =>
                      setReplyMap({ ...replyMap, [c.id]: e.target.value })
                    }
                  />
                  <button type="submit">
                    <FaReply />
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
