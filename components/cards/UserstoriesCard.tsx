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
import { Userstories } from '../../lib/api-client'

interface UserstoriesCardProps {
  userstories: Userstories
}

const UserstoriesCard: React.FC<UserstoriesCardProps> = ({ userstories }) => {
  return (
    <Link href={`/travel-stories/${userstories.id}`} style={{ textDecoration: 'none' }}>
     <Card>
udssdSDd
     </Card>
    </Link>
  )
}

export default UserstoriesCard