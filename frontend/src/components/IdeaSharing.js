 // src/components/IdeaSharing.js

import { useState, useEffect } from 'react';
import './IdeaSharing.css';
import { FiImage, FiVideo, FiArrowUp, FiMessageSquare, FiEdit2, FiTrash2, FiCheck, FiX, FiSend } from 'react-icons/fi';
import { API, updateIdea, deleteIdea, toggleUpvote, addComment } from '../api';
import { useAuth } from '../auth/AuthContext';

const IdeaSharing = () => {
  // State for creating a new idea
  const [ideaText, setIdeaText] = useState('');
  
  // State for the feed
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for editing an existing idea
  const [editingIdeaId, setEditingIdeaId] = useState(null);
  const [editedText, setEditedText] = useState('');

  // State for managing comments
  const [visibleCommentsPostId, setVisibleCommentsPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  const { user, isLoading: isAuthLoading } = useAuth();

  // Fetch ideas on component mount
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/ideas'); 
        setIdeas(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch ideas:", err);
        setError("Could not load ideas. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  // --- Bug Fix ---
  // The backend model doesn't have a 'title' field. This is the corrected function.
  const handlePostIdea = async (e) => {
    e.preventDefault();
    if (!ideaText.trim()) return;
    try {
      const { data: newIdea } = await API.post('/ideas', { text: ideaText });
      setIdeas([newIdea, ...ideas]); // Add new idea to the top of the list
      setIdeaText('');
    } catch (err) {
      console.error("Failed to post idea:", err);
      alert("Error: Could not post your idea.");
    }
  };

  const handleUpvote = async (ideaId) => {
    try {
      const updatedIdea = await toggleUpvote(ideaId); // API function for PUT /like
      setIdeas(ideas.map(i => (i._id === ideaId ? updatedIdea : i)));
    } catch (err) {
      console.error("Failed to upvote idea:", err);
      alert("Failed to update upvote.");
    }
  };

  // --- Edit Handlers ---
  const handleEditClick = (idea) => {
    setEditingIdeaId(idea._id);
    setEditedText(idea.text);
  };
  const handleCancelEdit = () => {
    setEditingIdeaId(null);
    setEditedText('');
  };
  const handleUpdateIdea = async (ideaId) => {
    if (!editedText.trim()) return;
    try {
      const updatedIdea = await updateIdea(ideaId, { text: editedText });
      setIdeas(ideas.map(i => (i._id === ideaId ? updatedIdea : i)));
      handleCancelEdit();
    } catch (err) {
      console.error("Failed to update idea:", err);
      alert("Failed to save changes.");
    }
  };

  const handleDeleteIdea = async (ideaId) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await deleteIdea(ideaId);
        setIdeas(ideas.filter(i => i._id !== ideaId));
      } catch (err) {
        console.error("Failed to delete idea:", err);
        alert("Could not delete the idea.");
      }
    }
  };

  // --- Comment Handlers ---
  const handleToggleComments = (ideaId) => {
    if (visibleCommentsPostId === ideaId) {
      setVisibleCommentsPostId(null);
    } else {
      setVisibleCommentsPostId(ideaId);
    }
  };

  const handleAddComment = async (e, ideaId) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    try {
      const updatedIdea = await addComment(ideaId, { text: newCommentText });
      setIdeas(ideas.map(i => (i._id === ideaId ? updatedIdea : i)));
      setNewCommentText('');
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to post comment.");
    }
  };

  const isUpvotedByCurrentUser = (idea) => {
    // Make sure user and idea.likes exist before checking
    return user && idea.likes?.includes(user._id);
  };

  // Show a main loading screen if auth is still resolving or ideas are fetching
  if (isAuthLoading || loading) {
    return <div className="loading-container"><p>Loading community ideas...</p></div>;
  }

  return (
    <div className="idea-sharing-container">
      {/* --- IDEA CREATOR BOX --- */}
      <div className="idea-creator">
        <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?._id}`} alt="Your avatar" className="creator-avatar" />
        <form onSubmit={handlePostIdea} className="creator-form">
          <textarea
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="Share an idea with the community..."
            rows="3"
          />
          <div className="creator-actions">
            <div className="media-buttons">
              <button type="button" className="media-btn"><FiImage /> Photo</button>
              <button type="button" className="media-btn"><FiVideo /> Video</button>
            </div>
            <button type="submit" className="post-btn" disabled={!ideaText.trim()}>
              <FiSend /> Post
            </button>
          </div>
        </form>
      </div>

      {/* --- IDEAS FEED --- */}
      <div className="ideas-feed">
        <h2>Community Feed</h2>
        {error ? ( <div className="empty-state error-message"><p>{error}</p></div> ) : 
         ideas.length === 0 ? ( <div className="empty-state"><p>No ideas shared yet. Be the first!</p></div> ) : 
         (
          <div className="ideas-list">
            {ideas.map((idea) => (
              <div key={idea._id} className="idea-card">
                <div className="card-header">
                  <img src={idea.user?.avatar || `https://i.pravatar.cc/150?u=${idea.user?._id}`} alt={idea.user?.username} className="user-avatar" />
                  <div className="user-info">
                    <h4>{idea.user?.username || 'Anonymous'}</h4>
                    <small>{new Date(idea.createdAt).toLocaleString()}</small>
                  </div>
                  {user && user._id === idea.user?._id && (
                    <div className="owner-actions">
                      <button onClick={() => handleEditClick(idea)} className="icon-btn" aria-label="Edit"><FiEdit2 /></button>
                      <button onClick={() => handleDeleteIdea(idea._id)} className="icon-btn danger" aria-label="Delete"><FiTrash2 /></button>
                    </div>
                  )}
                </div>
                
                <div className="card-content">
                  {editingIdeaId === idea._id ? (
                    <div className="edit-mode">
                      <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} rows="4" />
                      <div className="edit-actions">
                        <button onClick={() => handleUpdateIdea(idea._id)} className="text-btn save-btn"><FiCheck/> Save</button>
                        <button onClick={handleCancelEdit} className="text-btn cancel-btn"><FiX/> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="idea-text">{idea.text}</p>
                      {idea.imageUrl && <div className="media-container"><img src={idea.imageUrl} alt="Idea visual" /></div>}
                      {idea.videoUrl && <div className="media-container"><video controls src={idea.videoUrl} /></div>}
                    </>
                  )}
                </div>
                
                <div className="card-footer">
                  <button onClick={() => handleUpvote(idea._id)} className={`action-btn ${isUpvotedByCurrentUser(idea) ? 'upvoted' : ''}`}>
                    <FiArrowUp /> 
                    <span>{idea.likes.length} Upvotes</span>
                  </button>
                  <button onClick={() => handleToggleComments(idea._id)} className="action-btn">
                    <FiMessageSquare /> 
                    <span>{idea.comments?.length || 0} Comments</span>
                  </button>
                </div>

                {visibleCommentsPostId === idea._id && (
                  <div className="comment-section">
                    <form onSubmit={(e) => handleAddComment(e, idea._id)} className="comment-form">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                      />
                      <button type="submit" disabled={!newCommentText.trim()} aria-label="Post comment"><FiSend /></button>
                    </form>
                    <div className="comment-list">
                      {idea.comments && idea.comments.length > 0 ? (
                        idea.comments.slice(0).reverse().map(comment => ( // .slice(0).reverse() to show newest first
                          <div key={comment._id} className="comment">
                            <img src={comment.user?.avatar || `https://i.pravatar.cc/150?u=${comment.user?._id}`} alt={comment.user?.username} className="commenter-avatar" />
                            <div className="comment-body">
                              <strong>{comment.user?.username || 'Anonymous'}</strong>
                              <p>{comment.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-comments">No comments yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaSharing;