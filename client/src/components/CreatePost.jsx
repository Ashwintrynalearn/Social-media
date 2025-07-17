import { useState } from "react";
import { X, Image, Video, Trash2 } from "lucide-react";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function CreatePost({ user, onPost, onClose }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('userId', cookies.get('userId'));
    formData.append('username', cookies.get('username'));
    formData.append('content', content);
    if (media) {
      formData.append('media', media);
    }

    try {
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create post');
      const data = await response.json();
      onPost({ content, media: data.media, postId: data.postId, createdAt: data.createdAt });
      setContent("");
      setMedia(null);
      setMediaPreview(null);
      onClose();
    } catch (error) {
      console.error('Post error:', error);
      alert('Failed to create post');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl mx-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Post</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://via.placeholder.com/40'}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Image size={20} />
              <span className="text-sm">Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaChange}
                className="hidden"
              />
            </label>

            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Video size={20} />
              <span className="text-sm">Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleMediaChange}
                className="hidden"
              />
            </label>
          </div>

          {mediaPreview && (
            <div className="relative">
              {media?.type.startsWith("image/") ? (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full rounded-lg"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setMedia(null);
                  setMediaPreview(null);
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;