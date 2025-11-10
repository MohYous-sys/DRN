import React, { useState, useEffect } from 'react';

interface CampaignModalProps {
  campaign: any;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, onClose, onSave }) => {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      ID: campaign?.ID,
      Title: campaign?.Title || '',
      Location: campaign?.Location || '',
      Urgency: campaign?.Urgency || '',
      Description: campaign?.Description || '',
      Image: campaign?.Image || '',
      Goal: campaign?.Goal ?? 0,
      Due: campaign?.Due || '',
    });
  }, [campaign]);

  const handleChange = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{form?.ID ? 'Edit Campaign' : 'New Campaign'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>
        <div className="p-6">
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.Title} onChange={e => handleChange('Title', e.target.value)} placeholder="Title" className="p-2 border rounded" />
            <input value={form.Location} onChange={e => handleChange('Location', e.target.value)} placeholder="Location" className="p-2 border rounded" />
            <div className="flex items-center p-2">
              <input 
                type="checkbox" 
                id="urgency"
                checked={form.Urgency === 'urgent'} 
                onChange={e => handleChange('Urgency', e.target.checked ? 'urgent' : '')} 
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="urgency" className="ml-2 text-gray-700">Mark as Urgent</label>
            </div>
            <input value={form.Due} onChange={e => handleChange('Due', e.target.value)} placeholder="Due (YYYY-MM-DD)" className="p-2 border rounded" />
            <input value={form.Image} onChange={e => handleChange('Image', e.target.value)} placeholder="Image URL" className="p-2 border rounded md:col-span-2" />
            <input value={form.Goal} onChange={e => handleChange('Goal', Number(e.target.value))} placeholder="Goal" type="number" className="p-2 border rounded" />
            <textarea value={form.Description} onChange={e => handleChange('Description', e.target.value)} placeholder="Description" className="p-2 border rounded md:col-span-2" />
          </div>
        </div>
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
