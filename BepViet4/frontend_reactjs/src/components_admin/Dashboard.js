import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  FaUserFriends, FaBookOpen, FaCheckCircle, FaFlag, FaServer, 
  FaArrowUp, FaExclamationCircle, FaPlus, FaMoon, FaEllipsisH,
  FaAngleDown 
} from 'react-icons/fa';
import './CSS/Dashboard.css';


const STATS = [
  {
    label: 'Tổng người dùng',
    value: '12,450',
    icon: <FaUserFriends />,
    trend: '+12% tuần này',
    trendIcon: <FaArrowUp />,
    trendClass: 'text-green',
    iconClass: 'bg-blue text-blue',
  },
  {
    label: 'Chờ duyệt',
    value: '48',
    icon: <FaBookOpen />,
    trend: 'Cần chú ý',
    trendIcon: <FaExclamationCircle />,
    trendClass: 'text-orange',
    iconClass: 'bg-orange text-orange',
    accent: true,
  },
  {
    label: 'Công thức',
    value: '3,892',
    icon: <FaCheckCircle />,
    trend: '+54 hôm nay',
    trendIcon: <FaPlus />,
    trendClass: 'text-gray',
    iconClass: 'bg-green text-green',
  },
  {
    label: 'Vi phạm',
    value: '5',
    icon: <FaFlag />,
    trend: 'Ưu tiên cao',
    trendClass: 'text-red',
    iconClass: 'bg-red text-red',
  },
  {
    label: 'Hệ thống',
    value: '99.9%',
    icon: <FaServer />,
    trend: 'Hoạt động tốt',
    trendClass: 'text-gray',
    iconClass: 'bg-purple text-purple',
  },
];

const CHART_DATA = [
  { name: 'T2', value: 12 }, { name: 'T3', value: 19 }, { name: 'T4', value: 15 },
  { name: 'T5', value: 25 }, { name: 'T6', value: 22 }, { name: 'T7', value: 30 },
  { name: 'CN', value: 48 },
];

const POPULAR_CATEGORIES = [
  { name: 'Tráng miệng', value: 35, color: 'bg-orange' },
  { name: 'Món chay', value: 25, color: 'bg-green' },
  { name: 'Bữa sáng', value: 20, color: 'bg-yellow' },
  { name: 'Đồ uống', value: 15, color: 'bg-blue' },
];

const RECENT_REPORTS = [
  {
    id: 1,
    title: 'Bình luận spam trên "Đậu phụ cay"',
    by: 'User882', time: '2 phút trước',
    icon: <FaFlag />, iconClass: 'bg-red text-red'
  },
  {
    id: 2,
    title: 'Khiếu nại bản quyền hình ảnh',
    by: 'System Bot', time: '1 giờ trước',
    icon: <FaExclamationCircle />, iconClass: 'bg-orange text-orange'
  },
];

const Dashboard = () => {
  return (
    <div className="db-container">
      {/* HEADER */}
      <div className="db-header">
        <div className="db-header-text">
          <h1 className="db-title">Tổng quan Hệ thống</h1>
          <p className="db-subtitle">Chào mừng trở lại, đây là tình hình hoạt động hôm nay.</p>
        </div>
        <div className="db-header-actions">
          <button className="btn-icon-circle"><FaMoon /></button>
          <button className="btn-primary-shadow">
            <FaPlus /> <span>Thông báo mới</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="db-stats-grid">
        {STATS.map((stat, idx) => (
          <div key={idx} className={`stat-card ${stat.accent ? 'stat-accent' : ''}`}>
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

      {/* MAIN CONTENT GRID */}
      <div className="db-main-grid">
        {/* CHART SECTION */}
        <div className="db-card card-chart">
          <div className="card-header">
            <h2 className="card-title">Xu hướng đăng bài</h2>
            <div className="badge-select">
              7 ngày qua <FaAngleDown />
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="db-card card-categories">
          <h2 className="card-title">Danh mục phổ biến</h2>
          <div className="category-list">
            {POPULAR_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="category-item">
                <div className="cat-info">
                  <span>{cat.name}</span>
                  <strong>{cat.value}%</strong>
                </div>
                <div className="progress-bar-bg">
                  <div className={`progress-bar-fill ${cat.color}`} style={{ width: `${cat.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="tip-box">
            <strong>Mẹo:</strong> Thẻ "Healthy" đã tăng <span className="text-orange">15%</span> tuần này.
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="db-bottom-grid">
        {/* REPORTS */}
        <div className="db-card">
          <div className="card-header">
            <h2 className="card-title">Báo cáo gần đây</h2>
            <button className="btn-text-link">Xem tất cả</button>
          </div>
          <div className="report-list">
            {RECENT_REPORTS.map((report) => (
              <div key={report.id} className="report-item">
                <div className={`report-icon ${report.iconClass}`}>
                  {report.icon}
                </div>
                <div className="report-info">
                  <h4>{report.title}</h4>
                  <p>Bởi <strong>{report.by}</strong> • {report.time}</p>
                </div>
                <button className="btn-small-outline">Xem xét</button>
              </div>
            ))}
          </div>
        </div>

        {/* SETTINGS */}
        <div className="db-card">
          <div className="card-header">
            <h2 className="card-title">Cài đặt nhanh</h2>
            <button className="btn-text-link">Quản lý</button>
          </div>
          <div className="setting-list">
            {[
              { label: 'Bảo trì hệ thống', desc: 'Tạm khóa truy cập', active: false },
              { label: 'Duyệt tự động', desc: 'Bỏ qua kiểm duyệt thủ công', active: true },
              { label: 'Đăng ký mới', desc: 'Cho phép tạo tài khoản', active: true },
            ].map((setting, idx) => (
              <div key={idx} className="setting-item">
                <div className="setting-info">
                  <p className="setting-label">{setting.label}</p>
                  <p className="setting-desc">{setting.desc}</p>
                </div>
                <div className={`toggle-switch ${setting.active ? 'active' : ''}`}>
                  <div className="toggle-circle"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;