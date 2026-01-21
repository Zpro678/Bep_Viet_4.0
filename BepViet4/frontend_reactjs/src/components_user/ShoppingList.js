import React, { useState, useEffect } from 'react';
import { shoppingListService } from '../services/shoppingListService';
import './CSS/ShoppingList.css';
import { FaTrash, FaCheck, FaShoppingCart } from 'react-icons/fa'; // Bỏ FaPlus

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await shoppingListService.getList();
        setItems(data);
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 
  const handleToggle = async (id) => {
    // Tìm item để lấy trạng thái cũ
    const itemToToggle = items.find(i => i.id === id);
    if (!itemToToggle) return;

   
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, is_bought: !item.is_bought } : item
    );
    setItems(updatedItems);

  
    try {
      await shoppingListService.toggleStatus(id, itemToToggle.is_bought);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái");
   
    }
  };

 
  const handleDelete = async (id) => {
    if(!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    setItems(items.filter(i => i.id !== id));
    await shoppingListService.deleteItem(id);
  };

  if (loading) return <div className="shopping-loading">Đang tải danh sách...</div>;

  return (
    <div className="shopping-container">
      <div className="shopping-header">
        <h2><FaShoppingCart /> Danh Sách Cần Mua</h2>
        <span className="item-count">
          {items.filter(i => i.is_bought).length}/{items.length} đã mua
        </span>
      </div>

      {/* --- DANH SÁCH (Đã bỏ form thêm mới ở trên) --- */}
      <div className="shopping-list">
        {items.length === 0 && <p className="empty-msg">Danh sách trống.</p>}
        
        {items.map(item => (
          <div 
            key={item.id} 
            className={`shopping-item ${item.is_bought ? 'bought' : ''}`}
            onClick={() => handleToggle(item.id)}
          >
            <div className="checkbox-custom">
              {item.is_bought && <FaCheck />}
            </div>
            
            <div className="item-details">
              <span className="item-name">{item.ingredient_name}</span>
              <span className="item-meta">
                {item.quantity} {item.unit}
              </span>
            </div>

            <button 
              className="btn-delete" 
              onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingList;