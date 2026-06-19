import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Haversine distance in km between two lat/lng points
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Format km distance for display: "0.8 km" or "12 km"
export function fmtKm(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

// Default Lagos centre coordinates (fallback if geolocation denied)
export const LAGOS_DEFAULT = { lat: 6.4541, lng: 3.3947 }

// Parse "opens at X" from hours string — returns { open: bool, label: string }
export function parseHoursStatus(hours) {
  if (!hours) return { open: null, label: null }
  // Try to detect if currently open based on hours string (best-effort)
  // Just extract the hours part for display
  return { open: null, label: hours }
}
