import PaymentMethod from './ClientPage';
import styles from './PaymentMethod.module.css';

type PageProps = {
  params: { id: string };
};

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export async function generateMetadata({ params }: PageProps) {
  return { title: `Holiday Package ${params.id}` };
}

export default async function Page({ params }: PageProps) {
  const booking = {
    bookingDate: '12 Feb 2026',
    travelDate: '20 Mar 2026',
    name: 'Ajay Kumar',
    phone: '+91 98765 43210',
    address: 'Bangalore, Karnataka, India',
    basePrice: 45000,
    tax: 3500,
  };

  const total = booking.basePrice + booking.tax;

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.pageTitle}>Total Payment Summary</h1>

      {/* 🔥 GRID WRAPPER (CRITICAL) */}
      <div className={styles.grid}>
        {/* ✅ LEFT COLUMN */}
        <div className={styles.left}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Booking Details</h3>

            <div className={styles.row}>
              <span>Date of Booking</span>
              <span>{booking.bookingDate}</span>
            </div>

            <div className={styles.row}>
              <span>Date of Travel</span>
              <span>{booking.travelDate}</span>
            </div>

            <div className={styles.row}>
              <span>Name</span>
              <span>{booking.name}</span>
            </div>

            <div className={styles.row}>
              <span>Phone</span>
              <span>{booking.phone}</span>
            </div>

            <div className={styles.row}>
              <span>Address</span>
              <span className={styles.muted}>{booking.address}</span>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Payment Summary</h3>

            <div className={styles.row}>
              <span>Base Price</span>
              <span>${booking.basePrice.toLocaleString()}</span>
            </div>

            <div className={styles.row}>
              <span>Taxes & Fees</span>
              <span>${booking.tax.toLocaleString()}</span>
            </div>

            <div className={`${styles.row} ${styles.total}`}>
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ✅ RIGHT COLUMN */}
        <div className={styles.right}>
          <PaymentMethod />

          <button className={styles.payButton}>
            🔒 Secure your booking — Pay ${total.toLocaleString()}
          </button>

          <p className={styles.securityNote}>
            Payments are secured & encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
