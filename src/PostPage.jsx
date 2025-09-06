import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./components/Loader";
import "./styles/PostPage.css";

function PostPage() {
  const { id } = useParams(); // post ID
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // reply target
  const [expandedComments, setExpandedComments] = useState({}); // collapse state
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setPost({ id: snapshot.id, ...snapshot.data() });
      }

      const commentsRef = collection(db, "posts", id, "comments");
      const unsubscribe = onSnapshot(commentsRef, (snap) => {
        const commentsData = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setComments(
          commentsData.sort(
            (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
          )
        );
      });

      setLoading(false);
      return () => unsubscribe();
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert("Login to like a post.");
    try {
      const postRef = doc(db, "posts", id);
      const alreadyLiked = post.likes?.includes(user.uid);

      await updateDoc(postRef, {
        likes: alreadyLiked
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid),
      });

      setPost((prev) => ({
        ...prev,
        likes: alreadyLiked
          ? prev.likes.filter((uid) => uid !== user.uid)
          : [...(prev.likes || []), user.uid],
      }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login to comment.");
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, "posts", id, "comments");
      await addDoc(commentsRef, {
        text: newComment,
        author: user.displayName || user.email,
        authorId: user.uid,
        parentId: replyingTo || null,
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId, authorId) => {
    if (!user || user.uid !== authorId) return;
    try {
      await deleteDoc(doc(db, "posts", id, "comments", commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // recursive threaded render
  const renderComments = (parentId = null, level = 0) => {
    return comments
      .filter((c) => c.parentId === parentId)
      .map((c) => {
        const childComments = comments.filter(
          (child) => child.parentId === c.id
        );
        const isExpanded = expandedComments[c.id] ?? true;

        return (
          <div
            key={c.id}
            className="comment-card"
            style={{ marginLeft: `${level * 20}px` }}
          >
            <p className="comment-author">
              <strong>{c.author}</strong>
            </p>
            <p className="comment-text">{c.text}</p>
            {c.createdAt?.toDate && (
              <p className="comment-date">
                {c.createdAt.toDate().toLocaleString()}
              </p>
            )}

            <div className="comment-actions">
              <button
                className="reply-btn"
                onClick={() => setReplyingTo(c.id)}
              >
                Reply
              </button>
              {childComments.length > 0 && (
                <button
                  className="toggle-replies"
                  onClick={() => toggleReplies(c.id)}
                >
                  {isExpanded
                    ? `Hide ${childComments.length} repl${
                        childComments.length > 1 ? "ies" : "y"
                      }`
                    : `View ${childComments.length} repl${
                        childComments.length > 1 ? "ies" : "y"
                      }`}
                </button>
              )}
              {user?.uid === c.authorId && (
                <button
                  className="delete-comment"
                  onClick={() => handleDeleteComment(c.id, c.authorId)}
                >
                  Delete
                </button>
              )}
            </div>

            {/* Recursive children */}
            {isExpanded && renderComments(c.id, level + 1)}
          </div>
        );
      });
  };

  if (loading) return <Loader />;
  if (!post) return <p className="no-post">Post not found</p>;

  return (
    <div className="post-page">
      <div className="post-container">
        <h1 className="post-title">{post.title}</h1>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <p className="post-meta">
          By <strong>{post.authorEmail}</strong>
        </p>

        <div className="post-actions">
          <button
            onClick={handleLike}
            className={`like-button ${
              post.likes?.includes(user?.uid) ? "liked" : ""
            }`}
          >
            ❤️ {post.likes ? post.likes.length : 0}
          </button>
          <span className="comment-count">
            💬 {comments.length} Comments
          </span>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments</h3>

          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              {replyingTo && (
                <p className="replying-to">
                  Replying…{" "}
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="cancel-reply"
                  >
                    Cancel
                  </button>
                </p>
              )}
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit">
                {replyingTo ? "Reply" : "Post"}
              </button>
            </form>
          )}

          {comments.length === 0 && (
            <p className="no-comments">No comments yet</p>
          )}

          {renderComments()}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
