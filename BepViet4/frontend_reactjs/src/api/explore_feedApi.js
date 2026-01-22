import axiosClient from './axiosClient';

const feedApi = {
    getExploreRecipes: (userId = null, page = 1) => {
        // Nếu có userId → dùng route có auth
        // Nếu không → dùng route public
        const url = userId 
            ? `/users/${userId}/explore/recipes?page=${page}`
            : `/explore/recipes?page=${page}`;
            
        return axiosClient.get(url);
    },
};

export default feedApi;