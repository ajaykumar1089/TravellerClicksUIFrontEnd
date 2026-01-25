'use client'

import styles from '../[id]/DestinationDetailsPage.module.css'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import { AddLocationAltTwoTone } from '@mui/icons-material'

const Slider = dynamic(
  () => import('react-slick').then(mod => mod.default),
  { ssr: false }
) as ComponentType<any>

const API_BASE_URL = 'http://127.0.0.1:8000'

interface ItineraryImage {
  id: number
  image: string
  alt_text: string
  is_primary: boolean
}

interface Itinerary {
  id: number
  dayNum: string
  name: string
  city: string
  description: string
  images: ItineraryImage[]
}

interface DestinationClientProps {
  destination: any
  itineraries: Itinerary[]
}

export default function DestinationClient({
  destination,
  itineraries
}: DestinationClientProps) {
  const [activeTab, setActiveTab] = useState(0)

  if (!destination) {
    return <div className="p-10 text-center">No destination found</div>
  }

  const tabs = [
    {
      label: 'Itinerary',
      content: (
        <div className={styles['itinerary-container']}>
          {itineraries.map(itinerary => (
            <div key={itinerary.id} className={styles['itinerary-card']}>
              <div className={styles['itinerary-header']}>
                <h2>{itinerary.dayNum}</h2>
                <h3>{itinerary.name}</h3>
                <p className={styles.city}>
                  <AddLocationAltTwoTone sx={{ fontSize: 32 }} />
                  {itinerary.city}
                </p>
              </div>

              {itinerary.images?.length > 0 && (
                <img
                  src={itinerary.images[0].image}
                  alt={itinerary.images[0].alt_text}
                  className={styles['itinerary-image']}
                />
              )}

              <div
                className={styles.previewBox}
                dangerouslySetInnerHTML={{
                  __html: itinerary.description
                }}
              />
            </div>
          ))}
        </div>
      )
    },
    {
      label: 'Terms & Conditions',
      content: (
        <div
          className={styles.previewBox}
          dangerouslySetInnerHTML={{
            __html: destination.terms_and_conditions || ''
          }}
        />
      )
    },
    {
      label: 'Summary',
      content: (
        <p>{destination.documents_required || 'No summary available.'}</p>
      )
    }
  ]

  return (
    <div className={styles['destination-container']}>
      {/* Hero Image */}
      <img
        src={`${API_BASE_URL}${destination.all_images?.[0] || ''}`}
        alt={destination.title}
        className="w-full h-[450px] object-cover rounded-lg"
      />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">
          {destination.title}
        </h1>

        <p className="text-gray-500 mb-6">
          {destination.country}
        </p>

        {/* Tabs */}
        <div className={styles['tabs-header']}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`${styles['tab-button']} ${
                activeTab === index ? styles['active'] : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles['tab-content']}>
          {tabs[activeTab].content}
        </div>
      </div>
    </div>
  )
}
