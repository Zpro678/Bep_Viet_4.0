// File: src/components_admin/CategoryRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoryManager from './CategoryManager';

const CategoryRoutes = () => {
    return (
        <Routes>
            <Route
                path="ingredients"
                element={<CategoryManager title="Quản Lý Nguyên Liệu"
                    apiEndpoint="http://localhost:8000/api/ingredients" />}
            />
            <Route
                path="recipes"
                element={
                    <CategoryManager
                        title="Quản Lý Công Thức"
                        apiEndpoint="http://localhost:8000/api/recipes"
                        idKey="ma_cong_thuc"
                        nameKey="ten_mon"
                    />
                }
            />

            {/* <Route
                path="meal-plans"
                element={
                    <CategoryManager
                        title="Quản Lý Thực Đơn"
                        apiEndpoint="http://localhost:8000/api/meal-plans"

                    />
                }
            /> */}
            <Route
                path="regions"
                element={
                    <CategoryManager
                        title="Quản Lý Vùng Miền"
                        apiEndpoint="http://localhost:8000/api/regions"
                        idKey="ma_vung_mien"
                        nameKey="ten_vung_mien"
                    />
                }
            />
        </Routes>
    );
};

export default CategoryRoutes;