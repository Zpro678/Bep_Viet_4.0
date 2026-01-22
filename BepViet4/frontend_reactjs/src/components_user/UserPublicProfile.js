import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import PostCard from './PostCard';
import RecipeCard from './RecipeCard_1';
import userApi from '../api/userApi';
import postService from '../services/postService';
import './CSS/UserPublicProfile.css';

const API_BASE_URL = 'http://127.0.0.1:8000'; 

const TABS = {
    POSTS: 'posts',
    RECIPES: 'recipes',
};
const UserPublicProfile = () => {
    const { id } = useParams(); // lấy id từ url

    const [user, setUser] = useState(null); // user 
    const [overview, setOverview] = useState(null); // thống kê
    const [posts, setPosts] = useState([]); // bài viết
    const [recipes, setRecipes] = useState([]); // công thức
    const [isFollowing, setIsFollowing] = useState(false); // trạng tháo theo dõi
    const [activeTab, setActiveTab] = useState(TABS.RECIPES); // tab được mở
    const [loading, setLoading] = useState(true); // trạng thái tải dữ liệu

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [userRes, overviewRes, recipeRes, followRes] = await Promise.all([
                    userApi.getUserById(id),
                    userApi.getUserOverview(id),
                    userApi.getUserRecipes(id),
                    userApi.checkFollowStatus(id)
                ]);
               // console.log("Dữ liệu user trả về:", id);
                // // lấy trạng thái theo dõi 
                console.log("Dữ liệu follow trả về:", followRes);
                setIsFollowing(Boolean(followRes?.data?.is_following));


                // 1. Lấy thông tin chi tiết user
                const userData = userRes.data;
                setUser(userData);

                // 2. Lấy Overview (Thống kê)
                const overviewData = overviewRes.data?.ThongKe;
                setOverview(overviewData);

                // 3. Lấy danh sách công thức 
                if (recipeRes && recipeRes.data.data) {
                    setRecipes(recipeRes.data.data || []);
                }
                console.log("Công thức đã lấy:", recipeRes.data.data || []);

                // 4. Kiểm tra vai trò: Nếu là blogger thì mới lấy bài viết
                if (userData.vai_tro === 'blogger') {
                    const postRes = await userApi.getUserPosts(id);

                    // lấy mảng bài viết
                    if (postRes && postRes.data) {
                        const postList = postRes.data.data || [];

                        const mappedPosts = postList.map(post => ({
                            id: post.id,
                            content: post.noi_dung,
                            image: post.hinh_anh,
                            created_at: post.ngay_dang,
                            likes_count: post.luot_yeu_thich,
                            comments_count: post.luot_chia_se,
                            user: {
                                id: post.nguoi_dung.id,
                                name: post.nguoi_dung.ho_ten,
                                avatar: 'https://via.placeholder.com/40'
                            }
                        }));
                      //  console.log("Bài viết đã map:", mappedPosts);

                        setPosts(mappedPosts);
                    }
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

    const isNotMember = user.vai_tro === 'blogger';

    // Lấy ID của tôi từ LocalStorage (Lưu ý: Key phải khớp với lúc bạn lưu khi Login)
    const myData = JSON.parse(localStorage.getItem('user'));
    const myId = myData?.ma_nguoi_dung || myData?.id;

    // So sánh ID của tôi với ID trên URL (người đang xem)
    const isSelf = String(myId) === String(id);

    // xử lí nút follow
    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await userApi.unfollowUser(id); // đang theo dõi -> hủy
                setIsFollowing(false);

                setOverview(prev => ({ // cập nhật thống kê
                    ...prev,
                    tong_nguoi_theo_doi: prev.tong_nguoi_theo_doi - 1
                }));
            } else {
                await userApi.followUser(id);
                setIsFollowing(true);

                setOverview(prev => ({ // cập nhật thống kê
                    ...prev,
                    tong_nguoi_theo_doi: prev.tong_nguoi_theo_doi + 1
                }));
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Có lỗi xảy ra, vui lòng thử lại';

            alert(message);
        }
    };

    //test
    console.log("Render lại component với isFollowing =", isFollowing)
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

                    <button
                        disabled={isSelf}
                        className={`btn-follow ${isFollowing ? 'following' : ''}`}
                        onClick={handleFollow}
                    >
                        {isSelf ? 'Đây là bạn' : isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
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
        {posts.length > 0 ? (
            posts.map(post => {
                // --- XỬ LÝ ĐƯỜNG DẪN ẢNH BÀI VIẾT ---
                // Nếu API trả về đường dẫn tương đối (/storage/...) thì nối thêm domain vào
                // Nếu null hoặc rỗng thì để null
                const imageUrl = post.image 
                    ? (post.image.startsWith('http') ? post.image : `${API_BASE_URL}${post.image}`)
                    : null;

                return (
                    <PostCard 
                        key={post.id} 
                        post={{
                            ...post,
                            // Ghi đè lại trường image bằng link tuyệt đối
                            image: imageUrl,
                            // Đảm bảo các trường khác khớp với PostCard mong đợi
                            // Ví dụ nếu PostCard dùng 'hinh_anh' thay vì 'image' thì map lại ở đây:
                            // hinh_anh: imageUrl 
                        }} 
                    />
                );
            })
        ) : (
            <div className="empty-state">
                <p>Chưa có bài viết nào</p>
            </div>
        )}
    </div>
)}

                {/* Tab Công thức */}
                {activeTab === TABS.RECIPES && (
    <div className="recipe-list-container">
        <div className="recipe-grid">
            {recipes.length > 0 ? (
                recipes.map(recipe => {
               
                    const imageUrl = recipe.hinh_anh
                        ? (recipe.hinh_anh.startsWith('http')
                            ? recipe.hinh_anh
                            : `${API_BASE_URL}/storage/${recipe.hinh_anh}`)
                        : 'https://via.placeholder.com/300'; // Ảnh mặc định nếu null

                    return (
                        <RecipeCard
                          
                            key={recipe.ma_cong_thuc} 
                            
                            recipe={{
                                ...recipe,
                             
                                hinh_anh: imageUrl 
                            }}
                        />
                    );
                })
            ) : (
                <div className="empty-state" style={{ width: '100%', gridColumn: '1 / -1' }}>
                    <p>Chưa có công thức nào</p>
                </div>
            )}
        </div>
    </div>
)}
            </div>
        </div>
    );
};

export default UserPublicProfile;