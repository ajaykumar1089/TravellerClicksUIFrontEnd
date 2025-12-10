'use client';

export const dynamic = "force-dynamic"; // critical

import { useEffect, useState } from "react";

export default function HolidayDestinationDetails({ params }) {
  const { id } = params;
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`https://http://127.0.0.1:8000/api/holidaypackages/${id}/`);
      const json = await res.json();
      setData(json);
    }
    load();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
    </div>
  );
}
