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
import { Fulltourdetails } from '../../lib/api-client'

interface FulltourdetailsCardProps {
  fulltourdetails: Fulltourdetails
}

const FulltourdetailsCard: React.FC<FulltourdetailsCardProps> = ({ fulltourdetails }) => {
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
    if (fulltourdetails.primary_image) {
      return `http://127.0.0.1:8000${fulltourdetails.primary_image}`
    }
    if (fulltourdetails.all_images && fulltourdetails.all_images.length > 0) {
      return `http://127.0.0.1:8000${fulltourdetails.all_images[0]}`
    }
    return '/images/fulltourdetails/fulltourdetails-placeholder.svg'
  }

  return (
    <Link href={`/fulltour-details/`}>
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
        {!fulltourdetails.available && (
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

        {/* fulltourdetails Image */}
        <CardMedia
          component="img"
          height="200"
          image={getImageSrc()}
          alt={fulltourdetails.title}
          sx={{
            objectFit: 'cover',
            bgcolor: 'grey.100',
          }}
        />

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Brand & Title */}
          {/* <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {fulltourdetails.city.name}
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
              {fulltourdetails.title}
            </Typography>
          </Box> */}

        



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
            Provided by {fulltourdetails.service_provider.firm_name}
          </Typography>
        </Box>
      </Card>
    </Link>
  )
}

export default FulltourdetailsCard