import axios from 'axios';


const axiosClient = axios.create({

baseURL: 'http://127.0.0.1:8000/api', // Đường dẫn tới Laravel API

headers: {

'Content-Type': 'application/json',

// Dòng dưới rất quan trọng: giúp Laravel trả về JSON khi có lỗi (thay vì HTML)

'Accept': 'application/json',

},

});


// Cấu hình tự động thêm Token vào mỗi request (nếu đã đăng nhập)

axiosClient.interceptors.request.use((config) => {

const token = localStorage.getItem('ACCESS_TOKEN'); // Lấy token từ bộ nhớ

if (token) {

config.headers.Authorization = `Bearer ${token}`;

}

return config;

});


export default axiosClient;
