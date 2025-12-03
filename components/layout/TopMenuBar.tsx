'use client'

import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Person,
} from '@mui/icons-material'
import Link from 'next/link'

const TopMenuBar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:900px)')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          pt: 2,
        },
      }}
    >
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Traveller clicks
        </Typography>
      </Box>
      <Divider />
      <List>
        {/* <ListItem
          component={Link}
          href="/bike-rentals"
          onClick={toggleMobileDrawer}
          sx={{ '&:hover': { bgcolor: 'grey.50' }, cursor: 'pointer' }}
        >
          <ListItemText primary="Bike Rentals" />
        </ListItem> */}
        <ListItem
          component={Link}
          href="/full-tour"
          onClick={toggleMobileDrawer}
          sx={{ '&:hover': { bgcolor: 'grey.50' }, cursor: 'pointer' }}
        >
          <ListItemText primary="full tour" />
        </ListItem>

        <ListItem
          component={Link}
          href="/travel-stories"
          onClick={toggleMobileDrawer}
          sx={{ '&:hover': { bgcolor: 'grey.50' }, cursor: 'pointer' }}
        >
          <ListItemText primary="User stories" />
        </ListItem>

        <Divider sx={{ my: 1 }} />
        <ListItem
          component={Link}
          href="/login"
          onClick={toggleMobileDrawer}
          sx={{ '&:hover': { bgcolor: 'grey.50' }, cursor: 'pointer' }}
        >
          <ListItemText primary="Login / Register" />
        </ListItem>
      </List>
    </Drawer>
  )

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' }, px: { xs: 0 } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="primary"
                onClick={toggleMobileDrawer}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box component={Link} href="/" sx={{ textDecoration: 'none', mr: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                <img src='/images/Logo.png'/>
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* <Button
                  component={Link}
                  href="/bike-rentals"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  Bike Rentals
                </Button> */}

                <Button
                  component={Link}
                  href="/full-tour"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  Spiritual Tour Packages
                </Button>                
                <Button
                  component={Link}
                  href="/Bharat-Bhraman"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                 Government Tourism
                </Button>

                {/* <Button
                  component={Link}
                  href="/Pilgrimage-full-tour"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  Pilgrimage Full Tour
                </Button> */}

                <Button
                  component={Link}
                  href="/holiday-package"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  Holiday Package
                </Button>

               {/* <Button
                  component={Link}
                  href="/guided-bike-trips"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                 Visit Visa
                </Button> */}
                <Button
                  component={Link}
                  href="/travel-stories"
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  Travel Stories
                </Button>
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '6px',
                      minWidth: '80px',
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '6px',
                      minWidth: '90px',
                    }}
                  >
                    Register
                  </Button>
                </>
              )}

              {isMobile && (
                <IconButton
                  component={Link}
                  href="/login"
                  color="primary"
                  size="small"
                >
                  <Person />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <MobileDrawer />
    </>
  )
}

export default TopMenuBar