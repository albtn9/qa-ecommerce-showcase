import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

export interface User {
  id: number
  email: string
  password: string
  name: string
}

export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number | null
  category: string
  stock: number
  inStock: boolean
  image: string
  rating: number
  reviews: number
  description: string
  features: string[]
}

export interface Order {
  id?: number
  userId: number
  products: { productId: number; quantity: number }[]
  total: number
  createdAt: string
}

export const getProducts = () => api.get<Product[]>('/products')
export const getProduct = (id: number) => api.get<Product>(`/products/${id}`)
export const getUsers = () => api.get<User[]>('/users')
export const createOrder = (order: Order) => api.post('/orders', order)

export default api