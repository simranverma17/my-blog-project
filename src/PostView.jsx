import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function PostView() {
  const { postId } = useParams();
  const [user] = useAuthState(auth);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({}); // store replies per comment

  useEffect(() => {
    // Fetch post
    const fetchPost = async () => {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPost(docSnap.data());
    };
    fetchPost();

    // Listen for comments
    const commentsRef = collection(db, "posts", postId, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    const commentsRef = collection(db, "posts", postId, "comments");
    await addDoc(commentsRef, {
      text: commentText,
      authorId: user.uid,
      authorEmail: user.email,
      createdAt: new Date(),
      replies: [],
    });
    setCommentText("");
  };

  const handleReplySubmit = async (commentId) => {
    if (!user || !replyText[commentId]?.trim()) return;

    const commentRef = doc(db, "posts", postId, "comments", commentId);
    await updateDoc(commentRef, {
      replies: arrayUnion({
        text: replyText[commentId],
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: new Date(),
      }),
    });
    setReplyText({ ...replyText, [commentId]: "" });
  };

  const handleDeleteComment = async (commentId) => {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    await updateDoc(commentRef, { text: "[deleted]" }); // simple soft delete
  };

  const handleDeleteReply = async (commentId, reply) => {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    await updateDoc(commentRef, {
      replies: arrayRemove(reply),
    });
  };

  const handleLike = async () => {
    if (!user) return;
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: arrayUnion(user.uid),
    });
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto" }}>
      <h2>{post.title}</h2>
      <p dangerouslySetInnerHTML={{ __html: post.content }} />
      <p style={{ fontSize: "12px", color: "gray" }}>
        By: {post.authorEmail} |{" "}
        {post.createdAt?.toDate
          ? post.createdAt.toDate().toLocaleString()
          : "Unknown date"}
      </p>
      <button
        onClick={handleLike}
        style={{
          padding: "8px 12px",
          marginTop: "10px",
          borderRadius: "4px",
          background: "#282c34",
          color: "white",
          cursor: "pointer",
        }}
      >
        Like ({post.likes?.length || 0})
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>Comments</h3>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
            }}
          >
            <p>
              <strong>{c.authorEmail}:</strong> {c.text}{" "}
              {user?.uid === c.authorId && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  style={{ marginLeft: "10px", color: "red", cursor: "pointer", border: "none", background: "transparent" }}
                >
                  Delete
                </button>
              )}
            </p>

            {/* Replies */}
            {c.replies?.map((r, idx) => (
              <div
                key={idx}
                style={{
                  marginLeft: "20px",
                  borderLeft: "2px solid #ccc",
                  paddingLeft: "10px",
                  marginTop: "5px",
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>{r.authorEmail}:</strong> {r.text}{" "}
                  {user?.uid === r.authorId && (
                    <button
                      onClick={() => handleDeleteReply(c.id, r)}
                      style={{ marginLeft: "10px", color: "red", cursor: "pointer", border: "none", background: "transparent" }}
                    >
                      Delete
                    </button>
                  )}
                </p>
              </div>
            ))}

            {/* Reply Input */}
            {user && (
              <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                <input
                  type="text"
                  placeholder="Reply..."
                  value={replyText[c.id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [c.id]: e.target.value })
                  }
                  style={{
                    width: "80%",
                    padding: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={() => handleReplySubmit(c.id)}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "5px",
                    borderRadius: "4px",
                    background: "#282c34",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}

        {/* New Comment Input */}
        {user && (
          <form
            onSubmit={handleCommentSubmit}
            style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                background: "#282c34",
                color: "white",
                cursor: "pointer",
              }}
            >
              Comment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PostView;
