import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/admin/reviews?page=${page}&limit=10`);
            setReviews(data.reviews);
            setTotalPages(data.totalPages);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page]);

    const handleDelete = async (productId, reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.delete(`/admin/reviews/${productId}/${reviewId}`);
            toast.success('Review deleted');
            fetchReviews();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete review');
        }
    };

    if (loading && page === 1) return <div>Loading reviews...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold font-display text-stone-900 mb-6">Product Reviews</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-sm font-medium text-stone-500">
                            <th className="p-4">Product</th>
                            <th className="p-4">Reviewer</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Comment</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                        {reviews.map((r) => (
                            <tr key={r._id} className="hover:bg-stone-50/50 transition">
                                <td className="p-4">
                                    <Link to={`/product/${r.productId}`} className="font-medium text-brand-600 hover:underline">{r.productName}</Link>
                                </td>
                                <td className="p-4 text-stone-900 text-sm">{r.name}</td>
                                <td className="p-4">
                                    <div className="flex text-amber-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star}>{star <= r.rating ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-stone-500 text-sm max-w-sm truncate" title={r.comment}>{r.comment}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(r.productId, r._id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {reviews.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-stone-500">No reviews found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-stone-200 flex justify-center space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-stone-600">Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
