import { useEffect, useState } from 'react';
import api, { authHeaders } from '../../api/http';
import { useApp } from '../../context/AppContext';
import { Users, Lock, Unlock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminUsersPage() {
  const { auth, pushToast } = useApp();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await api.get('/users', authHeaders(auth.token));
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, [auth.token]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-650">
          <Users size={18} />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900">Quản lý người dùng</h1>
          <p className="text-xs text-slate-400 font-sans">Danh sách thành viên đăng ký hệ thống và phân quyền tài khoản</p>
        </div>
      </div>

      <div className="mt-6 overflow-auto">
        {users.length ? (
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-150 text-slate-450 uppercase font-bold tracking-wider select-none">
                <th className="pb-3 font-semibold">Người dùng</th>
                <th className="pb-3 font-semibold">Vai trò</th>
                <th className="pb-3 font-semibold">Trạng thái</th>
                <th className="pb-3 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="py-3.5">
                    <div className="flex flex-col">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      user.role === 'admin' ? 'text-brand-650' : 'text-slate-500'
                    }`}>
                      {user.role === 'admin' ? (
                        <>
                          <ShieldAlert size={12} />
                          <span>Quản trị</span>
                        </>
                      ) : (
                        <span>Khách</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}
                    >
                      {user.status === 'active' ? 'Hoạt động' : 'Đang khóa'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {user.role !== 'admin' ? (
                      <button
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition ${
                          user.status === 'active'
                            ? 'bg-slate-900 hover:bg-red-500 hover:text-white text-white shadow-soft'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft'
                        }`}
                        onClick={async () => {
                          await api.put(
                            `/users/${user.id}`,
                            { status: user.status === 'active' ? 'blocked' : 'active' },
                            authHeaders(auth.token),
                          );
                          pushToast('Đã cập nhật trạng thái người dùng thành công');
                          fetchUsers();
                        }}
                      >
                        {user.status === 'active' ? (
                          <>
                            <Lock size={11} />
                            <span>Khóa tài khoản</span>
                          </>
                        ) : (
                          <>
                            <Unlock size={11} />
                            <span>Kích hoạt</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold italic">Không khả dụng</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-slate-500">
            Hệ thống chưa ghi nhận tài khoản đăng ký nào.
          </div>
        )}
      </div>
    </div>
  );
}


