export interface User {
  id?: number
  name: string
  email: string
  password: string
}

export interface Company {
  id?: number
  name: string
  userId: number
}

export interface Store {
  id?: number
  name: string
  companyId: number
}

export interface Product {
  id?: number
  name: string
  price: number
  storeId: number
}