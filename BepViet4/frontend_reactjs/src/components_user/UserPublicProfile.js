import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import PostCard from './PostCard';
import RecipeCard from './RecipeCard_1';
import userApi from '../api/userApi';
import { postService } from '../services/postService';
import './CSS/UserPublicProfile.css';

const TABS = {
    POSTS: 'posts',
    RECIPES: 'recipes',
};

const UserPublicProfile = () => {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [overview, setOverview] = useState(null);
    const [posts, setPosts] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [activeTab, setActiveTab] = useState(TABS.RECIPES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Lấy thông tin chi tiết user
                const userRes = await userApi.getUserById(id);
                const userData = userRes.data; 
                setUser(userData);

                // 2. Lấy Overview (Thống kê)
                const overviewRes = await userApi.getUserOverview(id);
                const overviewData = overviewRes.data?.ThongKe;
                setOverview(overviewData);

                // 3. Lấy danh sách công thức (Dựa trên API và Response bạn vừa gửi)
                const recipeRes = await userApi.getUserRecipes(id);
                // Vì response có cấu trúc: { status: "success", data: { data: [...] } }
                // Nên ta lấy recipeRes.data.data
                if (recipeRes && recipeRes.data) {
                    setRecipes(recipeRes.data.data || []);
                }

                // 4. Kiểm tra vai trò: Nếu không phải member thì mới lấy bài viết
                if (userData.vai_tro !== 'member') {
                    const postRes = await postService.getPostByUser(id);
                    setPosts(postRes.data || []);
                } else {
                    setActiveTab(TABS.RECIPES);
                }
                
            } catch (err) {
                console.error("Lỗi khi tải hồ sơ:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Đang tải hồ sơ người dùng...</p>;
    if (!user) return <p>Không tìm thấy người dùng</p>;

    const isNotMember = user.vai_tro !== 'member';

    return (
        <div className="public-profile">
            {/* ===== HEADER ===== */}
            <div className="profile-header-card">
                <div className="avatar">
                    <img src={user.avatar || 'https://via.placeholder.com/150'} alt="avatar" />
                </div>

                <div className="info">
                    <h2>{user.ho_ten}</h2>
                    {/* Hiển thị username từ overview hoặc tạo mặc định */}
                    <p className="username">@{overview?.ten_dang_nhap || 'user' + user.ma_nguoi_dung}</p>

                    {overview && (
                        <div className="stats">
                            {isNotMember && <span>{overview.tong_bai_viet} bài viết</span>}
                            <span>{overview.tong_cong_thuc} công thức</span>
                            <span>{overview.tong_nguoi_theo_doi} người theo dõi</span>
                            <span>{overview.tong_nguoi_dang_theo_doi} người đang theo dõi</span>
                        </div>
                    )}

                    <button className="btn-follow">
                        <FaUserPlus /> Theo dõi
                    </button>
                </div>
            </div>

            {/* ===== TABS ===== */}
            <div className="profile-tabs">
                <button
                    className={activeTab === TABS.RECIPES ? 'active' : ''}
                    onClick={() => setActiveTab(TABS.RECIPES)}
                >
                    Công thức
                </button>

                {isNotMember && (
                    <button
                        className={activeTab === TABS.POSTS ? 'active' : ''}
                        onClick={() => setActiveTab(TABS.POSTS)}
                    >
                        Bài viết
                    </button>
                )}
            </div>

            {/* ===== CONTENT ===== */}
            <div className="profile-content">
                {/* Tab Bài viết */}
                {activeTab === TABS.POSTS && isNotMember && (
                    <div className="post-list">
                        {posts.length ? (
                            posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <p>Chưa có bài viết</p>
                        )}
                    </div>
                )}

                {/* Tab Công thức */}
                {activeTab === TABS.RECIPES && (
                    <div className="recipe-list-container">
                        <div className="recipe-grid">
                            {recipes.length > 0 ? (
                                recipes.map(recipe => (
                                    /* Truyền dữ liệu recipe vào Card */
                                    /* Lưu ý: Card của bạn cần dùng đúng các trường: ten_mon, hinh_anh, do_kho... */
                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                ))
                            ) : (
                                <p>Chưa có công thức nào</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPublicProfile;