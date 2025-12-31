const API_BASE_URL ='https://backend-82om.onrender.com/api' //process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      const data = await response.json()

      return {
        data,
        status: response.status,
        message: response.statusText,
      }
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)
      throw new Error(`Failed to fetch from ${endpoint}`)
    }
  }
/////////////userstories///////////////////////
  async getUserstories(params?: {
    city?: string    
    page?: number
    page_size?: number
  }) {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/stories/?${queryParams.toString()}`
    return this.makeRequest<UserstoriesListResponse>(endpoint)
  }

//////////////////////////////////
  // Bikes API
  async getBikes(params?: {
    city?: string
    brand?: string
    fuel_type?: string
    transmission?: string
    price_min?: number
    price_max?: number
    page?: number
    page_size?: number
  }) {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/bikes/?${queryParams.toString()}`
    return this.makeRequest<BikeListResponse>(endpoint)
  }

  async getBike(id: string) {
    return this.makeRequest<Bike>(`/bikes/${id}/`)
  }

 

  // Filter options API
  async getBikeCities() {
    return this.makeRequest<City[]>('/bikes/cities/')
  }

  async getBikeBrands() {
    return this.makeRequest<Brand[]>('/bikes/brands/')
  }

  async getBikeFuelTypes() {
    return this.makeRequest<FuelType[]>('/bikes/fuel-types/')
  }

  async getBikeTransmissions() {
    return this.makeRequest<Transmission[]>('/bikes/transmissions/')
  }

  // Fulltours API
  async getFulltours(params?: {
    city?: string    
    price_min?: number
    price_max?: number
    page?: number
    page_size?: number
  }) {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }
    const endpoint = `/fulltours/?${queryParams.toString()}`
    return this.makeRequest<FulltourListResponse>(endpoint)
  }

    // Holiday Package API
  async getHolidaypackages(params?: {
    city?: string    
    price_min?: number
    price_max?: number
    page?: number
    page_size?: number
  }) {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }
    const endpoint = `/holidaypackages/?${queryParams.toString()}`
    return this.makeRequest<FulltourListResponse>(endpoint)
  }

  async getFulltour(id: string) {
    return this.makeRequest<Fulltour>(`/Holidaypackages/${id}/`)
  }

  // Filter options API
  async getFulltourCities() {
    return this.makeRequest<City[]>('/Holidaypackages/cities/')
  }
}

// Types for API responses// Types for API responses
export interface Bike {
  id: number
  title: string
  model: string
  description: string
  brand: Brand
  city: City
  fuel_type: FuelType
  transmission: Transmission
  rental_type: RentalType
  model_year: ModelYear
  price_per_hour: string
  price_per_day: string
  price_per_week?: string
  price_per_month?: string
  engine_capacity: string
  mileage: string
  safety_deposit: string
  operating_hours: string
  documents_required: string
  terms_and_conditions: string
  rating: string
  total_trips: number
  available: boolean
  service_provider: ServiceProvider
  primary_image?: string
  all_images: string[]
  created_at: string
  updated_at: string
}

export interface Userstories {
  id: number
  title: string
  model: string
  description: string
  city: City
  rating: string
  available: boolean
  primary_image?: string
  all_images: string[]
  created_at: string
  updated_at: string
}

export interface City {
  id: number
  name: string
  state: string
  country: string
}

export interface Brand {
  id: number
  name: string
}

export interface FuelType {
  id: number
  type: string
}

export interface Transmission {
  id: number
  type: string
}

export interface RentalType {
  id: number
  type: string
}

export interface ModelYear {
  id: number
  year: number
}

export interface ServiceProvider {
  id: number
  email: string
  firm_name: string
  phone_number: string
}

export interface BikeListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Bike[]
}

export interface UserstoriesListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Bike[]
}

export interface Fulltour {
  id: number
  title: string
  model: string
  description: string
  brand: Brand
  city: City
  fuel_type: FuelType
  transmission: Transmission
  rental_type: RentalType
  model_year: ModelYear
  price_per_hour: string
  price_per_day: string
  price_per_person: string
  price_per_week?: string
  price_per_month?: string
  engine_capacity: string
  mileage: string
  safety_deposit: string
  operating_hours: string
  documents_required: string
  terms_and_conditions: string
  rating: string
  total_trips: number
  available: boolean
  service_provider: ServiceProvider
  primary_image?: string
  all_images: string[]
  created_at: string
  updated_at: string
}

export interface Holidaypackage {
  id: number
  title: string
  model: string
  description: string
  brand: Brand
  city: City
  city_name: string
  fuel_type: FuelType
  transmission: Transmission
  rental_type: RentalType
  model_year: ModelYear
  price_per_hour: string
  price_per_day: string
  price_per_person: string
  price_per_week?: string
  price_per_month?: string
  engine_capacity: string
  mileage: string
  safety_deposit: string
  operating_hours: string
  documents_required: string
  terms_and_conditions: string
  rating: string
  total_trips: number
  available: boolean
  service_provider: ServiceProvider
  primary_image?: string
  all_images: string[]
  created_at: string
  updated_at: string
}

export interface Fulltourdetails {
  id: number
  title: string
  model: string
  description: string
  brand: Brand
  city: City
  fuel_type: FuelType
  transmission: Transmission
  rental_type: RentalType
  model_year: ModelYear
  price_per_hour: string
  price_per_day: string
  price_per_person: string
  price_per_week?: string
  price_per_month?: string
  engine_capacity: string
  mileage: string
  safety_deposit: string
  operating_hours: string
  documents_required: string
  terms_and_conditions: string
  rating: string
  total_trips: number
  available: boolean
  service_provider: ServiceProvider
  primary_image?: string
  all_images: string[]
  created_at: string
  updated_at: string
}

export interface Holidaypackagedetails {
  id: number
  title: string
  model: string
  description: string
  brand: Brand
  city: City
  fuel_type: FuelType
  transmission: Transmission
  rental_type: RentalType
  model_year: ModelYear
  price_per_hour: string
  price_per_day: string
  price_per_person: string
  price_per_week?: string
  price_per_month?: string
  engine_capacity: string
  mileage: string
  safety_deposit: string
  operating_hours: string
  documents_required: string
  terms_and_conditions: string
  rating: string
  total_trips: number
  available: boolean
  service_provider: ServiceProvider
  primary_image?: string
  all_images: string[]
  created_at: string
  updated_at: string
}

export interface City {
  id: number
  name: string
  state: string
  country: string
}

export interface Brand {
  id: number
  name: string
}

export interface FuelType {
  id: number
  type: string
}

export interface Transmission {
  id: number
  type: string
}

export interface RentalType {
  id: number
  type: string
}

export interface ModelYear {
  id: number
  year: number
}

export interface ServiceProvider {
  id: number
  email: string
  firm_name: string
  phone_number: string
}

export interface FulltourListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Fulltour[]
}


export interface FilterOptions {
  cities: City[]
  brands: Brand[]
  fuelTypes: FuelType[]
  transmissions: Transmission[]
}
export interface FilterOptionsFullTour {
  cities: City[]  
}

// Create singleton instance
export const apiClient = new ApiClient()

export default apiClient