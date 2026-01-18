'use client'

import React from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material'
import {
  DirectionsBike,
  DirectionsCar,
  RvHookup,
  Hotel,
  Hiking,
  AccountBalance,
  GasMeter,
  TravelExplore,
  TravelExploreTwoTone,
  CardTravel,
  FlightTakeoffTwoTone,
  TempleHindu,
  TerrainSharp,
  TempleBuddhistRounded,
  HolidayVillage,
  HolidayVillageOutlined,
  TourRounded,
  LocalDrink,
  NoteAltRounded,
  LuggageTwoTone,
} from '@mui/icons-material'
import Link from 'next/link'
import { Poor_Story, Story_Script } from 'next/font/google'

const HomePage = () => {
  const services = [
    {
      title: 'Spiritual Tour Packages',
      description: 'Spiritual tour packages around the globe',
      icon: <TempleBuddhistRounded sx={{ fontSize: 40, color: 'secondary.main' }} />,
      href: '/full-tour',
      color: 'secondary.main',
    },
    {
      title: 'Holiday Destinations Tour Packages',
      description: 'Holiday tour packages around the globe',
      icon: <LuggageTwoTone sx={{ fontSize: 40, color: 'secondary.main' }} />,
      href: '/full-tour',
      color: 'secondary.main',
    },
    {
      title: 'Travel Stories',
      description: 'Your sweet travel memories',
      icon: <NoteAltRounded sx={{ fontSize: 40, color: 'secondary.main' }} />,
      href: '/travel-stories',
      color: 'secondary.main',
    },   
  ]

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 🌄 Full-Screen Video Hero Section */}
      <Box sx={{ position: 'relative', height: '100vh', width: '100%' }}>
        {/* Background Video */}

        {/* Using a regular <img> tag */}
        {/* <img
                src={require("/public/videos/Homepagevideo.mp4")}
                alt="img"
              /> */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src="/videos/homepagevideo.mp4" type="video/mp4" />
        </video>

        {/* Transparent Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            px: 2,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.1,
                textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              }}
            >
              Your Spiritual Journey Starts Here
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                fontWeight: 400,
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.6,
                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
              }}
            >
              Experience premium spiritual tourism packages — meditate, relax, and
              explore sacred destinations. Share your travel memories and stories with the world.
            </Typography>
            <Button
              component={Link}
              href="/full-tour"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              Explore Now
            </Button>
          </Container>
        </Box>
      </Box>

      {/* ✈️ Services Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Travel Services
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', fontWeight: 400 }}
          >
            Choose from our wide range of travel services designed to make your journey memorable.
          </Typography>
        </Box>

         <Grid container spacing={4}>
          {services.map((service) => (
            <Grid  key={service.title}>
              <Card
                component={Link}
                href={service.href}
                sx={{
                  textDecoration: 'none',
                  height: '100%',
                  transition: 'all 0.2s ease-in-out',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px -8px rgba(0,0,0,0.2)',
                    borderColor: service.color,
                  },
                  cursor: 'pointer',
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>{service.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🌍 CTA Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
            >
              Ready to Start Your Adventure?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontSize: '1.1rem' }}
            >
              Join thousands of travelers who trust TravellerClicks for their journey needs.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Get Started
              </Button>
              <Button
                component={Link}
                href="/insights"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Travel Insights
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
