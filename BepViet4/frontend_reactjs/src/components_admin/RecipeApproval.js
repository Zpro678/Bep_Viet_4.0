
import React from 'react';
import { Recipe } from '../types';

const RECIPE = [
  {
    id: '1',
    title: 'Salad Hạt Diêm Mạch Mùa Hè',
    description: 'Sự kết hợp tươi mới của hạt diêm mạch, bơ, cà chua bi và sốt chanh. Hoàn hảo cho ngày hè.',
    author: {
      name: 'Thanh Hương',
      role: 'Contributor',
      avatar: 'https://picsum.photos/seed/user1/100/100',
    },
    image: 'https://picsum.photos/seed/salad/400/300',
    tag: 'Healthy',
    tagColor: 'bg-green-100 text-green-700',
    time: '2 giờ trước',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Pizza Pepperoni Nhà Làm',
    description: 'Bột pizza tự làm phủ đầy phô mai mozzarella và pepperoni cay giòn rụm.',
    author: {
      name: 'Minh Quân',
      role: 'Pro Chef',
      avatar: 'https://picsum.photos/seed/user2/100/100',
    },
    image: 'https://picsum.photos/seed/pizza/400/300',
    tag: 'Fast Food',
    tagColor: 'bg-red-100 text-red-600',
    time: '5 giờ trước',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Bánh Lava Chocolate Đen',
    description: 'Món tráng miệng tan chảy ngọt ngào, đậm vị chocolate cho những dịp đặc biệt.',
    author: {
      name: 'Ngọc Mai',
      role: 'New User',
      avatar: 'https://picsum.photos/seed/user3/100/100',
    },
    image: 'https://picsum.photos/seed/cake/400/300',
    tag: 'Dessert',
    tagColor: 'bg-purple-100 text-purple-700',
    time: 'Hôm qua',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Green Goddess Bowl',
    description: 'Bát rau xanh tổng hợp tốt cho sức khỏe với quả bơ, edamame và nước sốt đặc trưng.',
    author: {
      name: 'Hoàng Nam',
      role: 'Regular',
      avatar: 'https://picsum.photos/seed/user4/100/100',
    },
    image: 'https://picsum.photos/seed/bowl/400/300',
    tag: 'Vegan',
    tagColor: 'bg-emerald-100 text-emerald-700',
    time: 'Hôm qua',
    status: 'pending',
  },
  {
    id: '5',
    title: 'Sushi Cá Ngừ Cay',
    description: 'Công thức sushi cá ngừ chuẩn vị Nhật Bản với chút cay nồng của sốt mayo sriracha.',
    author: {
      name: 'Duy Khánh',
      role: 'Contributor',
      avatar: 'https://picsum.photos/seed/user5/100/100',
    },
    image: 'https://picsum.photos/seed/sushi/400/300',
    tag: 'Seafood',
    tagColor: 'bg-blue-100 text-blue-700',
    time: '2 ngày trước',
    status: 'reviewed',
  },
  {
    id: '6',
    title: 'Sinh Tố Xoài Nhiệt Đới',
    description: 'Sự kết hợp giữa xoài chín mọng và sữa chua mang lại năng lượng tuyệt vời.',
    author: {
      name: 'Hồng Hạnh',
      role: 'Regular',
      avatar: 'https://picsum.photos/seed/user6/100/100',
    },
    image: 'https://picsum.photos/seed/smoothie/400/300',
    tag: 'Beverages',
    tagColor: 'bg-orange-100 text-orange-700',
    time: '3 ngày trước',
    status: 'pending',
  },
];

const RecipeCard = ({ recipe }) => (
  <div className={`bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${recipe.status === 'reviewed' ? 'opacity-70 grayscale-[0.3]' : ''}`}>
    <div className="relative h-56 overflow-hidden">
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
      />
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${recipe.tagColor} shadow-sm backdrop-blur-md bg-opacity-90`}>
        {recipe.tag}
      </div>
      {recipe.status === 'reviewed' && (
        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
          <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Đang xem xét</span>
        </div>
      )}
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-black text-slate-800 leading-tight flex-1 mr-2">{recipe.title}</h3>
        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap mt-1">{recipe.time}</span>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6 font-medium">
        {recipe.description}
      </p>
      
      <div className="flex items-center space-x-3 mb-6 mt-auto">
        <img src={recipe.author.avatar} alt={recipe.author.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100" />
        <div>
          <p className="text-sm font-black text-slate-800">{recipe.author.name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{recipe.author.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
        <button 
          disabled={recipe.status === 'reviewed'}
          className="flex items-center justify-center space-x-2 bg-orange-500 text-white py-2.5 rounded-2xl text-xs font-black hover:bg-orange-600 transition-all disabled:opacity-50 disabled:bg-slate-300"
        >
          <span className="material-icons-round text-sm">{recipe.status === 'reviewed' ? 'lock' : 'check'}</span>
          <span>{recipe.status === 'reviewed' ? 'Đã khóa' : 'Duyệt'}</span>
        </button>
        <button 
          disabled={recipe.status === 'reviewed'}
          className="flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-2xl text-xs font-black hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <span className="material-icons-round text-sm">close</span>
          <span>Từ chối</span>
        </button>
      </div>
    </div>
  </div>
);

const RecipeApproval = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-black text-slate-800">Duyệt công thức</h1>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <span className="material-icons-round text-xl">search</span>
          </span>
          <input 
            type="text" 
            placeholder="Tìm kiếm công thức..." 
            className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-full md:w-80 shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button className="px-5 py-2.5 bg-orange-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-orange-500/20">
            Đang chờ duyệt (24)
          </button>
          <button className="px-5 py-2.5 text-slate-400 text-xs font-bold hover:text-slate-600">
            Bị báo cáo (5)
          </button>
          <button className="px-5 py-2.5 text-slate-400 text-xs font-bold hover:text-slate-600">
            Gần đây
          </button>
        </div>

        <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Lọc theo:</span>
          <select className="bg-transparent text-sm font-black text-slate-700 focus:outline-none">
            <option>Tất cả danh mục</option>
            <option>Món chính</option>
            <option>Tráng miệng</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {RECIPES.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50">
            <span className="material-icons-round">chevron_left</span>
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-500 text-white font-black text-sm">1</button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50">2</button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50">3</button>
          <span className="px-2 text-slate-400">...</span>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50">8</button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50">
            <span className="material-icons-round">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default RecipeApproval;
