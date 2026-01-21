// // import React, { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { FaUserPlus } from 'react-icons/fa';
// // import PostCard from './PostCard';
// // import RecipeCard from './RecipeCard_1';
// // import './CSS/UserPublicProfile.css';

// // /* =======================
// //    MOCK DATA (TẠM THỜI)
// // ======================= */
// // const MOCK_USER = {
// //     id: 1,
// //     ho_ten: 'Nguyễn Văn A',
// //     ten_dang_nhap: 'nguyenvana',
// //     avatar: 'https://i.pravatar.cc/150?img=12',
// // };

// // const MOCK_OVERVIEW = {
// //     tong_bai_viet: 2,
// //     tong_cong_thuc: 3,
// //     tong_nguoi_theo_doi: 128,
// // };

// // const MOCK_POSTS = [
// //     {
// //         id: 101,
// //         content: 'Hôm nay làm món gà chiên nước mắm 😋',
// //         image: 'https://picsum.photos/600/400?random=1',
// //         created_at: '2 giờ trước',
// //         likes_count: 23,
// //         comments_count: 5,
// //         user: {
// //             id: 1,
// //             name: 'Nguyễn Văn A',
// //             avatar: 'https://i.pravatar.cc/100?img=12',
// //         },
// //     },
// //     {
// //         id: 102,
// //         content: 'Chia sẻ công thức bún bò Huế chuẩn vị!',
// //         image: 'https://picsum.photos/600/400?random=2',
// //         created_at: '1 ngày trước',
// //         likes_count: 45,
// //         comments_count: 12,
// //         user: {
// //             id: 1,
// //             name: 'Nguyễn Văn A',
// //             avatar: 'https://i.pravatar.cc/100?img=12',
// //         },
// //     },
// // ];

// // const MOCK_RECIPES = [
// //     {
// //         id: 201,
// //         title: 'Bánh Mì Việt Nam Cấp Tốc',
// //         description: 'Cách làm bánh mì giòn tan tại nhà chỉ trong 60 phút không cần nhồi quá lâu.',
// //         image: 'https://picsum.photos/600/400?random=10',
// //         likes: 1250,
// //         author: {
// //             name: 'Nguyễn Văn A',
// //             avatar: 'https://i.pravatar.cc/100?img=12'
// //         }
// //     },
// //     {
// //         id: 202,
// //         title: 'Cà Phê Muối Chuẩn Vị Huế',
// //         description: 'Sự kết hợp hoàn hảo giữa vị đắng của cà phê, mặn của muối và béo của kem.',
// //         image: 'https://picsum.photos/600/400?random=11',
// //         likes: 890,
// //         author: {
// //             name: 'Nguyễn Văn A',
// //             avatar: 'https://i.pravatar.cc/100?img=12'
// //         }
// //     }
// // ];

// // const TABS = {
// //     POSTS: 'posts',
// //     RECIPES: 'recipes',
// //     // VIDEOS: 'videos',
// // };

// // const UserPublicProfile = () => {
// //     const { id } = useParams(); // giữ để sau gắn API thật

// //     const [user, setUser] = useState(null);
// //     const [overview, setOverview] = useState(null);
// //     const [posts, setPosts] = useState([]);
// //     const [recipes, setRecipes] = useState([]);
// //     const [activeTab, setActiveTab] = useState(TABS.POSTS);
// //     const [loading, setLoading] = useState(true);

// //     /* =======================
// //        GIẢ LẬP CALL API
// //     ======================= */
// //     useEffect(() => {
// //         const timer = setTimeout(() => {
// //             setUser(MOCK_USER);
// //             setOverview(MOCK_OVERVIEW);
// //             setPosts(MOCK_POSTS);
// //             setRecipes(MOCK_RECIPES);
// //             setLoading(false);
// //         }, 500);

// //         return () => clearTimeout(timer);
// //     }, [id]);

// //     /* =======================
// //        UI STATES
// //     ======================= */
// //     if (loading) return <p>Đang tải hồ sơ người dùng...</p>;
// //     if (!user) return <p>Không tìm thấy người dùng</p>;

// //     return (
// //         <div className="public-profile">

// //             {/* ===== HEADER (GIỐNG FB) ===== */}
// //             <div className="profile-header-card">
// //                 <div className="avatar">
// //                     <img src={user.avatar} alt="avatar" />
// //                 </div>

// //                 <div className="info">
// //                     <h2>{user.ho_ten}</h2>
// //                     <p className="username">@{user.ten_dang_nhap}</p>

// //                     {overview && (
// //                         <div className="stats">
// //                             <span>{overview.tong_bai_viet} bài viết</span>
// //                             <span>{overview.tong_cong_thuc} công thức</span>
// //                             <span>{overview.tong_nguoi_theo_doi} người theo dõi</span>
// //                             <span>{overview.tong_nguoi_theo_doi} người đang theo dõi</span>
// //                         </div>
// //                     )}

// //                     {/* UI ONLY */}
// //                     <button className="btn-follow">
// //                         <FaUserPlus /> Theo dõi
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* ===== TABS ===== */}
// //             <div className="profile-tabs">
                
// //                 <button
// //                     className={activeTab === TABS.RECIPES ? 'active' : ''}
// //                     onClick={() => setActiveTab(TABS.RECIPES)}
// //                 >
// //                     Công thức
// //                 </button>
// //                 <button
// //                     className={activeTab === TABS.POSTS ? 'active' : ''}
// //                     onClick={() => setActiveTab(TABS.POSTS)}
// //                 >
// //                     Bài viết
// //                 </button>
// //                 {/* <button
// //                     className={activeTab === TABS.VIDEOS ? 'active' : ''}
// //                     onClick={() => setActiveTab(TABS.VIDEOS)}
// //                 >
// //                     Video
// //                 </button> */}
// //             </div>

// //             {/* ===== CONTENT ===== */}
// //             <div className="profile-content">
// //                 {activeTab === TABS.POSTS && (
// //                     <div className="post-list">
// //                         {posts.length ? (
// //                             posts.map(post => (
// //                                 <PostCard key={post.id} post={post} />
// //                             ))
// //                         ) : (
// //                             <p>Chưa có bài viết</p>
// //                         )}
// //                     </div>
// //                 )}

// //                 {activeTab === TABS.RECIPES && (
// //                     <div className="recipe-list-container">
// //                         <div className="recipe-grid">
// //                             {recipes.length > 0 ? (
// //                                 recipes.map(recipe => (
// //                                     <RecipeCard key={recipe.id} recipe={recipe} />
// //                                 ))
// //                             ) : (
// //                                 <p>Chưa có công thức nào</p>
// //                             )}
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* {activeTab === TABS.VIDEOS && (
// //                     <div className="video-grid">
// //                         <p>Video dạng TikTok (UI sau)</p>
// //                     </div>
// //                 )} */}
// //             </div>
// //         </div>
// //     );
// // };

// // export default UserPublicProfile;
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { FaUserPlus } from 'react-icons/fa';
// import PostCard from './PostCard';
// import RecipeCard from './RecipeCard_1';
// import userApi from '../api/userApi'; // Import api
// import { postService } from '../services/postService'; // Import service
// import './CSS/UserPublicProfile.css';

// const TABS = {
//     POSTS: 'posts',
//     RECIPES: 'recipes',
// };

// const UserPublicProfile = () => {
//     const { id } = useParams();

//     const [user, setUser] = useState(null);
//     const [overview, setOverview] = useState(null);
//     const [posts, setPosts] = useState([]);
//     const [recipes, setRecipes] = useState([]);
//     const [activeTab, setActiveTab] = useState(TABS.RECIPES); // Mặc định chọn Công thức
//     const [loading, setLoading] = useState(true);

//     /* =======================
//         CALL API THẬT
//     ======================= */
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
                
//                 // 1. Lấy thông tin chi tiết user
//                 const userRes = await userApi.getUserById(id);
//                 const userData = userRes.data; // Theo cấu trúc {status, data: {...}}
//                 setUser(userData);

//                 // 2. Lấy Overview (Thống kê)
//                 const overviewRes = await userApi.getUserOverview(id);
//                 const overviewData = overviewRes.data?.ThongKe;
//                 setOverview(overviewData);

//                 // 3. Lấy danh sách công thức (Giả sử postService có hàm này hoặc dùng chung)
//                 // Nếu chưa có API riêng cho công thức của user, tạm thời để mảng rỗng hoặc call api tương ứng
//                 // setRecipes(recipeRes.data || []);

//                 // 4. Kiểm tra vai trò: Nếu không phải member thì mới lấy bài viết
//                 if (userData.vai_tro !== 'member') {
//                     const postRes = await postService.getPostByUser(id);
//                     setPosts(postRes.data || []);
//                 } else {
//                     // Nếu là member, luôn đảm bảo activeTab không phải là POSTS
//                     setActiveTab(TABS.RECIPES);
//                 }

//                 console.log("Dữ liệu User nhận được:", userRes);

//             } catch (err) {
//                 console.error("Lỗi khi tải hồ sơ:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [id]);

//     if (loading) return <p>Đang tải hồ sơ người dùng...</p>;
//     if (!user) return <p>Không tìm thấy người dùng</p>;

//     // Kiểm tra điều kiện hiển thị tab Bài viết
//     const isNotMember = user.vai_tro !== 'member';

//     return (
//         <div className="public-profile">

//             {/* ===== HEADER ===== */}
//             <div className="profile-header-card">
//                 <div className="avatar">
//                     {/* Backend trả về ma_nguoi_dung, avatar có thể lấy từ userData nếu có */}
//                     <img src={user.avatar || 'https://via.placeholder.com/150'} alt="avatar" />
//                 </div>

//                 <div className="info">
//                     <h2>{user.ho_ten}</h2>
//                     <p className="username">@{overview?.ten_dang_nhap || 'user' + user.ma_nguoi_dung}</p>

//                     {overview && (
//                         <div className="stats">
//                             {isNotMember && <span>{overview.tong_bai_viet} bài viết</span>}
//                             <span>{overview.tong_cong_thuc} công thức</span>
//                             <span>{overview.tong_nguoi_theo_doi} người theo dõi</span>
//                             <span>{overview.tong_nguoi_dang_theo_doi} người đang theo dõi</span>
//                         </div>
//                     )}

//                     <button className="btn-follow">
//                         <FaUserPlus /> Theo dõi
//                     </button>
//                 </div>
//             </div>

//             {/* ===== TABS ===== */}
//             <div className="profile-tabs">
//                 <button
//                     className={activeTab === TABS.RECIPES ? 'active' : ''}
//                     onClick={() => setActiveTab(TABS.RECIPES)}
//                 >
//                     Công thức
//                 </button>

//                 {/* Chỉ hiển thị tab Bài viết nếu KHÔNG PHẢI member */}
//                 {isNotMember && (
//                     <button
//                         className={activeTab === TABS.POSTS ? 'active' : ''}
//                         onClick={() => setActiveTab(TABS.POSTS)}
//                     >
//                         Bài viết
//                     </button>
//                 )}
//             </div>

//             {/* ===== CONTENT ===== */}
//             <div className="profile-content">
//                 {/* Nội dung bài viết */}
//                 {activeTab === TABS.POSTS && isNotMember && (
//                     <div className="post-list">
//                         {posts.length ? (
//                             posts.map(post => (
//                                 <PostCard key={post.id} post={post} />
//                             ))
//                         ) : (
//                             <p>Chưa có bài viết</p>
//                         )}
//                     </div>
//                 )}

//                 {/* Nội dung công thức */}
//                 {activeTab === TABS.RECIPES && (
//                     <div className="recipe-list-container">
//                         <div className="recipe-grid">
//                             {recipes.length > 0 ? (
//                                 recipes.map(recipe => (
//                                     <RecipeCard key={recipe.id} recipe={recipe} />
//                                 ))
//                             ) : (
//                                 <p>Chưa có công thức nào</p>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UserPublicProfile;

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