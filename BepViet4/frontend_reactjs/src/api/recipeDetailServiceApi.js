import axiosClient from './axiosClient';

export const recipeDetailService = {
    /**
     * Lấy chi tiết công thức theo ID
     * @param {string|number} id - ID công thức
     */
    getById: (id) => {
        return axiosClient.get(`recipes/${id}/detail-full`);
    }
};