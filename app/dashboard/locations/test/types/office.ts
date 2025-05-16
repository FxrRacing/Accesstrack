export interface Door {
    id: string
    name: string
    type: string
    accessLevel: string
    floor: string
    department: string
    status: string
  }
  
  export interface Office {
    id: number
    name: string
    type: string
    address: string
    city: string
    country: string
    coordinates: {
      latitude: string
      longitude: string
    }
    employees: number
    hours: string
    phone: string
    email: string
    amenities: string[]
    doors: Door[]
  }
  