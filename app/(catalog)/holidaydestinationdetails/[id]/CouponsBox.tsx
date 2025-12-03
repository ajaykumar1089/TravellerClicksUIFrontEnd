'use client'

import React, { useState } from 'react'
import styles from './CouponsBox.module.css'

interface Coupon {
  id: number
  code: string
  description: string
  discountPercent: number
}

interface CouponsBoxProps {
  basePrice: number
}

const coupons: Coupon[] = [
  { id: 1, code: 'WELCOME10', description: 'Get 10% off on your first booking', discountPercent: 10 },
  { id: 2, code: 'TRAVEL20', description: '20% off for travel above $500', discountPercent: 20 },
  { id: 3, code: 'FESTIVE15', description: 'Festive Offer: 15% Discount', discountPercent: 15 },
]

export default function CouponsBox({ basePrice }: CouponsBoxProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  const handleSelect = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
  }

  const discount = selectedCoupon ? (basePrice * selectedCoupon.discountPercent) / 100 : 0
  const finalPrice = basePrice - discount

  return (
    <div className={styles.couponBox}>
      <h2 className={styles.heading}>Coupons & Offers</h2>

      <div className={styles.couponList}>
        {coupons.map(coupon => (
          <div
            key={coupon.id}
            className={`${styles.couponCard} ${selectedCoupon?.id === coupon.id ? styles.active : ''}`}
            onClick={() => handleSelect(coupon)}
          >
            <div className={styles.couponCode}>{coupon.code}</div>
            <div className={styles.couponDescription}>{coupon.description}</div>
          </div>
        ))}
      </div>

      <div className={styles.priceSummary}>
        <p>Base Price: <strong>${basePrice.toFixed(2)}</strong></p>
        {selectedCoupon && <p>Discount ({selectedCoupon.discountPercent}%): -${discount.toFixed(2)}</p>}
        <hr />
        <p className={styles.finalPrice}>
          Final Price: <strong>${finalPrice.toFixed(2)}</strong>
        </p>
      </div>
    </div>
  )
}
