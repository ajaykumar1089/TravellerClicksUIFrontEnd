'use client';

import { useRouter } from 'next/navigation';
import styles from './BookNowButton.module.css'

type BookNowButtonProps = {
  id: number | string;
};

export default function BookNowButton({ id }: BookNowButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/paymentsummary/${id}`)}
      className={styles['book-now-btn']} >
      BOOK NOW
    </button>
  );
}
