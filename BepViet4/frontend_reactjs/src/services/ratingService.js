import axiosClient from '../api/axiosClient';

export const ratingService = {
  submitRating: async (data) => {
    const response = await axiosClient.post('/ratings', data);
    return response.data ? response.data : response; 
},

getRecipeRatingStats: async (recipeId) => {
    const response = await axiosClient.get(`/recipes/${recipeId}/ratings`);
    return response.data ? response.data : response; 
}
};