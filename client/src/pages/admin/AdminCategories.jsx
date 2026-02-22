import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description, isActive: category.isActive });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', isActive: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, formData);
                toast.success('Category updated');
            } else {
                await api.post('/categories', formData);
                toast.success('Category created');
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted');
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete category');
        }
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-display text-stone-900">Categories</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium"
                >
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-sm font-medium text-stone-500">
                            <th className="p-4">Name</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-stone-50/50 transition">
                                <td className="p-4 font-medium text-stone-900">{cat.name}</td>
                                <td className="p-4 text-stone-500 text-sm truncate max-w-xs">{cat.description}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {cat.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleOpenModal(cat)} className="text-brand-600 hover:text-brand-800 font-medium text-sm">Edit</button>
                                    <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-stone-500">No categories found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded text-brand-600 focus:ring-brand-500 border-stone-300"
                                />
                                <label htmlFor="isActive" className="text-sm text-stone-700">Active</label>
                            </div>
                            <div className="pt-4 flex space-x-3 justify-end">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
