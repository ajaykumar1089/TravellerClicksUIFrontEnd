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
import BikeCard from '../../../components/cards/BikeCard'
import { apiClient, Bike, FilterOptions } from '../../../lib/api-client'

const BikeRentalsPage = () => {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Filter state based on your reference
  const [filters, setFilters] = useState({
    city: '',
    brand: '',
    fuel_type: '',
    transmission: [] as string[], // Changed to array for checkboxes
    price_min: '',
    price_max: '',
    from_date: null as Dayjs | null,
    to_date: null as Dayjs | null,
    pickup_locations: [] as string[],
    sort_by: 'rating',
  })

  // UI state for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    datetime: true,
    pickup: false,
    transmission: true,
    fuel: true,
    price: true,
    brands: false,
  })

  const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000])
  const [searchTerms, setSearchTerms] = useState({
    brands: '',
    pickup: '',
    fuelTypes: '',
    transmissions: '',
    cities: '',
  })

  // Fetch bikes data
  const fetchBikes = async (page = 1) => {
    try {
      setLoading(true)
      
      // Prepare filter parameters with proper type conversion
      const filterParams: any = {
        page,
        page_size: 12,
      }
      
      // Add filters only if they have values
      if (filters.city) filterParams.city = filters.city
      if (filters.brand) filterParams.brand = filters.brand
      if (filters.fuel_type) filterParams.fuel_type = filters.fuel_type
      if (filters.transmission.length > 0) {
        // Send multiple transmission values to backend
        if (filters.transmission.length === 1) {
          filterParams.transmission = filters.transmission[0]
        } else {
          // For multiple selections, send as array (backend should handle this)
          filterParams.transmission__in = filters.transmission.join(',')
        }
      }
      
      // Use priceRange state for accurate price filtering
      if (priceRange[0] > 100) filterParams.price_min = priceRange[0]
      if (priceRange[1] < 10000) filterParams.price_max = priceRange[1]
      
      const response = await apiClient.getBikes(filterParams)

      if (response.status === 200) {
        setBikes(response.data.results)
        setTotalCount(response.data.count)
        setTotalPages(Math.ceil(response.data.count / 12))
        setCurrentPage(page)
      } else {
        setError('Failed to fetch bikes')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Error fetching bikes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      setFiltersLoading(true)
      console.log('Starting to fetch filter options...')
      
      const [citiesResponse, brandsResponse, fuelTypesResponse, transmissionsResponse] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/bikes/cities/'),
        fetch('http://127.0.0.1:8000/api/bikes/brands/'),
        fetch('http://127.0.0.1:8000/api/bikes/fuel-types/'),
        fetch('http://127.0.0.1:8000/api/bikes/transmissions/'),
      ])

      console.log('API Responses received:')
      console.log('Cities response:', citiesResponse.ok, citiesResponse.status)
      console.log('Brands response:', brandsResponse.ok, brandsResponse.status)
      console.log('Fuel types response:', fuelTypesResponse.ok, fuelTypesResponse.status)
      console.log('Transmissions response:', transmissionsResponse.ok, transmissionsResponse.status)

      const [cities, brands, fuelTypes, transmissions] = await Promise.all([
        citiesResponse.json(),
        brandsResponse.json(),
        fuelTypesResponse.json(),
        transmissionsResponse.json(),
      ])

      console.log('Filter data loaded:')
      console.log('Cities:', cities, 'Length:', cities?.length)
      console.log('Brands:', brands, 'Length:', brands?.length)
      console.log('Fuel Types:', fuelTypes, 'Length:', fuelTypes?.length)
      console.log('Transmissions:', transmissions, 'Length:', transmissions?.length)

      setFilterOptions({
        cities: cities || [],
        brands: brands || [],
        fuelTypes: fuelTypes || [],
        transmissions: transmissions || [],
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
  const handleMultiSelectFilter = (key: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[key as keyof typeof prev] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [key]: newValues,
      }
    })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      city: '',
      brand: '',
      fuel_type: '',
      transmission: [], // Fixed to empty array
      price_min: '',
      price_max: '',
      from_date: null,
      to_date: null,
      pickup_locations: [],
      sort_by: 'rating',
    })
    setPriceRange([100, 10000])
    setSearchTerms({ brands: '', pickup: '', fuelTypes: '', transmissions: '', cities: '' })
  }

  // Handle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchBikes(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.city) count++
    if (filters.brand) count++
    if (filters.fuel_type) count++
    if (filters.transmission) count++
    if (filters.price_min || filters.price_max) count++
    if (filters.from_date || filters.to_date) count++
    if (filters.pickup_locations.length > 0) count++
    return count
  }

  // Filter brands based on search
  const getFilteredBrands = () => {
    if (!filterOptions || !Array.isArray(filterOptions.brands)) return []
    return filterOptions.brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerms.brands.toLowerCase())
    )
  }

  // Get pickup locations from cities (mock data - you can enhance this)
  const getPickupLocations = () => {
    if (!filters.city || !filterOptions || !Array.isArray(filterOptions.cities)) return []
    const selectedCity = filterOptions.cities.find(c => c.id.toString() === filters.city)
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
    fetchFilterOptions()
  }, [])

  // Fetch bikes when filters change
  useEffect(() => {
    if (filterOptions) {
      fetchBikes(1)
    }
  }, [filters, filterOptions, priceRange])

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
          {/* Select Bike Header */}
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Select Bike
            </Typography>
          </Box>

          {/* Filter Content */}
          <Box sx={{ p: 2 }}>
            <Stack spacing={3}>
              {/* Brand Filter */}
              <Box sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.300' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Brand
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search Brands"
                    value={searchTerms.brands}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, brands: e.target.value }))}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Box 
                    sx={{ 
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    {/* Debug Info */}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Filters Loading: {filtersLoading ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      FilterOptions: {filterOptions ? 'Loaded' : 'Not loaded'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Brands available: {filterOptions?.brands?.length || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Search term: "{searchTerms.brands}"
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Filtered brands count: {getFilteredBrands().length}
                    </Typography>
                    
                    <FormGroup>
                      {filtersLoading ? (
                        <Typography variant="body2" color="text.secondary">
                          Loading brands...
                        </Typography>
                      ) : filterOptions?.brands ? (
                        getFilteredBrands().length > 0 ? (
                          getFilteredBrands().map((brand) => (
                            <FormControlLabel
                              key={brand.id}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.brand === brand.id.toString()}
                                  onChange={(e) => handleFilterChange('brand', e.target.checked ? brand.id.toString() : '')}
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  {brand.name}
                                </Typography>
                              }
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No brands found
                          </Typography>
                        )
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No brand data available
                        </Typography>
                      )}
                    </FormGroup>
                  </Box>
                </Box>
              </Box>

              {/* Fuel Type Filter */}
              <Box sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.300' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Fuel Type
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search Fuel Types"
                    value={searchTerms.fuelTypes || ''}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, fuelTypes: e.target.value }))}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Box 
                    sx={{ 
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    <FormGroup>
                      {filterOptions?.fuelTypes && Array.isArray(filterOptions.fuelTypes) && 
                        filterOptions.fuelTypes
                          .filter(fuelType => 
                            !searchTerms.fuelTypes || 
                            fuelType.type.toLowerCase().includes(searchTerms.fuelTypes.toLowerCase())
                          )
                          .map((fuelType) => (
                            <FormControlLabel
                              key={fuelType.id}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.fuel_type === fuelType.id.toString()}
                                  onChange={(e) => handleFilterChange('fuel_type', e.target.checked ? fuelType.id.toString() : '')}
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  {fuelType.type}
                                </Typography>
                              }
                            />
                          ))
                      }
                    </FormGroup>
                  </Box>
                </Box>
              </Box>
              {/* City Selection */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    City
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Select City</MenuItem>
                    {filterOptions?.cities && Array.isArray(filterOptions.cities) && filterOptions.cities.map((city) => (
                      <MenuItem key={city.id} value={city.id.toString()}>
                        {city.name}, {city.state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                                  onChange={() => handleMultiSelectFilter('pickup_locations', location)}
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

              {/* Transmission Type */}
              <Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSection('transmission')}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Transmission Type
                  </Typography>
                  {expandedSections.transmission ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Collapse in={expandedSections.transmission}>
                  <Box 
                    sx={{ 
                      maxHeight: '200px', // Enable scrolling if more than 4 items
                      overflowY: 'auto',
                      pr: 1 // Add padding for scrollbar
                    }}
                  >
                    <FormGroup>
                      {Array.isArray(filterOptions?.transmissions) ? 
                        filterOptions.transmissions.map((transmission) => (
                          <FormControlLabel
                            key={transmission.id}
                            control={
                              <Checkbox
                                size="small"
                                checked={filters.transmission.includes(transmission.id.toString())}
                                onChange={(e) => {
                                  const transmissionId = transmission.id.toString()
                                  const newTransmissions = e.target.checked
                                    ? [...filters.transmission, transmissionId]
                                    : filters.transmission.filter(t => t !== transmissionId)
                                  setFilters(prev => ({
                                    ...prev,
                                    transmission: newTransmissions
                                  }))
                                }}
                              />
                            }
                            label={transmission.type}
                          />
                        )) : (
                          <Typography variant="caption" color="text.secondary">
                            Loading transmissions...
                          </Typography>
                        )
                      }
                    </FormGroup>
                  </Box>
                </Collapse>
              </Box>

              <Divider />

              {/* Fuel Type */}
              <Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSection('fuel')}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Fuel Type
                  </Typography>
                  {expandedSections.fuel ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Collapse in={expandedSections.fuel}>
                  <RadioGroup
                    value={filters.fuel_type}
                    onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                  >
                    <FormControlLabel
                      value=""
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">All Fuel Types</Typography>}
                    />
                    {filterOptions?.fuelTypes && Array.isArray(filterOptions.fuelTypes) && filterOptions.fuelTypes.map((fuelType) => (
                      <FormControlLabel
                        key={fuelType.id}
                        value={fuelType.id.toString()}
                        control={<Radio size="small" />}
                        label={
                          <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                            {fuelType.type}
                          </Typography>
                        }
                      />
                    ))}
                  </RadioGroup>
                </Collapse>
              </Box>

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
                      valueLabelFormat={(value) => `₹${value}`}
                      sx={{ mx: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        ₹{priceRange[0]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{priceRange[1]}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {[
                        { label: 'Under ₹500', range: [100, 500] },
                        { label: '₹500-₹1000', range: [500, 1000] },
                        { label: '₹1000-₹2000', range: [1000, 2000] },
                        { label: 'Above ₹2000', range: [2000, 10000] },
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

              {/* Brands */}
              <Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSection('brands')}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Brands
                  </Typography>
                  {expandedSections.brands ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Collapse in={expandedSections.brands}>
                  <Stack spacing={1}>
                    <TextField
                      size="small"
                      placeholder="Search brands..."
                      value={searchTerms.brands}
                      onChange={(e) => setSearchTerms(prev => ({ ...prev, brands: e.target.value }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormControl fullWidth size="small">
                      <Select
                        value={filters.brand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">All Brands</MenuItem>
                        {getFilteredBrands().map((brand) => (
                          <MenuItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Collapse>
              </Box>

              {/* Transmission Type Filter */}
              <Box sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.300' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Transmission Type
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search Transmission Types"
                    value={searchTerms.transmissions || ''}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, transmissions: e.target.value }))}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Box 
                    sx={{ 
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    <FormGroup>
                      {filterOptions?.transmissions && Array.isArray(filterOptions.transmissions) && 
                        filterOptions.transmissions
                          .filter(transmission => 
                            !searchTerms.transmissions || 
                            transmission.type.toLowerCase().includes(searchTerms.transmissions.toLowerCase())
                          )
                          .map((transmission) => (
                            <FormControlLabel
                              key={transmission.id}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.transmission.includes(transmission.id.toString())}
                                  onChange={(e) => {
                                    const transmissionId = transmission.id.toString()
                                    const newTransmissions = e.target.checked
                                      ? [...filters.transmission, transmissionId]
                                      : filters.transmission.filter(t => t !== transmissionId)
                                    setFilters(prev => ({
                                      ...prev,
                                      transmission: newTransmissions
                                    }))
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  {transmission.type}
                                </Typography>
                              }
                            />
                          ))
                      }
                    </FormGroup>
                  </Box>
                </Box>
              </Box>

              {/* City Filter */}
              <Box sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.300' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    City
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search Cities"
                    value={searchTerms.cities || ''}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, cities: e.target.value }))}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Box 
                    sx={{ 
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    <FormGroup>
                      {filterOptions?.cities && Array.isArray(filterOptions.cities) && 
                        filterOptions.cities
                          .filter(city => 
                            !searchTerms.cities || 
                            city.name.toLowerCase().includes(searchTerms.cities.toLowerCase())
                          )
                          .map((city) => (
                            <FormControlLabel
                              key={city.id}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.city === city.id.toString()}
                                  onChange={(e) => handleFilterChange('city', e.target.checked ? city.id.toString() : '')}
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  {city.name}, {city.state}
                                </Typography>
                              }
                            />
                          ))
                      }
                    </FormGroup>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Right Content Area */}
        <Box sx={{ flex: 1, p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {totalCount} Bikes Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover the perfect bike for your journey
            </Typography>
          </Box>

          {/* Sort Options */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Sort By
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              >
                <MenuItem value="rating">Rating (High to Low)</MenuItem>
                <MenuItem value="price_low">Price (Low to High)</MenuItem>
                <MenuItem value="price_high">Price (High to Low)</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Content */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : bikes.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No bikes found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters to see more results
              </Typography>
            </Box>
          ) : (
            <>
              {/* Bikes Grid */}
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 3
                }}
              >
                {bikes.map((bike) => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
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
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

export default BikeRentalsPage