import axiosClient from './axiosClient';

const recipeDetailService = {
    /**
     * Lấy chi tiết công thức theo ID
     * @param {string|number} id - ID công thức
     */
    getById: (id) => {
        return axiosClient.get(`recipes/${id}/detail-full`);
    }
};

export default recipeDetailService;