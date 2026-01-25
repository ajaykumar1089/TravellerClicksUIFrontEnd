"use client";

import {
  Box,
  Paper,
  Typography,
  Slider,
  Stack,
  Chip,
  Checkbox,
  FormControlLabel,
  Divider,
  Button,
  Drawer,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function TourFilters({
  priceRange,
  setPriceRange,
  filters,
  setFilters,
  open,
  onClose,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const FilterContent = (
    <Paper sx={{ width: 280, p: 2, height: "100vh", overflowY: "auto" }}>
      <Typography variant="h6">All Tour Filters</Typography>

      {/* PRICE */}
      <Typography variant="subtitle2" sx={{ mt: 3 }}>
        Price Range
      </Typography>
      <Slider
        value={priceRange}
        onChange={(_, v) => setPriceRange(v as [number, number])}
        min={500}
        max={50000}
        step={500}
        valueLabelDisplay="auto"
      />

      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
        {[5000, 10000, 20000].map((v) => (
          <Chip
            key={v}
            label={`Under $${v}`}
            onClick={() => setPriceRange([500, v])}
            size="small"
          />
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* DURATION */}
      <Typography variant="subtitle2">Duration (Days)</Typography>
      {[1, 3, 5, 7, 10].map((d) => (
        <FormControlLabel
          key={d}
          control={
            <Checkbox
              checked={filters.duration?.includes(d)?? false}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  duration: e.target.checked
                    ? [...(filters.duration || []), d]
                    : filters.duration.filter((x) => x !== d),
                })
              }
            />
          }
          label={`${d}+ Days`}
        />
      ))}

      <Divider sx={{ my: 2 }} />

      {/* DESTINATION */}
      <Typography variant="subtitle2">Destination</Typography>
      {["Goa", "Kerala", "Kashmir", "Rajasthan", "Himachal"].map((city) => (
        <FormControlLabel
          key={city}
          control={
            <Checkbox
              checked={filters.destination?.includes(city)?? false}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  destination: e.target.checked
                    ? [...(filters.destination || []), city]
                    : filters.destination.filter((x) => x !== city),
                })
              }
            />
          }
          label={city}
        />
      ))}

      <Divider sx={{ my: 2 }} />

      {/* TOUR TYPE */}
      <Typography variant="subtitle2">Tour Type</Typography>
      {["Family", "Couple", "Solo", "Adventure", "Luxury"].map((type) => (
        <FormControlLabel
          key={type}
          control={
            <Checkbox
              checked={filters.type?.includes(type)?? false}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: e.target.checked
                    ? [...(filters.type || []), type]
                    : filters.type.filter((x) => x !== type),
                })
              }
            />
          }
          label={type}
        />
      ))}

      <Divider sx={{ my: 2 }} />

      {/* RATINGS */}
      <Typography variant="subtitle2">Rating</Typography>
      {[5, 4, 3].map((r) => (
        <FormControlLabel
          key={r}
          control={
            <Checkbox
              checked={filters.rating?.includes(r)?? false}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  rating: e.target.checked
                    ? [...(filters.rating || []), r]
                    : filters.rating.filter((x) => x !== r),
                })
              }
            />
          }
          label={`${r}★ & above`}
        />
      ))}

      <Divider sx={{ my: 2 }} />

      {/* ACTIONS */}
      <Button
        fullWidth
        variant="outlined"
        color="error"
        onClick={() => {
         // setFilters({});
          setPriceRange([500, 50000]);
        }}
      >
        Clear Filters
      </Button>
    </Paper>
  );

  // MOBILE DRAWER
  if (isMobile) {
    return (
      <Drawer anchor="left" open={open} onClose={onClose}>
        {FilterContent}
      </Drawer>
    );
  }

  // DESKTOP SIDEBAR
  return (
    <Box sx={{ position: "sticky", top: 80 }}>
      {FilterContent}
    </Box>
  );
}
