"use client";

import { useEffect, useState } from "react";
import styles from '../[id]/page.module.css'
import { useParams, useRouter } from 'next/navigation'


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


export default function ClientPage({
  params,
}: {
  params: { id: string };
}) {

  const { id } = useParams()
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<Destination | null>(null)


  const [error, setError] = useState<string | null>(null)


  const basePrice = 1045;//parseFloat(destination.price_per_person);
  const [adultCount, setAdultCount] = useState(1)
  const [addons, setAddons] = useState({
    travelInsurance: false,
    medicalCoverage: false,
  })

  const addonPrices = {
    travelInsurance: 18,
    entrancefee: 200,
  }

  const totalAddonsPricePerPerson =
    (addons.travelInsurance ? addonPrices.travelInsurance : 0) +
    (addons.medicalCoverage ? addonPrices.entrancefee : 0)

  const totalPricePerPerson = basePrice + totalAddonsPricePerPerson
  const totalGroupPrice = totalPricePerPerson * adultCount

  const handleAddonChange = (name: string) => {
    setAddons({ ...addons, [name]: !addons[name as keyof typeof addons] })
  }

  const handleAdultChange = (delta: number) => {
    setAdultCount(prev => Math.max(1, prev + delta))
  }



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


  return (

    <div className={styles.container}>
      {/* LEFT SIDE — DETAILS */}
      <div className={styles.leftSection}>
        <h1 className={styles.pageTitle}>Payment Summary</h1>

        {/* Tour Details */}
        <div className={styles.section}>
          <h2>Tour Name: Scenic Getaway to Sri Lanka</h2>
          <p>Itenary Highlights: Kandy • Nuwara Eliya • Bentota</p>
        </div>

        {/* Travel Dates */}
        <div className={styles.section}>
          <h3>Travel Details</h3>
          <p><strong>Start Date - End Date:</strong> 12th Dec - 17th Dec</p>
          <p><strong>Stay Duration:</strong> 5 Days / 4 Nights</p>
          <p><strong>Pick Up:</strong> 12th Dec, Colombo International Airport</p>
        </div>

        {/* Traveller Details */}
        <div className={styles.section}>
          <h3>Add Traveller Details</h3>
          <p>Login to view your saved travellers list, get offers and more.</p>
          <button className={styles.btnLogin}>Login Now</button>

          <div className={styles.travellerSection}>
            <div className={styles.travellerHeader}>
              <h4>Traveller (Adult 7+)</h4>
              <div className={styles.counter}>
                <button onClick={() => handleAdultChange(-1)}>-</button>
                <span>{adultCount}</span>
                <button onClick={() => handleAdultChange(1)}>+</button>
              </div>
            </div>
            {[...Array(adultCount)].map((_, i) => (
              <input key={i} placeholder={`Full Name of Traveller ${i + 1}`} />
            ))}
            <h4>Child (Below 7)</h4>
            <input placeholder="Full Name" />
          </div>

          <div className={styles.contactDetails}>
            <h4>Contact Details</h4>
            <input placeholder="Email" />
            <div className={styles.row}>
              <input placeholder="Mobile Code" />
              <input placeholder="Mobile Number" />
            </div>
          </div>
        </div>

        {/* Package Add-Ons */}
        <div className={styles.section}>
          <h3>Package Add-Ons</h3>
          <p>Secure your trip and travel worry free</p>

          <div className={styles.addonItem}>
            <label>
              <input
                type="checkbox"
                checked={addons.travelInsurance}
                onChange={() => handleAddonChange('travelInsurance')}
              />
              Travel + Medical Insurance — ${addonPrices.travelInsurance} / person
            </label>
          </div>

          <div className={styles.addonItem}>
            <label>
              <input
                type="checkbox"
                checked={addons.medicalCoverage}
                onChange={() => handleAddonChange('medicalCoverage')}
              />
              For all Entrance Fee — ${addonPrices.entrancefee} / person (i)
            </label>
          </div>
        </div>

        {/* GST Info */}
        <div className={styles.section}>
          <h3>TCS (Tax Collected at Source)</h3>
          <p>
            As per Govt rules, 5% TCS will be applicable on spends towards International Holiday packages
            for cumulative spends (within or outside MakeMyTrip) up to $10 Lakhs, and 20% beyond $10 Lakhs.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — PRICE SUMMARY */}
      <div className={styles.rightSection}>
        <div className={styles.priceBox}>
          <h2>Total Price Summary</h2>
          <p>
            Adults: {adultCount} <br />
            Base Price / person: ${basePrice.toLocaleString()} <br />
            Add-ons / person: ${totalAddonsPricePerPerson.toLocaleString()}
          </p>
          <hr />
          <h3 className={styles.finalPrice}>Total: ${totalGroupPrice.toLocaleString()}</h3>
          <p className={styles.perPerson}>(Includes all travellers)</p>
          <button onClick={() => router.push(`/paymentmethodselector/${id}`)} className={styles.btnProceed}>Proceed to Payment</button>
          {/* <button
                onClick={() => router.push(`/paymentmethodselector/${id}`)}
                className={styles['book-now-btn']} >
                BOOK NOW
              </button> */}
        </div>
      </div>
    </div>
  );
}


