'use client'

import React from 'react'
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Chip,
  Stack,
} from '@mui/material'
import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material'
import { FilterOptions } from '../../lib/api-client'

interface FilterSidebarProps {
  options: FilterOptions
  filters: {
    city: string
    brand: string
    fuel_type: string
    transmission: string
    price_min: string
    price_max: string
  }
  onFilterChange: (filters: any) => void
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  options,
  filters,
  onFilterChange,
}) => {
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    }
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      city: '',
      brand: '',
      fuel_type: '',
      transmission: '',
      price_min: '',
      price_max: '',
    }
    onFilterChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{ minWidth: 'auto', height: 20, fontSize: '0.75rem' }}
            />
          )}
        </Box>
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            onClick={clearAllFilters}
            startIcon={<ClearIcon />}
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Stack spacing={3}>
        {/* City Filter */}
        <FormControl fullWidth size="small">
          <InputLabel>City</InputLabel>
          <Select
            value={filters.city}
            label="City"
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <MenuItem value="">All Cities</MenuItem>
            {options.cities.map((city) => (
              <MenuItem key={city.id} value={city.id.toString()}>
                {city.name}, {city.state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Brand Filter */}
        <FormControl fullWidth size="small">
          <InputLabel>Brand</InputLabel>
          <Select
            value={filters.brand}
            label="Brand"
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <MenuItem value="">All Brands</MenuItem>
            {options.brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Fuel Type Filter */}
        <FormControl fullWidth size="small">
          <InputLabel>Fuel Type</InputLabel>
          <Select
            value={filters.fuel_type}
            label="Fuel Type"
            onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
          >
            <MenuItem value="">All Fuel Types</MenuItem>
            {options.fuelTypes.map((fuelType) => (
              <MenuItem key={fuelType.id} value={fuelType.id.toString()}>
                {fuelType.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Transmission Filter */}
        <FormControl fullWidth size="small">
          <InputLabel>Transmission</InputLabel>
          <Select
            value={filters.transmission}
            label="Transmission"
            onChange={(e) => handleFilterChange('transmission', e.target.value)}
          >
            <MenuItem value="">All Transmissions</MenuItem>
            {options.transmissions.map((transmission) => (
              <MenuItem key={transmission.id} value={transmission.id.toString()}>
                {transmission.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Price Range */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Price Range (per day)
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              label="Min Price"
              type="number"
              value={filters.price_min}
              onChange={(e) => handleFilterChange('price_min', e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
              }}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              label="Max Price"
              type="number"
              value={filters.price_max}
              onChange={(e) => handleFilterChange('price_max', e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
              }}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Box>

        <Divider />

        {/* Popular Price Ranges */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Popular Ranges
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {[
              { label: 'Under ₹500', min: '', max: '500' },
              { label: '₹500 - ₹1000', min: '500', max: '1000' },
              { label: '₹1000 - ₹2000', min: '1000', max: '2000' },
              { label: 'Above ₹2000', min: '2000', max: '' },
            ].map((range) => (
              <Chip
                key={range.label}
                label={range.label}
                size="small"
                variant={
                  filters.price_min === range.min && filters.price_max === range.max
                    ? 'filled'
                    : 'outlined'
                }
                color={
                  filters.price_min === range.min && filters.price_max === range.max
                    ? 'primary'
                    : 'default'
                }
                onClick={() => {
                  handleFilterChange('price_min', range.min)
                  handleFilterChange('price_max', range.max)
                }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.50',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Help Text */}
        <Box sx={{ pt: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ 
              lineHeight: 1.4,
              display: 'block',
              textAlign: 'center',
            }}
          >
            💡 Tip: Use filters to find bikes that match your specific needs and budget
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

export default FilterSidebar