import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  FaUserFriends, FaBookOpen, FaCheckCircle, 
  FaArrowUp, FaExclamationCircle, FaPlus, FaNewspaper 
} from 'react-icons/fa'; 
import AdminApi from '../api/AdminApi'; 
import './CSS/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [counts, setCounts] = useState({
    users: 0, recipes: 0, pending: 0, blogs: 0 
  });
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await AdminApi.getDashboardStats();
        
        if (response && response.counts) setCounts(response.counts);

        if (response && response.chart) {
            const daysMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const formattedChart = response.chart.map(item => {
                const date = new Date(item.date);
                return {
                    name: daysMap[date.getDay()],
                    fullDate: item.date,
                    value: item.value
                };
            });
            setChartData(formattedChart);
        }

        if (response && response.categories) {
            const colors = ['bg-orange', 'bg-green', 'bg-yellow', 'bg-blue'];
            const formattedCats = response.categories.map((cat, index) => ({
                ...cat,
                color: colors[index % colors.length] 
            }));
            setCategories(formattedCats);
        }

      } catch (error) {
        console.error("Lỗi tải Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const STATS_CONFIG = [
    {
      label: 'Tổng người dùng',
      value: counts.users ? counts.users.toLocaleString() : 0,
      icon: <FaUserFriends />,
      trend: 'Tổng tích lũy', 
      trendIcon: <FaArrowUp />,
      trendClass: 'text-green',
      iconClass: 'bg-blue text-blue',
      onClick: () => navigate('/admin/users'), 
      isClickable: true
    },
    {
      label: 'Chờ duyệt',
      value: counts.pending,
      icon: <FaBookOpen />,
      trend: 'Cần xử lý',
      trendIcon: <FaExclamationCircle />,
      trendClass: 'text-orange',
      iconClass: 'bg-orange text-orange',
      accent: true,
      onClick: () => navigate('/admin/DuyetCongThuc'),
      isClickable: true
    },
    {
      label: 'Công thức',
      value: counts.recipes ? counts.recipes.toLocaleString() : 0,
      icon: <FaCheckCircle />,
      trend: 'Đã đăng',
      trendIcon: <FaPlus />,
      trendClass: 'text-gray',
      iconClass: 'bg-green text-green',
      isClickable: false 
    },
    {
      label: 'Bài viết Blog',
      value: counts.blogs ? counts.blogs.toLocaleString() : 0,
      icon: <FaNewspaper />,
      trend: 'Chia sẻ mới',
      trendIcon: <FaPlus />,
      trendClass: 'text-purple',
      iconClass: 'bg-purple text-purple',
      isClickable: false
    },
  ];

  if (loading) {
      return <div className="db-container" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading...</div>;
  }

  return (
    <div className="db-container">
      <div className="db-header">
        <div className="db-header-text">
          <h1 className="db-title">Tổng quan Hệ thống</h1>
          <p className="db-subtitle">Số liệu cập nhật mới nhất.</p>
        </div>
      </div>

      <div className="db-stats-grid">
        {STATS_CONFIG.map((stat, idx) => (
          <div 
            key={idx} 
            className={`stat-card ${stat.accent ? 'stat-accent' : ''}`}
            onClick={stat.onClick ? stat.onClick : undefined}
            style={{ cursor: stat.isClickable ? 'pointer' : 'default' }}
          >
            <div className="stat-top">
              <div>
                <span className="stat-label-mini">{stat.label}</span>
                <h3 className="stat-value-big">{stat.value}</h3>
              </div>
              <div className={`stat-icon-box ${stat.iconClass}`}>
                {stat.icon}
              </div>
            </div>
            <div className={`stat-trend ${stat.trendClass}`}>
              {stat.trendIcon} <span>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="db-main-grid">
        <div className="db-card card-chart">
          <div className="card-header">
            <h2 className="card-title">Xu hướng đăng công thức</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis 
                    allowDecimals={false} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) return payload[0].payload.fullDate;
                        return label;
                    }}
                />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="db-card card-categories">
          <h2 className="card-title">Danh mục phổ biến</h2>
          <div className="category-list">
            {categories.length > 0 ? (
                categories.map((cat, idx) => (
                <div key={idx} className="category-item">
                    <div className="cat-info">
                    <span>{cat.name}</span>
                    <strong>{cat.percent}% <span style={{fontSize:'0.8em', color:'#888', fontWeight:'normal'}}>({cat.count})</span></strong>
                    </div>
                    <div className="progress-bar-bg">
                    <div className={`progress-bar-fill ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-500">Chưa có dữ liệu danh mục</p>
            )}
          </div>
          <div className="tip-box">
            <strong>Ghi chú:</strong> Dựa trên tổng số công thức.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;