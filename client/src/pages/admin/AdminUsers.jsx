import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}`, { role });
      toast.success('User updated');
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const toggleBlock = async (userId, isBlocked) => {
    try {
      await api.put(`/admin/users/${userId}`, { isBlocked: !isBlocked });
      toast.success(`User ${!isBlocked ? 'blocked' : 'unblocked'}`);
      fetchUsers(); // Using fetchUsers to reload, wait we need to define fetchUsers
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const fetchUsers = () => {
    setLoading(true);
    api.get(`/admin/users?page=${page}&limit=10`)
      .then(({ data }) => {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Users</h1>
      <p className="text-stone-600 mb-8">Manage registered users and assign admin or user roles.</p>
      {loading ? (
        <p className="text-stone-500">Loading users...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-stone-100">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="input py-1 text-sm"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => toggleBlock(u._id, u.isBlocked)}
                      className={`text-sm font-medium ${u.isBlocked ? 'text-green-600 hover:text-green-800' : 'text-red-500 hover:text-red-700'}`}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    {/* View history could be added by filtering orders page by this user's email */}
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
    </div>
  );
}
