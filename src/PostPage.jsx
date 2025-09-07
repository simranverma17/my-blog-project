import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaHeart, FaRegHeart, FaCloud, FaReply } from "react-icons/fa";
import "./styles/PostPage.css";

function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // comment index being replied to
  const [user] = useAuthState(auth);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "posts", postId), (docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      }
    });
    return () => unsub();
  }, [postId]);

  const handleLike = async () => {
    if (!user) return alert("Please login to like posts");
    const postRef = doc(db, "posts", postId);
    if (post.likes?.includes(user.uid)) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        text: comment,
        user: user.displayName || user.email,
        createdAt: new Date(),
        replies: [],
      }),
    });
    setComment("");
  };

  const handleReply = async (e, index) => {
    e.preventDefault();
    if (!user) return alert("Please login to reply");
    if (!replyText) return;

    const postRef = doc(db, "posts", postId);
    const updatedComments = [...post.comments];
    if (!updatedComments[index].replies) updatedComments[index].replies = [];

    updatedComments[index].replies.push({
      text: replyText,
      user: user.displayName || user.email,
      createdAt: new Date(),
    });

    await updateDoc(postRef, { comments: updatedComments });
    setReplyText("");
    setReplyingTo(null);
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-page">
      <div className="post-container">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <p className="post-meta">
          By {post.authorName || "Anonymous"} •{" "}
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
            post.comments.map((c, index) => (
              <div key={index} className="comment-card">
                <p>
                  <strong>{c.user}</strong>: {c.text}
                </p>
                <small>
                  {c.createdAt
                    ? new Date(c.createdAt.seconds * 1000).toLocaleString()
                    : ""}
                </small>

                {/* Reply button */}
                <button
                  className="reply-button"
                  onClick={() =>
                    setReplyingTo(replyingTo === index ? null : index)
                  }
                >
                  <FaReply className="icon" /> Reply
                </button>

                {/* Reply Form */}
                {replyingTo === index && (
                  <form
                    onSubmit={(e) => handleReply(e, index)}
                    className="reply-form"
                  >
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                    />
                    <button type="submit">Reply</button>
                  </form>
                )}

                {/* Display replies */}
                {c.replies?.length > 0 &&
                  c.replies.map((r, rIndex) => (
                    <div key={rIndex} className="reply-card">
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

export default PostPage;
