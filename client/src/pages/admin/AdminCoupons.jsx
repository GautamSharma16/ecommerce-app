import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiryDate: '',
        usageLimit: '',
        isActive: true,
    });

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/coupons');
            setCoupons(data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleOpenModal = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
                usageLimit: coupon.usageLimit || '',
                isActive: coupon.isActive,
            });
        } else {
            setEditingCoupon(null);
            setFormData({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', usageLimit: '', isActive: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
            };
            if (editingCoupon) {
                await api.put(`/coupons/${editingCoupon._id}`, payload);
                toast.success('Coupon updated');
            } else {
                await api.post('/coupons', payload);
                toast.success('Coupon created');
            }
            setShowModal(false);
            fetchCoupons();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            toast.success('Coupon deleted');
            fetchCoupons();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete coupon');
        }
    };

    if (loading) return <div>Loading coupons...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-display text-stone-900">Coupons</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium"
                >
                    Add Coupon
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-sm font-medium text-stone-500">
                            <th className="p-4">Code</th>
                            <th className="p-4">Config</th>
                            <th className="p-4">Expiry</th>
                            <th className="p-4">Usage</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                        {coupons.map((c) => (
                            <tr key={c._id} className="hover:bg-stone-50/50 transition">
                                <td className="p-4 font-bold text-stone-900">{c.code}</td>
                                <td className="p-4 text-stone-500 text-sm">
                                    {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} flat`}
                                </td>
                                <td className="p-4 text-stone-500 text-sm">{new Date(c.expiryDate).toLocaleDateString()}</td>
                                <td className="p-4 text-stone-500 text-sm">{c.usedCount} / {c.usageLimit || '∞'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {c.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleOpenModal(c)} className="text-brand-600 hover:text-brand-800 font-medium text-sm">Edit</button>
                                    <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-stone-500">No coupons found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editingCoupon ? 'Edit Coupon' : 'New Coupon'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Coupon Code</label>
                                    <input
                                        type="text" required value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-500 outline-none uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Discount Type</label>
                                    <select
                                        value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-2"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Flat Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Value</label>
                                    <input
                                        type="number" required min="1" value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Expiry Date</label>
                                    <input
                                        type="date" required value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Usage Limit (optional)</label>
                                    <input
                                        type="number" min="1" value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                        placeholder="Unlimited"
                                        className="w-full border border-stone-200 rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div className="col-span-2 flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox" id="isActive" checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="rounded text-brand-600 focus:ring-brand-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-stone-700">Active</label>
                                </div>
                            </div>
                            <div className="pt-4 flex space-x-3 justify-end">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
