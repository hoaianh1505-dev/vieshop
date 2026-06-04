export const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0));

export const orderStatusOptions = ['pending', 'processing', 'shipping', 'completed', 'cancelled'];
