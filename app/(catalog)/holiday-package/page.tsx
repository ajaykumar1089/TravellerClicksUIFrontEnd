"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Paper,
  Typography,
  Pagination,
  Slider,
  Stack,
  Chip,
} from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import HolidaypackageCard from "@/components/cards/HolidayPackageCard";
import { apiClient, Holidaypackage } from "@/lib/api-client";

/* ✅ Dynamic Map Import (NO SSR) */
const HolidayMap = dynamic(() => import("./HolidayMap"), {
  ssr: false,
});

interface Filters {
  city?: string;
  from_date?: Dayjs | null;
  to_date?: Dayjs | null;
  pickup_locations?: string[];
  price_min?: string;
  price_max?: string;
}

/* 🌍 Static Destinations */
const destinations = [
  {
    id: 1,
    city: "Paris",
    lat: 48.8566,
    lng: 2.3522,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    id: 2,
    city: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    image:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b",
  },
];

export default function HolidayPackagePage() {
  const [holidaypackages, setHolidaypackages] = useState<Holidaypackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    pickup_locations: [],
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  /* ✅ Fetch Packages */
  const fetchHolidaypackages = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        page_size: 12,
        price_min: priceRange[0],
        price_max: priceRange[1],
      };

      const response = await apiClient.getHolidaypackages(params);

      setHolidaypackages(response.data.results);
      setTotalCount(response.data.count);
      setTotalPages(Math.ceil(response.data.count / 12));
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidaypackages(1);
  }, [priceRange]);

  const handlePageChange = (_: any, page: number) => {
    fetchHolidaypackages(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* LEFT FILTER */}
        <Paper sx={{ width: 280, p: 2 }}>
          <Typography variant="h6">Filters</Typography>

          <Typography variant="subtitle2" sx={{ mt: 3 }}>
            Price Range
          </Typography>

          <Slider
            value={priceRange}
            onChange={(_, v) => setPriceRange(v as [number, number])}
            min={100}
            max={10000}
            step={100}
            valueLabelDisplay="auto"
          />

          <Stack direction="row" spacing={1} mt={2}>
            {[500, 1000, 2000].map((v) => (
              <Chip
                key={v}
                label={`Under $${v}`}
                onClick={() => setPriceRange([100, v])}
              />
            ))}
          </Stack>
        </Paper>

        {/* RIGHT CONTENT */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            {totalCount} Holiday Packages
          </Typography>

          <Stack direction="row" spacing={2} mt={2}>
            <button onClick={() => setViewMode("list")}>List</button>
            <button onClick={() => setViewMode("map")}>Map</button>
          </Stack>

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 3,
                  mt: 3,
                }}
              >
                {holidaypackages.map((item) => (
                  <HolidaypackageCard key={item.id} holidaypackage={item} />
                ))}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </Box>
              )}
            </>
          )}

          {/* MAP VIEW */}
          {viewMode === "map" && (
            <Box sx={{ height: 600, mt: 3 }}>
              <HolidayMap destinations={destinations} />
            </Box>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
