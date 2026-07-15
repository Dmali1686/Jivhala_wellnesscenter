import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Video } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../config';

export default function VlogsAdmin() {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    youtube_url: ''
  });

  useEffect(() => {
    fetchVlogs();
  }, []);

  const fetchVlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/vlogs/`);
      setVlogs(response.data);
    } catch (error) {
      console.error('Failed to fetch vlogs:', error);
      toast.error('Failed to load vlogs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/api/v1/vlogs/`, formData);
      toast.success('Vlog added successfully!');

      setFormData({
        title: '',
        category: '',
        youtube_url: ''
      });
      fetchVlogs();
    } catch (error) {
      console.error('Failed to add vlog:', error);
      toast.error('Failed to add vlog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vlog?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/vlogs/${id}`);
      toast.success('Vlog deleted successfully');
      fetchVlogs();
    } catch (error) {
      console.error('Failed to delete vlog:', error);
      toast.error('Failed to delete vlog');
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Add New Vlog Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Plus size={24} className="text-[#006400]" /> Add New Vlog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vlog Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-colors"
                placeholder="e.g. 5 Morning Habits for Radical Calm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-colors"
                placeholder="e.g. Holistic Lifestyle"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
            <input
              type="url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] transition-colors"
              placeholder="e.g. https://www.youtube.com/watch?v=..."
            />
          </div>

          {formData.youtube_url && extractVideoId(formData.youtube_url) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Video Preview</p>
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${extractVideoId(formData.youtube_url)}`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#006400] hover:bg-[#004d00] text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Vlog'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Vlogs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Video size={20} className="text-gray-500" /> Existing Vlogs
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading vlogs...</p>
          ) : vlogs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No vlogs found. Add your first vlog above.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vlogs.map((vlog) => (
                <div key={vlog.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/30 flex flex-col gap-4">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${extractVideoId(vlog.youtube_url)}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{vlog.title}</h3>
                    <p className="text-sm text-[var(--color-primary)] font-medium mt-1">{vlog.category}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleDelete(vlog.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Delete Vlog"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
