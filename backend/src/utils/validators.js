import { z } from 'zod';

const positivePrice = z.coerce.number().min(0);
const positiveInt = z.coerce.number().int().min(1);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(6).max(100),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  address: z.string().trim().max(255).optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(100),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(180),
  sku: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(3000),
  price: positivePrice,
  stock: z.coerce.number().int().min(0),
  status: z.enum(['draft', 'active']).default('active'),
  thumbnail_url: z.string().trim().url().optional().or(z.literal('')),
  image_urls: z
    .union([z.string(), z.array(z.string().url())])
    .optional()
    .transform((value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: positiveInt,
        quantity: positiveInt.max(100),
      }),
    )
    .min(1),
  customer_name: z.string().trim().min(2).max(120),
  customer_email: z.string().trim().email(),
  customer_phone: z.string().trim().min(6).max(20),
  shipping_address: z.string().trim().min(10).max(255),
  note: z.string().trim().max(500).optional().or(z.literal('')),
});

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipping', 'completed', 'cancelled']),
  payment_status: z.enum(['unpaid', 'paid']).optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  address: z.string().trim().max(255).optional().or(z.literal('')),
  status: z.enum(['active', 'blocked']).optional(),
});
