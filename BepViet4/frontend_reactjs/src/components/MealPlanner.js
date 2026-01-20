import React, { useState, useEffect } from 'react';
import { mealPlannerService, MEAL_TYPES } from '../services/mealPlannerService';
import './CSS/MealPlanner.css'; // File CSS ở bước 3
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaPlus } from 'react-icons/fa';

const MealPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Ngày hiện tại đang xem
  const [weekDays, setWeekDays] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm tiện ích: Lấy danh sách 7 ngày trong tuần dựa trên currentDate
  const getDaysOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh để Thứ 2 là đầu tuần
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Hàm tiện ích: Format date sang YYYY-MM-DD để so sánh với dữ liệu API
  const formatDateISO = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Load dữ liệu khi tuần thay đổi
  useEffect(() => {
    const days = getDaysOfWeek(currentDate);
    setWeekDays(days);

    const fetchMeals = async () => {
      setLoading(true);
      try {
        const start = formatDateISO(days[0]);
        const end = formatDateISO(days[6]);
        const data = await mealPlannerService.getMealPlan(start, end);
        setMeals(data);
      } catch (error) {
        console.error("Lỗi tải thực đơn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [currentDate]);

  // Điều hướng tuần
  const changeWeek = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (offset * 7));
    setCurrentDate(newDate);
  };

  // Helper: Tìm món ăn trong state dựa vào ngày và loại bữa
  const findMeal = (dateObj, type) => {
    const dateStr = formatDateISO(dateObj);
    return meals.find(m => m.date === dateStr && m.meal_type === type);
  };

  // Render một ô món ăn
  const renderMealCell = (date, type) => {
    const meal = findMeal(date, type);

    return (
      <div className="meal-cell">
        {meal ? (
          <div className="meal-card">
            <span className="meal-name">{meal.recipe.title}</span>
            {/* Nút xóa hoặc sửa có thể đặt ở đây */}
          </div>
        ) : (
          <button className="btn-add-meal">
            <FaPlus />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="planner-container">
      {/* --- HEADER: Điều hướng tuần --- */}
      <div className="planner-header">
        <h2><FaCalendarAlt /> Lên Kế Hoạch Ăn Uống</h2>
        <div className="week-navigation">
          <button onClick={() => changeWeek(-1)}><FaChevronLeft /> Tuần trước</button>
          <span>
            {weekDays.length > 0 && 
              `${weekDays[0].getDate()}/${weekDays[0].getMonth()+1} - ${weekDays[6].getDate()}/${weekDays[6].getMonth()+1}`
            }
          </span>
          <button onClick={() => changeWeek(1)}>Tuần sau <FaChevronRight /></button>
        </div>
      </div>

      {loading ? (
        <div className="planner-loading">Đang tải lịch...</div>
      ) : (
        /* --- TABLE LỊCH --- */
        <div className="planner-grid">
          {/* Header Row: Các thứ trong tuần */}
          <div className="grid-header-cell empty-corner">Bữa \ Ngày</div>
          {weekDays.map((day, index) => (
            <div key={index} className={`grid-header-cell day-header ${day.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
              <div className="day-name">
                {index === 6 ? 'CN' : `Thứ ${index + 2}`}
              </div>
              <div className="day-date">{day.getDate()}</div>
            </div>
          ))}

          {/* Row: Sáng */}
          <div className="row-label">Sáng ☀️</div>
          {weekDays.map((day, index) => (
            <div key={`sang-${index}`} className="grid-cell">
              {renderMealCell(day, MEAL_TYPES.BREAKFAST)}
            </div>
          ))}

          {/* Row: Trưa */}
          <div className="row-label">Trưa 🌤️</div>
          {weekDays.map((day, index) => (
            <div key={`trua-${index}`} className="grid-cell">
              {renderMealCell(day, MEAL_TYPES.LUNCH)}
            </div>
          ))}

          {/* Row: Tối */}
          <div className="row-label">Tối 🌙</div>
          {weekDays.map((day, index) => (
            <div key={`toi-${index}`} className="grid-cell">
              {renderMealCell(day, MEAL_TYPES.DINNER)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;