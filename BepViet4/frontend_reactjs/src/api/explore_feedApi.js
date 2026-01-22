// src/api/feedApi.js
import axiosClient from './axiosClient';

const feedApi = {
    getExploreRecipes: (userId, page = 1) => {
        return axiosClient.get(`/users/${userId}/explore/recipes?page=${page}`);
    },
};

export default feedApi;