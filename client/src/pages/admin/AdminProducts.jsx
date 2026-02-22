import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    sizes: [],
    colors: [],
    featured: false,
    isActive: true,
  });

  const fetchProducts = () => {
    setLoading(true);
    api.get(`/admin/products?page=${page}&limit=10`)
      .then(({ data }) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const openCreate = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: [],
      sizes: [],
      colors: [],
      featured: false,
      isActive: true,
    });
    setModal('create');
  };

  const openEdit = (p) => {
    setForm({
      _id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      images: p.images || [],
      sizes: p.sizes || [],
      colors: p.colors || [],
      featured: p.featured || false,
      isActive: p.isActive !== false,
    });
    setModal('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    delete payload._id;
    try {
      if (modal === 'create') {
        await api.post('/admin/products', payload);
        toast.success('Product created');
      } else {
        await api.put(`/admin/products/${form._id}`, payload);
        toast.success('Product updated');
      }
      setModal(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await api.post('/upload/single', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, images: [...(f.images || []), { url: data.url, publicId: data.publicId }] }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-stone-600 text-sm mt-1">Add, edit, and manage your product catalog.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">Add Product</button>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading products...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Category</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-stone-100">
                  <td className="p-4">
                    <img src={p.images?.[0]?.url || 'https://via.placeholder.com/60'} alt="" className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">${p.price?.toFixed(2)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 text-right">
                    <button type="button" onClick={() => openEdit(p)} className="text-brand-600 hover:underline mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="p-4 flex justify-center gap-2">
              <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span className="flex items-center px-4">Page {page} of {totalPages}</span>
              <button type="button" className="btn-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold mb-6">{modal === 'create' ? 'New Product' : 'Edit Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input min-h-[80px]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Price</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Images</label>
                <input type="file" accept="image/*" onChange={uploadImage} className="input" />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.images?.map((img, i) => (
                    <img key={i} src={img.url} alt="" className="w-16 h-16 object-cover rounded" />
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                  Active
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
