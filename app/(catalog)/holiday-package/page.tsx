'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Radio,
  RadioGroup,
  InputAdornment,
  Collapse,
  IconButton,
} from '@mui/material'
import {
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  Search,
  LocationOn,
  CalendarToday,
} from '@mui/icons-material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import Link from 'next/link'
import HolidaypackageCard from '../../../components/cards/HolidayPackageCard'

import { apiClient, Holidaypackage, FilterOptionsFullTour } from '../../../lib/api-client'
import CityFilter from './CityFilter'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useRouter } from 'next/navigation'
import 'leaflet/dist/leaflet.css'

interface Filters {
  cities?: any[]
  city?: string
  from_date?: Dayjs | null
  to_date?: Dayjs | null
  pickup_locations?: string[]
  price_min?: string
  price_max?: string
}

const blueIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
})

// ðŸŒ Static Data
const destinations = [
  {
    id: 1,
    city: 'Paris',
    country: 'France',
    lat: 48.8566,
    lng: 2.3522,
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    image:
      'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    city: 'New York',
    country: 'USA',
    lat: 40.7128,
    lng: -74.006,
    image:
      'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    city: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    image:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d4?auto=format&fit=crop&w=800&q=80',
  },
]

export default function DestinationsPage() {

  const [holidaypackages, setHolidaypackages] = useState<Holidaypackage[]>([])
  const [filterOptionsfullTour, setFilterOptionsFullTour] = useState<FilterOptionsFullTour | null>(null)
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Filter state based on your reference
  const [filters, setFilters] = useState<Filters>({})

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedCity, setSelectedCity] = useState('All')
  const router = useRouter()

  // Filter destinations based on dropdown
  const filteredDestinations =
    selectedCity === 'All'
      ? destinations
      : destinations.filter((d) => d.city === selectedCity)


  // UI state for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    datetime: true,
    pickup: false,
    price: true,
  })

  const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000])
  const [searchTerms, setSearchTerms] = useState({
    pickup: '',
    cities: '',
  })

  // Fetch holidaypackages d5ata
  const fetchHolidaypackages = async (page = 1) => {
    try {
      setLoading(true)

      // Prepare filter parameters with proper type conversion
      const filterParams: any = {
        page,
        page_size: 12,
      }

      //Add filters only if they have values
      if (filters.city)
      filterParams.city = filters.city


      // Use priceRange state for accurate price filtering
      if (priceRange[0] > 100) filterParams.price_min = priceRange[0]
      if (priceRange[1] < 10000) filterParams.price_max = priceRange[1]

      const response = await apiClient.getHolidaypackages(filterParams)

      if (response.status === 200) {
        setHolidaypackages(
          response.data.results.map((item: any) => ({
            ...item,
            city_name: item.city_name ?? item.city?.name ?? '', // fallback if city_name missing
          }))
        )
        setTotalCount(response.data.count)
        setTotalPages(Math.ceil(response.data.count / 12))
        setCurrentPage(page)
      } else {
        setError('Failed to fetch holidaypackages')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Error fetching holidaypackages:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch filter options
  const fetchFilterOptionsFullTour = async () => {
    try {
      setFiltersLoading(true)
      console.log('Starting to fetch filter options...')

      const [citiesResponse] = await Promise.all([
        fetch('https://backend-82om.onrender.com/api/holidaypackages/cities/'),
      ])

      console.log('API Responses received:')
      console.log('Cities response:', citiesResponse.ok, citiesResponse.status)

      const [cities] = await Promise.all([
        citiesResponse.json(),

      ])

      console.log('Filter data loaded:')
      console.log('Cities:', cities, 'Length:', cities?.length)


      setFilterOptionsFullTour({
        cities: cities || [],
      })
      setFiltersLoading(false)
    } catch (err) {
      console.error('Error fetching filter options:', err)
      setFiltersLoading(false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  // Handle multi-select filters (like pickup locations)
  // const handleMultiSelectFilter = (key: string, value: string) => {
  //   setFilters(prev => {
  //     const currentValues = prev[key as keyof typeof prev] as string[]
  //     const newValues = currentValues.includes(value)
  //       ? currentValues.filter(v => v !== value)
  //       : [...currentValues, value]

  //     return {
  //       ...prev,
  //       [key]: newValues,
  //     }
  //   })
  // }



  // Handle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchHolidaypackages(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  // Get pickup locations from cities (mock data - you can enhance this)
  const getPickupLocations = () => {
    if (!filters.city || !filterOptionsfullTour || !Array.isArray(filterOptionsfullTour.cities)) return []
    const selectedCity = filterOptionsfullTour.cities.find(c => c.id.toString() === filters.city)
    if (!selectedCity) return []

    // Mock pickup locations based on city
    const mockLocations = [
      `${selectedCity.name} Central`,
      `${selectedCity.name} East`,
      `${selectedCity.name} West`,
      `${selectedCity.name} North`,
      `${selectedCity.name} Airport`,
    ]
    return mockLocations.filter(loc =>
      loc.toLowerCase().includes(searchTerms.pickup.toLowerCase())
    )
  }

  // Handle price range change
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[]
    setPriceRange([min, max])
    setFilters(prev => ({
      ...prev,
      price_min: min.toString(),
      price_max: max.toString(),
    }))
  }

  // Initial data fetch
  useEffect(() => {
    // fetchFilterOptionsFullTour()
  }, [])

  // Fetch holidaypackages when filters change
  useEffect(() => {
    // if (filterOptionsfullTour) 
    {
      fetchHolidaypackages(1)
    }
  }, [filters, filterOptionsfullTour, priceRange])



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Left Sidebar - Filters */}
        <Paper
          elevation={1}
          sx={{
            width: 280,
            minWidth: 280,
            height: '100vh',
            overflow: 'auto',
            position: 'sticky',
            top: 0,
            borderRadius: 0,
            borderRight: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'grey.50',
          }}
        >
          {/* Select Holidaypackage Header */}
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Select Holidaypackage
            </Typography>
          </Box>

          {/* Filter Content */}
          <Box sx={{ p: 2 }}>
            <Stack spacing={3}>


              {/* City Selection */}
              <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '0vh' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Filter by City
                </Typography>

                {/* <CityFilter filters={filters} handleFilterChange={handleFilterChange} /> */}

                <Divider sx={{ my: 3 }} />

                {/* <Typography variant="body1" sx={{ mt: 2 }}>
                  Selected Filters:
                </Typography>
                <pre style={{ background: '#fff', padding: '1rem', borderRadius: '8px' }}>
                  {JSON.stringify(filters, null, 2)}
                </pre> */}
              </Box>
              <Divider />

              {/* Date & Time */}
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSection('datetime')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      From Date & Time
                    </Typography>
                  </Box>
                  {expandedSections.datetime ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Collapse in={expandedSections.datetime}>
                  <Stack spacing={2}>
                    <DateTimePicker
                      label="From Date & Time"
                      value={filters.from_date}
                      onChange={(newValue) => handleFilterChange('from_date', newValue)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                        },
                      }}
                    />
                    <DateTimePicker
                      label="To Date & Time"
                      value={filters.to_date}
                      onChange={(newValue) => handleFilterChange('to_date', newValue)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                        },
                      }}
                    />
                  </Stack>
                </Collapse>
              </Box>

              <Divider />

              {/* Pickup Locations */}
              {filters.city && (
                <>
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleSection('pickup')}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Pickup Locations
                      </Typography>
                      {expandedSections.pickup ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                    <Collapse in={expandedSections.pickup}>
                      <Stack spacing={1}>
                        <TextField
                          size="small"
                          placeholder="Search locations..."
                          value={searchTerms.pickup}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, pickup: e.target.value }))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormGroup sx={{ maxHeight: 150, overflow: 'auto' }}>
                          {getPickupLocations().map((location) => (
                            <FormControlLabel
                              key={location}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.pickup_locations.includes(location)}
                                  
                                />
                              }
                              label={<Typography variant="body2">{location}</Typography>}
                              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                            />
                          ))}
                        </FormGroup>
                      </Stack>
                    </Collapse>
                  </Box>
                  <Divider />
                </>
              )}



              <Divider />



              <Divider />

              {/* Price Range */}
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSection('price')}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Price Range (per day)
                  </Typography>
                  {expandedSections.price ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Collapse in={expandedSections.price}>
                  <Stack spacing={2}>
                    <Slider
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      valueLabelDisplay="auto"
                      min={100}
                      max={10000}
                      step={100}
                      valueLabelFormat={(value) => `$${value}`}
                      sx={{ mx: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        ${priceRange[0]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${priceRange[1]}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {[
                        { label: 'Under $500', range: [100, 500] },
                        { label: '$500-$1000', range: [500, 1000] },
                        { label: '$1000-$2000', range: [1000, 2000] },
                        { label: 'Above $2000', range: [2000, 10000] },
                      ].map((preset) => (
                        <Chip
                          key={preset.label}
                          label={preset.label}
                          size="small"
                          variant={
                            priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                              ? 'filled'
                              : 'outlined'
                          }
                          color={
                            priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() => handlePriceRangeChange({} as Event, preset.range)}
                          sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Collapse>
              </Box>

              <Divider />
            </Stack>
          </Box>
        </Paper>


        {/* Right Content Area */}
        <Box sx={{ flex: 1, p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {totalCount} Holiday Packages Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover the perfect spiritual tour for your journey
            </Typography>
          </Box>

          <div className="p-6 space-y-4">

            {/* View Toggle */}
            <div className="flex gap-3 mb-4">
              <button
                className={`px-4 py-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
              <button
                className={`px-4 py-2 rounded-md ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => setViewMode('map')}
              >
                Map View
              </button>

            
            </div>

            {/* List View */}
            {viewMode === 'list' && (
<>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 3
                }}
              >
                {holidaypackages.map((holidaypackage) => (
                  <HolidaypackageCard key={holidaypackage.id} holidaypackage={holidaypackage}  />
                ))}
              </Box>
                  {
                    totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="w-full h-[600px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {filteredDestinations.map((dest) => (
                    <Marker key={dest.id} position={[dest.lat, dest.lng]} icon={blueIcon}>
                      <Popup autoClose={false} closeOnClick={false}>
                        <div
                          style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/holidaydestinationdetails/${dest.id}`)
                          }}
                        >
                          <img
                            src={dest.image}
                            alt={dest.city}
                            style={{
                              width: '150px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              transition: 'transform 0.2s ease',
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = 'scale(1.05)')
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = 'scale(1)')
                            }
                          />
                          <p
                            style={{
                              margin: '6px 0',
                              fontWeight: 'bold',
                              fontSize: '14px',
                            }}
                          >
                            {dest.city}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </LocalizationProvider>

  )
}
