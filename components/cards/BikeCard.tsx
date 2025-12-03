'use client'

import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Rating,
  IconButton,
} from '@mui/material'
import {
  LocalGasStation,
  Settings,
  Favorite,
  FavoriteBorder,
  AccessTime,
  LocationOn,
  Security,
} from '@mui/icons-material'
import Link from 'next/link'
import { Bike } from '../../lib/api-client'

interface BikeCardProps {
  bike: Bike
}

const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
  const [isFavorite, setIsFavorite] = React.useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numPrice)
  }

  const getImageSrc = () => {
    if (bike.primary_image) {
      return `http://127.0.0.1:8000${bike.primary_image}`
    }
    if (bike.all_images && bike.all_images.length > 0) {
      return `http://127.0.0.1:8000${bike.all_images[0]}`
    }
    return '/images/bikes/bike-placeholder.svg'
  }

  return (
    <Link href={`/bike-rentals/${bike.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            borderColor: 'primary.main',
          },
        }}
      >
        {/* Favorite Button */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          {isFavorite ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>

        {/* Availability Status */}
        {!bike.available && (
          <Chip
            label="Not Available"
            size="small"
            color="error"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
              bgcolor: 'rgba(211, 47, 47, 0.9)',
              color: 'white',
              fontWeight: 500,
            }}
          />
        )}

        {/* Bike Image */}
        <CardMedia
          component="img"
          height="200"
          image={getImageSrc()}
          alt={bike.title}
          sx={{
            objectFit: 'cover',
            bgcolor: 'grey.100',
          }}
        />

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Brand & Title */}
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {bike.brand.name}
            </Typography>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
                mb: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {bike.title}
            </Typography>
          </Box>

          {/* Rating & Reviews */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Rating
              value={parseFloat(bike.rating)}
              precision={0.1}
              size="small"
              readOnly
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {bike.rating} ({bike.total_trips} trips)
            </Typography>
          </Box>

          {/* Location & Operating Hours */}
          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {bike.city.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {bike.operating_hours}
              </Typography>
            </Box>
          </Box>

          {/* Specifications */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Settings />}
              label={bike.transmission.type}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
            <Chip
              icon={<LocalGasStation />}
              label={bike.fuel_type.type}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
            <Chip
              label={bike.engine_capacity}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>

          {/* Pricing */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.5 }}>
              <Typography
                variant="h5"
                component="span"
                sx={{ fontWeight: 700, color: 'primary.main' }}
              >
                {formatPrice(bike.price_per_day)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                /day
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                Safety Deposit: {formatPrice(bike.safety_deposit)}
              </Typography>
            </Box>
          </Box>

          {/* Action Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: 'primary.main',
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Book Now
          </Button>
        </CardContent>

        {/* Service Provider Info */}
        <Box
          sx={{
            px: 2,
            pb: 1.5,
            pt: 0,
            borderTop: '1px solid',
            borderColor: 'grey.100',
            bgcolor: 'grey.50',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Provided by {bike.service_provider.firm_name}
          </Typography>
        </Box>
      </Card>
    </Link>
  )
}

export default BikeCard