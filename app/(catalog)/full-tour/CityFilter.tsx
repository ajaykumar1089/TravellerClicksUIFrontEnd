// 'use client'
 import { apiClient, Fulltour, FilterOptionsFullTour } from '../../../lib/api-client'

 const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { Search } from '@mui/icons-material'

interface City {
  id: number
  name: string
  state?: string
}

interface CityFilterProps {
  filters: { cities?: number[] }
  handleFilterChange: (key: string, value: number[]) => void
}

export default function CityFilter({ filters, handleFilterChange }: CityFilterProps) {
  const [search, setSearch] = useState('')
  const [cityOptions, setCityOptions] = useState<City[]>([])

  // 🔍 Fetch city suggestions from Django API
  useEffect(() => {
    const fetchCities = async () => {
      if (search.length < 2) {
        setCityOptions([])
        return
      }
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/fulltours/cities/autocomplete/?q=${search}`
        )
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setCityOptions(data)
      } catch (err) {
        console.error('Error fetching cities:', err)
      }
    }

    const debounce = setTimeout(fetchCities, 300)
    return () => clearTimeout(debounce)
  }, [search])

  // ✅ Toggle city selection
  const handleToggleCity = (cityId: number) => {
    const selected = filters.cities || []
    if (selected.includes(cityId)) {
      handleFilterChange(
        'cities',
        selected.filter((id) => id !== cityId)
      )
    } else {
      handleFilterChange('cities', [...selected, cityId])
    }
  }

  return (
    <Box sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
      <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.300' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Cities
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          size="small"
          placeholder="Search Cities"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

        <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
          <FormGroup>
            {cityOptions.map((city) => (
              <FormControlLabel
                key={city.id}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.cities?.includes(city.id) || false}
                    onChange={() => handleToggleCity(city.id)}
                  />
                }
                label={
                  <Typography variant="body2">
                    {city.name}
                    {city.state ? `, ${city.state}` : ''}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </Box>
      </Box>
    </Box>
  )
}
