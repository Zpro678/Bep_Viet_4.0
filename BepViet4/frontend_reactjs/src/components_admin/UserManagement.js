
import React from 'react';
import { User } from '../types';

const USERS: User[] = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    role: 'Admin',
    roleDescription: 'Quản lý hệ thống',
    status: 'active',
    joinDate: '14 Th1, 2023',
  },
  {
    id: '2',
    name: 'Cody Fisher',
    email: 'cody.fisher@example.com',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    role: 'Chef',
    roleDescription: 'Người sáng tạo nội dung',
    status: 'active',
    joinDate: '22 Th3, 2023',
  },
  {
    id: '3',
    name: 'Esther Howard',
    email: 'esther.howard@example.com',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    role: 'User',
    roleDescription: 'Thành viên thường',
    status: 'blocked',
    joinDate: '04 Th8, 2023',
  },
  {
    id: '4',
    name: 'Jenny Wilson',
    email: 'jenny.wilson@example.com',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    role: 'Chef',
    roleDescription: 'Cộng tác viên',
    status: 'pending',
    joinDate: '15 Th9, 2023',
  },
  {
    id: '5',
    name: 'Kristin Watson',
    email: 'kristin.watson@example.com',
    avatar: 'https://picsum.photos/seed/user5/100/100',
    role: 'User',
    roleDescription: 'Thành viên mới',
    status: 'active',
    joinDate: '21 Th11, 2023',
  },
];

const UserManagement: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Quản lý người dùng</h1>
          <p className="text-slate-400 font-medium mt-1">Quản lý tài khoản, vai trò và quyền hạn.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            <span className="material-icons-round text-lg">file_download</span>
            <span>Xuất dữ liệu</span>
          </button>
          <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-orange-500/30 transition-all transform hover:-translate-y-1">
            <span className="material-icons-round text-lg">add</span>
            <span className="font-bold">Thêm người dùng mới</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Lọc theo vai trò</label>
          <div className="relative">
            <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none">
              <option>Tất cả vai trò</option>
              <option>Admin</option>
              <option>Chef</option>
              <option>User</option>
            </select>
            <span className="material-icons-round absolute right-3 top-2.5 text-slate-400 pointer-events-none">expand_more</span>
          </div>
        </div>
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Lọc theo trạng thái</label>
          <div className="relative">
            <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none">
              <option>Tất cả trạng thái</option>
              <option>Đang hoạt động</option>
              <option>Bị chặn</option>
              <option>Chờ kích hoạt</option>
            </select>
            <span className="material-icons-round absolute right-3 top-2.5 text-slate-400 pointer-events-none">expand_more</span>
          </div>
        </div>
        <div className="flex-[2] min-w-[300px]">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tìm kiếm</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tên hoặc email..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <span className="material-icons-round absolute right-4 top-2.5 text-slate-400">search</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người dùng</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tham gia</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100" />
                      <div>
                        <p className="text-sm font-black text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-slate-700">{user.role}</p>
                    <p className="text-xs text-slate-400 font-medium">{user.roleDescription}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 
                      user.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {user.status === 'active' ? 'Đang hoạt động' : user.status === 'blocked' ? 'Bị chặn' : 'Chờ kích hoạt'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-500 font-bold">{user.joinDate}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-orange-500 transition-all rounded-lg hover:bg-white hover:shadow-sm">
                        <span className="material-icons-round text-lg">edit</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-white hover:shadow-sm">
                        <span className="material-icons-round text-lg">{user.status === 'blocked' ? 'check_circle' : 'block'}</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-all rounded-lg hover:bg-white hover:shadow-sm">
                        <span className="material-icons-round text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-400 font-bold">Hiển thị 1 đến 5 của 20 kết quả</p>
          <div className="flex items-center space-x-2">
            <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <span className="material-icons-round">chevron_left</span>
            </button>
            <button className="h-9 w-9 bg-orange-500 text-white font-black text-sm rounded-xl">1</button>
            <button className="h-9 w-9 bg-slate-50 text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all">2</button>
            <button className="h-9 w-9 bg-slate-50 text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all">3</button>
            <span className="px-1 text-slate-300">...</span>
            <button className="h-9 w-9 bg-slate-50 text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all">8</button>
            <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <span className="material-icons-round">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
