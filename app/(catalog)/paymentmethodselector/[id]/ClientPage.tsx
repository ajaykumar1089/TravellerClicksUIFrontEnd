'use client';

import { useState } from 'react';
import styles from './PaymentMethod.module.css';

export default function PaymentMethod() {
  const [method, setMethod] = useState<'card' | 'paypal'>('card');

  const handleSecureBooking = () => {
    if (method === 'card') {
      console.log('Proceed with Card Payment');
      // Razorpay / Stripe Card flow
    } else {
      console.log('Proceed with PayPal');
      // PayPal redirect flow
    }
  };

  return (
    <section className={styles.paymentSection}>
      <h2 className={styles.title}>Payment details</h2>
      <p className={styles.subtext}>Payments are secured and encrypted</p>

      {/* CARD PAYMENT */}
      <label
        className={`${styles.option} ${
          method === 'card' ? styles.active : ''
        }`}
      >
        <input
          type="radio"
          name="payment"
          checked={method === 'card'}
          onChange={() => setMethod('card')}
        />

        <div className={styles.optionContent}>
          <strong>💳 Card Payment</strong>
          <p>Visa • MasterCard • RuPay</p>

          {method === 'card' && (
            <div className={styles.cardForm}>
              <div className={styles.field}>
                <label>Card Number</label>
                <div className={styles.cardInput}>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                  />
                  <span className={styles.visa}>VISA</span>
                </div>
              </div>

              <div className={styles.rowFields}>
                <div className={styles.field}>
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM / YY" />
                </div>

                <div className={styles.field}>
                  <label>CVV</label>
                  <input type="password" placeholder="***" />
                </div>
              </div>

              <div className={styles.field}>
                <label>Country</label>
                <select>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </label>

      {/* PAYPAL */}
      <label
        className={`${styles.option} ${
          method === 'paypal' ? styles.active : ''
        }`}
      >
        <input
          type="radio"
          name="payment"
          checked={method === 'paypal'}
          onChange={() => setMethod('paypal')}
        />

        <div className={styles.optionContent}>
          <strong>🅿️ PayPal</strong>
          <p>International payments supported</p>
        </div>
      </label>

      {/* SECURE BOOKING BUTTON */}
      <button
        className={styles.secureBtn}
        onClick={handleSecureBooking}
      >
        🔒 Secure your booking
      </button>
    </section>
  );
}
