import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default class API {
  baseUrl: string;
  supabase: ReturnType<typeof createClient>;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
    this.supabase = supabase;
  }

  // HTTP API methods (using Express backend)
  async fetchAll<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const config = {
      params: params,
    };

    const response = await axios.get<T>(`${this.baseUrl}/${endpoint}?`, config);

    return response.data;
  }

  async fetchOne<T>(endpoint: string, id: string): Promise<T> {
    const response = await axios.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
    return response.data;
  }

  async deleteOne<T>(endpoint: string, slug: string): Promise<T> {
    const response = await axios.delete<T>(
      `${this.baseUrl}/${endpoint}/${slug}`
    );
    return response.data;
  }

  async getCategoriesHierarchy<T>(): Promise<T> {
    const response = await axios.get<T>(`${this.baseUrl}/categories/hierarchy`);
    return response.data;
  }

  async updateOne<T>(
    endpoint: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const response = await axios.patch<T>(
      `${this.baseUrl}/${endpoint}/${id}`,
      data
    );
    return response.data;
  }

  async createOne<T>(
    endpoint: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const response = await axios.post<T>(`${this.baseUrl}/${endpoint}`, data);
    return response.data;
  }

  async singUp<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const response = await axios.post<T>(`${this.baseUrl}/${endpoint}`, data);
    return response.data;
  }

  // Direct Supabase methods
  // Authentication
  async signUpWithSupabase(email: string, password: string, userData: Record<string, unknown>) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });
    
    if (error) throw error;
    return data;
  }

  async signInWithSupabase(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  async signOutWithSupabase() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Products
  async getProductsFromSupabase(queryParams: Record<string, any> = {}) {
    let query = this.supabase
      .from('products')
      .select(`
        *,
        categories (*),
        brands (*)
      `);
    
    // Apply filters
    if (queryParams.category) {
      query = query.eq('categoryId', queryParams.category);
    }
    
    if (queryParams.brand) {
      query = query.eq('brandId', queryParams.brand);
    }
    
    if (queryParams.search) {
      query = query.ilike('name', `%${queryParams.search}%`);
    }
    
    if (queryParams.featured === true) {
      query = query.eq('isFeatured', true);
    }
    
    if (queryParams.newArrival === true) {
      query = query.eq('isNewArrival', true);
    }
    
    if (queryParams.bestSeller === true) {
      query = query.eq('isBestSeller', true);
    }
    
    if (queryParams.onSale === true) {
      query = query.eq('isOnSale', true);
    }
    
    // Apply sorting
    if (queryParams.sort) {
      query = query.order(queryParams.sort, { ascending: queryParams.order === 'asc' });
    } else {
      query = query.order('id', { ascending: false });
    }
    
    // Apply pagination
    if (queryParams.page && queryParams.limit) {
      const from = (queryParams.page - 1) * queryParams.limit;
      const to = queryParams.page * queryParams.limit - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    return { data, count };
  }

  async getProductFromSupabase(idOrSlug: string | number) {
    // Check if idOrSlug is a number (ID) or string (slug)
    const isId = !isNaN(Number(idOrSlug));
    
    let query = this.supabase
      .from('products')
      .select(`
        *,
        categories (*),
        brands (*)
      `);
      
    if (isId) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }
    
    const { data, error } = await query.single();
    
    if (error) throw error;
    return data;
  }

  // Categories
  async getCategoriesFromSupabase() {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*');
      
    if (error) throw error;
    return data;
  }

  async getCategoryHierarchyFromSupabase() {
    // First, get all root categories (parent_id is null)
    const { data: rootCategories, error: rootError } = await this.supabase
      .from('categories')
      .select('*')
      .is('parent_id', null);
      
    if (rootError) throw rootError;
    
    // For each root category, get its children
    const hierarchy = await Promise.all(rootCategories.map(async (rootCategory) => {
      const { data: children, error: childrenError } = await this.supabase
        .from('categories')
        .select('*')
        .eq('parent_id', rootCategory.id);
        
      if (childrenError) throw childrenError;
      
      return {
        ...rootCategory,
        children
      };
    }));
    
    return hierarchy;
  }

  // Cart
  async getCartFromSupabase() {
    // Get the current user's cart
    const { data: { session } } = await this.supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Get or create cart
    let { data: cart, error: cartError } = await this.supabase
      .from('carts')
      .select('*')
      .eq('userId', session.user.id)
      .single();
      
    if (cartError) {
      // Create a new cart if one doesn't exist
      const { data: newCart, error } = await this.supabase
        .from('carts')
        .insert({
          userId: session.user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      cart = newCart;
    }
    
    // Get cart items
    const { data: cartItems, error: itemsError } = await this.supabase
      .from('cartitems')
      .select(`
        *,
        products (*)
      `)
      .eq('cartId', cart.id);
      
    if (itemsError) throw itemsError;
    
    return {
      ...cart,
      items: cartItems
    };
  }

  async addToCartSupabase(productId: number, quantity: number = 1) {
    const { data: { session } } = await this.supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Get or create cart
    let { data: cart, error: cartError } = await this.supabase
      .from('carts')
      .select('*')
      .eq('userId', session.user.id)
      .single();
      
    if (cartError) {
      // Create a new cart if one doesn't exist
      const { data: newCart, error } = await this.supabase
        .from('carts')
        .insert({
          userId: session.user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      cart = newCart;
    }
    
    // Get the product
    const { data: product, error: productError } = await this.supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single();
      
    if (productError) throw productError;
    
    // Check if item already exists in cart
    const { data: existingItem, error: itemError } = await this.supabase
      .from('cartitems')
      .select('*')
      .eq('cartId', cart.id)
      .eq('productId', productId)
      .single();
      
    if (!itemError && existingItem) {
      // Update existing item
      const { data, error } = await this.supabase
        .from('cartitems')
        .update({
          quantity: existingItem.quantity + quantity
        })
        .eq('id', existingItem.id)
        .select();
        
      if (error) throw error;
      return data[0];
    } else {
      // Add new item
      const { data, error } = await this.supabase
        .from('cartitems')
        .insert({
          cartId: cart.id,
          productId,
          quantity,
          price: product.price
        })
        .select();
        
      if (error) throw error;
      return data[0];
    }
  }
}
