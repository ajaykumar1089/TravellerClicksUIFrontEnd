"use client";

import { useEffect, useState } from "react";
import styles from '../[id]/DestinationDetailsPage.module.css'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import CouponsBox from './CouponsBox'
import Image from 'next/image';
import type { ComponentType } from 'react';
import { AddLocationAltTwoTone } from '@mui/icons-material'
import BookNowButton from "@/components/booknow/BookNowButton";

interface ImageType {
  id: number;
  image: string;
  alt_text?: string;
  is_primary?: boolean;
  //holidaypackage?: number;
}


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

interface ImageType {
  id: number;
  image: string;
  alt_text?: string;
  is_primary?: boolean;
  //holidaypackage?: number;
}

export default function ClientPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = useParams()
  const [images, setImages] = useState<ImageType[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<Destination | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [activeTab, setActiveTab] = useState(0)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const holidayPackageIds = [1, 2, 3, 4]; // 👉 extend as needed

    async function fetchAllImages() {
      try {
        const responses = await Promise.all(
          holidayPackageIds.map((id) =>
            fetch(
              `http://127.0.0.1:8000/api/holidaypackages/itineraries/?holidaypackage=${id}`
            ).then((res) => res.json())
          )
        );

        const allImages: ImageType[] = [];

        responses.forEach((data) => {
          data?.results?.forEach((itinerary: any) => {
            itinerary.images?.forEach((img: any) => {
              allImages.push({
                ...img,
               // holidaypackage: itinerary.holidaypackage,
              });
            });
          });
        });

        responses.forEach((data) => {      



        });

        // optional: primary images first
        allImages.sort(
          (a, b) => Number(b.is_primary) - Number(a.is_primary)
        );

        setImages(allImages);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load images:", error);
        setLoading(false);
      }
    }

    fetchAllImages();
  }, []);


   useEffect(() => {
      const fetchItineraries = async () => {
        try {
          const apiUrl =
            `http://127.0.0.1:8000/api/holidaypackages/itineraries/?holidaypackage=${id}`
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
        const res = await fetch(`http://127.0.0.1:8000/api/holidaypackages/${id}/`, {

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




  if (loading) return <p>Loading images...</p>;
  if (!images.length) return <p>No images found</p>;


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
         

          {/* Preview Section */}
          <div className={styles.preview}>

            <div  className={styles.previewBox}
              dangerouslySetInnerHTML={{ __html: destination.terms_and_conditions }}
            />
          </div>
        </div>
      ,
    },
    // {
    //   label: 'Summary',
    //   content: <p>{destination.documents_required || 'Summary details unavailable.'}</p>,
    // },
  ]

  return (    
<>    
<div>
  <div> 
  <BookNowButton id={destination.id} />
  </div>
    <div style={{ maxWidth: 900, margin: "auto" }}>
      {/* Slider */}
      <img  src={images[current].image}  alt={images[current].alt_text || "Holiday image"}
         style={{
          width: "100%",
          height: 420,
          objectFit: "cover",
          borderRadius: 14,
        }} />

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <button
          onClick={() =>
            setCurrent((prev) =>
              prev === 0 ? images.length - 1 : prev - 1
            )
          }
        >
          ⬅ Prev
        </button>

        <button
          onClick={() =>
            setCurrent((prev) =>
              prev === images.length - 1 ? 0 : prev + 1
            )
          }
        >
          Next ➡
        </button>
      </div>

      {/* Thumbnails */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 16,
          overflowX: "auto",
        }}
      >
        {images.map((img, index) => (
          <img
            key={`${img.id}-${index}`}
            src={img.image}
            alt={img.alt_text}
            onClick={() => setCurrent(index)}
            style={{
              width: 90,
              height: 70,
              objectFit: "cover",
              cursor: "pointer",
              borderRadius: 6,
              border: current === index ? "2px solid black" : "1px solid #ccc",
            }}
          />
        ))}
      </div>
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
    </>
  );
}


// "use client";

// import { useEffect, useState } from "react";

// export default function ClientPage({ id }: { id: string }) {
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     fetch(
//       `http://127.0.0.1:8000/api/holidaypackages/itineraries/?holidaypackage=${id}`
//     )
//       .then((res) => res.json()).then(setData);
//   }, [id]);

//   return (
//     <div>
//       <h1>Holiday Package {id}</h1>
     
//     </div>



//   );
// }
