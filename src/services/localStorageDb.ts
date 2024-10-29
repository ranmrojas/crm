import { User, Company, Store, Product } from '../types'

class LocalStorageDb {
  private getItem<T>(key: string): T[] {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : []
  }

  private setItem<T>(key: string, value: T[]): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Users
  getUsers(): User[] {
    return this.getItem<User>('users')
  }

  createUser(user: User): User {
    const users = this.getUsers()
    const newUser = { ...user, id: users.length + 1 }
    this.setItem('users', [...users, newUser])
    return newUser
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(user => user.email === email)
  }

  // Companies
  getCompanies(): Company[] {
    return this.getItem<Company>('companies')
  }

  createCompany(company: Company): Company {
    const companies = this.getCompanies()
    const newCompany = { ...company, id: companies.length + 1 }
    this.setItem('companies', [...companies, newCompany])
    return newCompany
  }

  // Stores
  getStores(): Store[] {
    return this.getItem<Store>('stores')
  }

  createStore(store: Store): Store {
    const stores = this.getStores()
    const newStore = { ...store, id: stores.length + 1 }
    this.setItem('stores', [...stores, newStore])
    return newStore
  }

  getStoresByCompanyId(companyId: number): Store[] {
    return this.getStores().filter(store => store.companyId === companyId)
  }

  // Products
  getProducts(): Product[] {
    return this.getItem<Product>('products')
  }

  createProduct(product: Product): Product {
    const products = this.getProducts()
    const newProduct = { ...product, id: products.length + 1 }
    this.setItem('products', [...products, newProduct])
    return newProduct
  }

  getProductsByStoreId(storeId: number): Product[] {
    return this.getProducts().filter(product => product.storeId === storeId)
  }
}

export const localStorageDb = new LocalStorageDb()