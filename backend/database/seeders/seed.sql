INSERT INTO users (name, email, password_hash, role, status, phone, address) VALUES
('Admin VieShop', 'admin@gmail.com', '$2b$10$EZm3qWMh7Tl5/6RfjnraVOL0VpUBFt4EOLpB9REJqc1pz1OBqfkky', 'admin', 'active', '0900000001', 'Ho Chi Minh City'),
('Nguyen Minh Anh', 'minhanh@gmail.com', '$2b$10$EZm3qWMh7Tl5/6RfjnraVOL0VpUBFt4EOLpB9REJqc1pz1OBqfkky', 'user', 'active', '0900000002', 'Da Nang'),
('Tran Thu Ha', 'thuha@gmail.com', '$2b$10$EZm3qWMh7Tl5/6RfjnraVOL0VpUBFt4EOLpB9REJqc1pz1OBqfkky', 'user', 'active', '0900000003', 'Ha Noi'),
('Le Quang Huy', 'quanghuy@gmail.com', '$2b$10$EZm3qWMh7Tl5/6RfjnraVOL0VpUBFt4EOLpB9REJqc1pz1OBqfkky', 'user', 'active', '0900000004', 'Can Tho'),
('Pham Bao Ngoc', 'baongoc@gmail.com', '$2b$10$EZm3qWMh7Tl5/6RfjnraVOL0VpUBFt4EOLpB9REJqc1pz1OBqfkky', 'user', 'active', '0900000005', 'Hai Phong'),
('Do Gia Bao', 'giabao@gmail.com', '$2b$10$EZm3qWMh7Tl5/6RfjnraVOL0VpUBFt4EOLpB9REJqc1pz1OBqfkky', 'user', 'active', '0900000006', 'Nha Trang')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  status = VALUES(status),
  phone = VALUES(phone),
  address = VALUES(address);
