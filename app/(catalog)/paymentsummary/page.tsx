'use client'

import styles from './page.module.css'
import React, { useState } from 'react'


export default function PaymentSummaryPage() {
  const basePrice = 1000
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
          <button className={styles.btnProceed}>Proceed to Payment</button>
        </div>
      </div>
    </div>
  )
}
