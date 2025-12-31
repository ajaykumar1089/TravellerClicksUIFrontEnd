'use client'
import styles from '../[id]/DestinationDetailsPage.module.css'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import CouponsBox from './CouponsBox'
import Image from 'next/image';
import type { ComponentType } from 'react';

import { AddLocationAltTwoTone } from '@mui/icons-material'

const Slider = dynamic(() => import('react-slick').then(mod => mod.default), { ssr: false }) as unknown as ComponentType<any>

const API_BASE_URL = 'https://backend-82om.onrender.com/'

interface PickupLocation {
  id: number
  name: string
  address: string
  city: string
  city_name: string
  latitude: string
  longitude: string
}

interface Destination {
  pickup_locations: PickupLocation[]
  id: number
  image: string
  city: string
  city_name: string
  country: string
  description: string
  primary_image: string
  title: string
  price_per_person: string
  all_images: string[]
  total_reviews: string
  created_at: string
  service_provider_name: string
  model: string
  documents_required: string
  terms_and_conditions: string
  itinerary?: string
}


interface ItineraryImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
}


interface Itinerary {
  id: number;
  dayNum: string;
  name: string;
  city: string;
  description: string;
  images: ItineraryImage[];
}


export default function DestinationDetailsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const { id } = useParams()
  const router = useRouter()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loadingitineraries, setLoadingitineraries] = useState(true);
  const [descriptiondes, setDescription] = useState<string>("");

  // Dynamically import CKEditor (so it only loads on client side)
  // const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then(mod => mod.CKEditor), {
  //   ssr: false,
  // });
  // const ClassicEditor = dynamic(() => import("@ckeditor/ckeditor5-build-classic"), {
  //   ssr: false,
  // });

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const apiUrl =
          `${API_BASE_URL}api/holidaypackages/itineraries/?holidaypackage=${id}`
        //  : 'http://127.0.0.1:8000/api/fulltours/itineraries/';
        const res = await fetch(apiUrl, {
          next: { revalidate: 0 },
        })
        const data = await res.json();
        // const sortedData = data.results.sort((a: Itinerary, b: Itinerary) => a.id - b.id);
        // setItineraries(sortedData);
        if (data.results && data.results.length > 0) {
          // âœ… Sort itineraries by ID ascending
          const sortedData = data.results.sort((a: Itinerary) => a.id);
          setItineraries(sortedData);
        } else {
          setItineraries([]);
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, [id]);

  useEffect(() => {
    if (!id) return

    const fetchDestination = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/holidaypackages/${id}/`, {

          next: { revalidate: 0 },
        })
        if (!res.ok) throw new Error('Failed to fetch data')
        const data = await res.json()
        setDestination(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load destination details')
      } finally {
        setLoading(false)
      }
    }
    fetchDestination()
  }, [id])

  if (loading) return <div className="p-10 text-center text-lg">Loading...</div>
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>
  if (!destination) return <div className="p-10 text-center">No destination found</div>

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    adaptiveHeight: true,
  }

  // Classic Tabs Data
  const tabs = [
    {
      label: 'Itinerary',
      //content: <p>{destination.itinerary || destination.description || 'Itinerary coming soon.'}</p>,
      content: <div className={styles['itinerary-container']}>
        {itineraries.map((itinerary) => (
          <div key={itinerary.id} className={styles['itinerary-card']}>
            <div className={styles['itinerary-header']}>
              <h2>{itinerary.dayNum}</h2>
              <h3>{itinerary.name}</h3>
              <p className={styles['city']}>  <AddLocationAltTwoTone sx={{ fontSize: 40, color: 'secondary.main' }} /> {itinerary.city}</p>
            </div>

            <div className={styles['itinerary-content']}>
              {itinerary.images && itinerary.images.length > 0 && (
                <img
                  src={itinerary.images[0].image}
                  alt={itinerary.images[0].alt_text}
                  className={styles['itinerary-image']}
                />
              )}
              {/* <p className={styles['description']}>{itinerary.description}</p> */}

              <div className={styles.container}>
                <form className={styles.form}>
                  <div className={styles.editorWrapper}>
                    {/* <CKEditor editor={ClassicEditor} data={itinerary.description || 'No terms available.'}
                      onChange={(_, editor) => { const data = editor.getData(); setDescription(data); }}
                      config={{
                        toolbar: [
                          "heading", "|",
                          "bold", "italic", "underline", "link",
                          "bulletedList", "numberedList", "|",
                          "blockQuote", "insertTable", "undo", "redo", "|",
                          "imageUpload", "mediaEmbed"
                        ],
                        height: "300px",
                        ckfinder: {
                          // âœ… Optional: Django CKEditor upload endpoint
                          uploadUrl: "http://127.0.0.1:8000/ckeditor/upload/",
                        },
                      }}
                    /> */}
                  </div>
                </form>

                {/* Preview Section */}
                <div className={styles.preview}>

                  <div
                    className={styles.previewBox}
                    dangerouslySetInnerHTML={{ __html: itinerary.description }}
                  />
                </div>
              </div>


            </div>
          </div>
        ))}
      </div>,
    },
    {
      label: 'Terms & Conditions',
      content:

        // <p>{destination.terms_and_conditions || 'No terms available.'}</p>
        <div className={styles.container}>
          <form className={styles.form}>
            <div className={styles.editorWrapper}>
              {/* <CKEditor editor={ClassicEditor} data={destination.terms_and_conditions || 'No terms available.'}
                onChange={(_, editor) => { const data = editor.getData(); setDescription(data); }}
                config={{
                  toolbar: [
                    "heading", "|",
                    "bold", "italic", "underline", "link",
                    "bulletedList", "numberedList", "|",
                    "blockQuote", "insertTable", "undo", "redo", "|",
                    "imageUpload", "mediaEmbed"
                  ],
                  height: "300px",
                  ckfinder: {
                    // âœ… Optional: Django CKEditor upload endpoint
                    uploadUrl: "http://127.0.0.1:8000/ckeditor/upload/",
                  },
                }}
              /> */}
            </div>
          </form>

          {/* Preview Section */}
          <div className={styles.preview}>

            <div
              className={styles.previewBox}
              dangerouslySetInnerHTML={{ __html: destination.terms_and_conditions }}
            />
          </div>
        </div>
      ,
    },
    {
      label: 'Summary',
      content: <p>{destination.documents_required || 'Summary details unavailable.'}</p>,
    },
  ]

  const handleNextImage = (id: number, imagesLength: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] + 1 >= imagesLength ? 0 : prev[id] + 1,
    }));
  };

  const handlePrevImage = (id: number, imagesLength: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] - 1 < 0 ? imagesLength - 1 : prev[id] - 1,
    }));
  };

  return (
    <div className={styles['destination-container']}>
      <div className={styles['destination-card']}>
        {/* Image Slider */}
        <div className={styles['destination-slider']}>
          <img
            src={`${API_BASE_URL}${destination.all_images[0] || 'default-image.jpg'}`}
            alt={destination.city}
            className="w-full h-[450px] object-cover rounded-lg"
          />
        </div>

        {/* Details + Tabs + Pricing */}
        <div className="p-8">
          <div className={styles['flex-row']}>
            {/* Left Section: Tabs + Proceed Button */}
            <div className={styles['left-section']}>
              <h1 className="text-3xl font-bold mb-2">{destination.title}</h1>
              <p className="text-gray-500 text-lg mb-4">{destination.country}</p>

              {/* Classic Tabs */}
              <div className={styles['tabs-header']}>
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`${styles['tab-button']} ${activeTab === index ? styles['active'] : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className={styles['tab-content']}>{tabs[activeTab].content}</div>
            </div>

            {/* Right Section */}
            <div className={styles.rightSection}>
              <button className={styles.fixedButton}>Chat with Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
