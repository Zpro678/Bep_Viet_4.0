import axiosClient from './axiosClient';

const recipeApi = {
    getDanhSachCongThuc: (id) => {
        const url = `/users/${id}/my-recipes`; 
        return axiosClient.get(url);
    },
};

export default recipeApi;