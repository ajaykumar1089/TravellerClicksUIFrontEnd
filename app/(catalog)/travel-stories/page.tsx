'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

// ---------- Storytellers Data ----------
const storytellers = [
  {
    id: 1,
    name: 'John Carter',
    location: 'Bali',
    description: 'Exploring Bali’s hidden temples and beaches.',
    images: ['/stories/bali1.jpg', '/stories/bali2.jpg', '/stories/bali3.jpg'],
    video: '/stories/bali-video.mp4',
    isLive: false,
    uploadedAt: new Date('2025-10-26T10:00:00'),
  },
  {
    id: 2,
    name: 'Emma Wilson',
    location: 'Iceland',
    description: 'Iceland adventures under the Northern Lights.',
    images: ['/stories/iceland1.jpg', '/stories/iceland2.jpg'],
    video: '/stories/iceland-video.mp4',
    isLive: true,
    uploadedAt: new Date('2025-10-26T15:30:00'),
  },
  {
    id: 3,
    name: 'Sophia Spiritual Journey',
    location: 'Japan',
    description:
      'Full spiritual journey across Japan exploring temples and meditation retreats.',
    images: [
      'http://127.0.0.1:8000/media/holidaypackages/images/2_20260124_162713_10n_11d_december_2025.jpg',
      'http://127.0.0.1:8000/media/holidaypackages/images/2_20260124_162713_10n_11d_december_2025.jpg',
    ],
    video: 'https://www.youtube.com/embed/U3R0XYtXc5k?autoplay=1&mute=1',
    isLive: true,
    uploadedAt: new Date('2025-10-26T14:00:00'),
  },
];

// ---------- Helper: time ago ----------
const timeAgo = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
};

export default function TravelStoriesPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  const locations = ['All', ...Array.from(new Set(storytellers.map((s) => s.location)))];

  const filteredStorytellers =
    selectedLocation === 'All'
      ? storytellers
      : storytellers.filter((s) => s.location === selectedLocation);

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
    <div className={styles.container}>
      {/* ---------- Header: Location Selector ---------- */}
      <div className={styles.locationHeader}>
        <span className={styles.headerTitle}>Premium Locations: </span>
        {locations.map((loc) => {
          const count =
            loc === 'All'
              ? storytellers.length
              : storytellers.filter((s) => s.location === loc).length;
          return (
            <button
              key={loc}
              className={`${styles.locationBtn} ${
                selectedLocation === loc ? styles.activeLocationBtn : ''
              }`}
              onClick={() => setSelectedLocation(loc)}
            >
              {loc} ({count})
            </button>
          );
        })}
      </div>

      <h2 className={styles.sectionTitle}>Popular Storytellers & Live Streams</h2>

      {/* ---------- Storytellers Feed ---------- */}
      <div className={styles.feedContainer}>
        {filteredStorytellers.map((user) => (
          <div key={user.id} className={styles.userRow}>
            {/* Left Section */}
            <div className={styles.leftSection}>
              <div className={styles.imageSlider}>
                {user.images.length > 1 && (
                  <>
                    <button
                      className={styles.prevBtn}
                      onClick={() => handlePrevImage(user.id, user.images.length)}
                    >
                      ‹
                    </button>
                    <button
                      className={styles.nextBtn}
                      onClick={() => handleNextImage(user.id, user.images.length)}
                    >
                      ›
                    </button>
                  </>
                )}
                <Image
                  src={user.images[currentImageIndex[user.id] || 0]}
                  width={400}
                  height={300}
                  className={styles.storyImage}
                  alt={user.name}
                />
              </div>
              <p className={styles.userDescription}>{user.description}</p>
            </div>

            {/* Right Section */}
            <div className={styles.rightSection}>
              {user.isLive ? (
                <div className={styles.liveBadge}>LIVE NOW</div>
              ) : (
                <div className={styles.uploadedLabel}>{timeAgo(user.uploadedAt)}</div>
              )}

              {user.video.includes('youtube.com') ? (
                <iframe
                  width="100%"
                  height="300"
                  src={user.video}
                  title={user.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={user.video}
                  width="100%"
                  height="300"
                  controls
                  className={styles.videoPlayer}
                />
              )}

              <div className={styles.actionButtons}>
                <button className={styles.followBtn}>Follow</button>
                <button className={styles.iconBtn}>▶ Play</button>
                <button className={styles.iconBtn}>❤️ Like</button>
                <button className={styles.iconBtn}>💬 Comment</button>
                <button className={styles.iconBtn}>🔗 Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
