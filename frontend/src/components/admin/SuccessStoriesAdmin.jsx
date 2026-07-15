import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../config';

export default function SuccessStoriesAdmin() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name_en: '', name_mr: '',
    loss_en: '', loss_mr: '',
    feedback_en: '', feedback_mr: '',
    before_weight: '', after_weight: ''
  });
  
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/stories/`);
      setStories(response.data);
    } catch (error) {
      toast.error('Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/api/v1/stories/upload-image/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beforeImage || !afterImage) {
      toast.error("Please upload both Before and After images.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Images
      const beforeUrl = await uploadImage(beforeImage);
      const afterUrl = await uploadImage(afterImage);

      // 2. Submit Data
      const storyPayload = {
        ...formData,
        before_image: beforeUrl,
        after_image: afterUrl
      };

      await axios.post(`${API_BASE_URL}/api/v1/stories/`, storyPayload);
      toast.success('Story added successfully!');
      setShowForm(false);
      setFormData({
        name_en: '', name_mr: '',
        loss_en: '', loss_mr: '',
        feedback_en: '', feedback_mr: '',
        before_weight: '', after_weight: ''
      });
      setBeforeImage(null);
      setAfterImage(null);
      fetchStories();
    } catch (error) {
      toast.error('Failed to create story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/stories/${id}`);
      toast.success('Story deleted');
      fetchStories();
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Success Stories</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#006400] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#004d00] transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add New Story</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Before Image *</label>
                  <input type="file" accept="image/*" onChange={(e) => setBeforeImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#006400] hover:file:bg-green-100" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">After Image *</label>
                  <input type="file" accept="image/*" onChange={(e) => setAfterImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#006400] hover:file:bg-green-100" required />
                </div>
              </div>

              {/* Weights */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Before Weight (Optional)</label>
                  <input type="text" name="before_weight" value={formData.before_weight} onChange={handleInputChange} placeholder="e.g. 85kg" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006400]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">After Weight (Optional)</label>
                  <input type="text" name="after_weight" value={formData.after_weight} onChange={handleInputChange} placeholder="e.g. 70kg" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006400]" />
                </div>
              </div>
            </div>

            {/* Bilingual Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
              {/* English */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-2">English Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" name="name_en" value={formData.name_en} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006400]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievement (e.g. Lost 10kg) *</label>
                  <input type="text" name="loss_en" value={formData.loss_en} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006400]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Quote *</label>
                  <textarea name="feedback_en" value={formData.feedback_en} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006400]" required></textarea>
                </div>
              </div>

              {/* Marathi */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-2">मराठी Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (Marathi) *</label>
                  <input type="text" name="name_mr" value={formData.name_mr} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006400]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievement (Marathi) *</label>
                  <input type="text" name="loss_mr" value={formData.loss_mr} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006400]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Quote (Marathi) *</label>
                  <textarea name="feedback_mr" value={formData.feedback_mr} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#006400]" required></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button disabled={isSubmitting} type="submit" className="bg-[#006400] text-white px-6 py-2 rounded-lg hover:bg-[#004d00] transition-colors disabled:opacity-50">
                {isSubmitting ? 'Uploading...' : 'Save Story'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading stories...</p>
        ) : stories.length === 0 ? (
          <p className="text-gray-500">No success stories found. Add one above!</p>
        ) : (
          stories.map(story => (
            <div key={story.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="flex h-48">
                <div className="w-1/2 relative bg-gray-100">
                  <img src={`http://localhost:8000${story.before_image}`} alt="Before" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Before</div>
                </div>
                <div className="w-1/2 relative bg-gray-200">
                  <img src={`http://localhost:8000${story.after_image}`} alt="After" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">After</div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{story.name_en}</h3>
                  <button onClick={() => handleDelete(story.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-green-700 font-semibold mb-3">{story.loss_en}</p>
                <p className="text-sm text-gray-600 line-clamp-3 italic">"{story.feedback_en}"</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
