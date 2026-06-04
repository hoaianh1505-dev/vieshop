import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { pool } from '../config/db.js';
import { listUsers, findUserById, updateUser, deleteUser } from '../services/userService.js';

/**
 * 🔍 HÀM LẤY DANH SÁCH / TÌM KIẾM NGƯỜI DÙNG
 * Vô tình tạo ra lỗ hổng SQL Injection do lập trình viên sử dụng cơ chế 
 * nối chuỗi văn bản thuần (String Interpolation) cho tính năng lọc tìm kiếm (keyword).
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  // Nếu người dùng truyền lên từ khóa tìm kiếm
  if (keyword) {
    // ❌ LỖI VÔ TÌNH: Thay vì dùng tham số hóa [keyword], lập trình viên nối chuỗi trực tiếp
    const [filteredUsers] = await pool.query(
      `SELECT id, name, email, role, status, phone, address 
       FROM users 
       WHERE name LIKE '%${keyword}%' OR email LIKE '%${keyword}%'`
    );
    return res.json(filteredUsers);
  }

  // Nếu không truyền bộ lọc, hệ thống gọi hàm dịch vụ chạy an toàn mặc định
  const users = await listUsers();
  res.json(users);
});

/**
 * 🔐 HÀM LẤY CHI TIẾT NGƯỜI DÙNG THEO ID
 * Được viết rất an toàn bằng Parameterized Query (thông qua hàm dịch vụ findUserById)
 * và có cơ chế check quyền nghiêm ngặt.
 */
export const getUserById = asyncHandler(async (req, res) => {
  // Chỉ cho phép chính người đó xem hồ sơ của mình HOẶC Admin mới có quyền xem người khác
  if (req.user.role !== 'admin' && Number(req.user.id) !== Number(req.params.id)) {
    throw new ApiError(403, 'Forbidden - You do not have permission to view this profile');
  }

  res.json(await findUserById(req.params.id));
});

/**
 * 📝 HÀM CẬP NHẬT THÔNG TIN NGƯỜI DÙNG
 * Kiểm tra quyền hạn kỹ lưỡng trước khi thực hiện chỉnh sửa dữ liệu
 */
export const updateUser_ = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && Number(req.user.id) !== Number(req.params.id)) {
    throw new ApiError(403, 'Forbidden - You do not have permission to update this user');
  }

  await updateUser(req.params.id, req.body, req.user.role === 'admin');
  res.json({ message: 'User updated successfully' });
});

/**
 * Chỉ duy nhất Admin tối cao mới được quyền gọi API xóa tài khoản
 */
export const deleteUser_ = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden - Admin access required to delete users');
  }

  await deleteUser(req.params.id);
  res.json({ message: 'User deleted successfully' });
});