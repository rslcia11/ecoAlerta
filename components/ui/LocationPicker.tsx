"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import dynamic from "next/dynamic"
import { Search, Loader2, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Leaflet types
import { LatLngTuple, Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icon in Next.js
// Helper to fix icons
const fixLeafletIcons = async () => {
    const L = (await import("leaflet")).default;

    const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
    const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
    const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

    const DefaultIcon = L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
    })

    L.Marker.prototype.options.icon = DefaultIcon
}

import { formatRelativeTime, cleanLocationName } from "@/lib/utils"

interface LocationPickerProps {
    initialLat?: number
    initialLng?: number
    defaultSearchQuery?: string // e.g. "Loja, Ecuador"
    onLocationSelect: (lat: number, lng: number, address?: string, provincia?: string, ciudad?: string) => void
}

const LocationPickerClient = ({
    initialLat,
    initialLng,
    defaultSearchQuery,
    onLocationSelect,
}: LocationPickerProps) => {
    // Dynamic imports for Leaflet components
    const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = require("react-leaflet")

    // Initialize icons once
    useEffect(() => {
        fixLeafletIcons();
    }, []);

    const [position, setPosition] = useState<LatLngTuple | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    )
    const [searchQuery, setSearchQuery] = useState("")
    const [searching, setSearching] = useState(false)
    const [address, setAddress] = useState("")
    const mapRef = useRef<LeafletMap | null>(null)

    // Map events to handle click/drag
    const MapEvents = () => {
        useMapEvents({
            async click(e: any) {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                setPosition([lat, lng])
                const { address, provincia, ciudad } = await reverseGeocode(lat, lng)
                onLocationSelect(lat, lng, address, provincia, ciudad)
            },
        })
        return null
    }

    // Component to fly to position
    const FlyToLocation = ({ coords }: { coords: LatLngTuple | null }) => {
        const map = useMap()
        useEffect(() => {
            if (coords) {
                map.flyTo(coords, 15)
            }
        }, [coords, map])
        return null
    }

    const [isLocating, setIsLocating] = useState(true)

    // Initial positioning logic
    useEffect(() => {
        // If initial coordinates are provided, just use them and stop loading
        if (initialLat && initialLng) {
            setIsLocating(false);
            return;
        }

        const initializeLocation = async () => {
            setIsLocating(true);

            // 1. Try Geolocation API
            if ("geolocation" in navigator) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                        });
                    });

                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    setPosition([lat, lng]);
                    setPosition([lat, lng]);
                    const { address, provincia, ciudad } = await reverseGeocode(lat, lng);
                    onLocationSelect(lat, lng, address, provincia, ciudad);
                    setIsLocating(false);
                    return; // Successfully located
                } catch (error) {
                    console.log("Geolocation failed or denied, falling back to default query", error);
                }
            }

            // 2. Fallback to defaultSearchQuery (User's city/province)
            if (defaultSearchQuery) {
                await searchLocation(defaultSearchQuery);
            } else {
                // 3. Ultimate fallback (Ecuador center)
                // Already handled by default state of 'center' variable if position is null
                setIsLocating(false);
            }
        };

        initializeLocation();
    }, [initialLat, initialLng, defaultSearchQuery]); // Dependencies

    const searchLocation = async (query: string) => {
        if (!query) return
        setSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
            )
            const data = await response.json()
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat)
                const lon = parseFloat(data[0].lon)
                const addr = data[0].display_name

                setPosition([lat, lon])
                // Only trigger callback if we found a location
                const cleanAddr = cleanLocationName(addr);
                const addressDetails = data[0].address || {};
                const provincia = addressDetails.state || addressDetails.province || addressDetails.region;
                const ciudad = addressDetails.city || addressDetails.town || addressDetails.village || addressDetails.municipality;
                setAddress(cleanAddr)
                onLocationSelect(lat, lon, addr, provincia, ciudad) // Send full address to parent
            }
        } catch (error) {
            console.error("Error geocoding:", error)
        } finally {
            setSearching(false)
            setIsLocating(false)
        }
    }

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
            const data = await response.json()
            const addr = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
            const addressDetails = data.address || {};
            const provincia = addressDetails.state || addressDetails.province || addressDetails.region;
            const ciudad = addressDetails.city || addressDetails.town || addressDetails.village || addressDetails.municipality;
            setAddress(cleanLocationName(addr))
            return { address: addr, provincia, ciudad };
        } catch (error) {
            console.error("Error reverse geocoding:", error)
            return { address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, provincia: undefined, ciudad: undefined };
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        searchLocation(searchQuery)
    }

    const DraggableMarker = () => {
        const markerRef = useRef<any>(null)
        const eventHandlers = useMemo(
            () => ({
                async dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        const { lat, lng } = marker.getLatLng()
                        setPosition([lat, lng])
                        const { address, provincia, ciudad } = await reverseGeocode(lat, lng)
                        onLocationSelect(lat, lng, address, provincia, ciudad)
                    }
                },
            }),
            []
        )

        return position === null ? null : (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}
            />
        )
    }

    // Default center: initial coords or fallback to Ecuador generic (approx center)
    const center: LatLngTuple = initialLat && initialLng ? [initialLat, initialLng] : [-4.007555, -79.207604] // Default Loja fallback if nothing else

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    placeholder="Buscar sitio (ej: Parque Jipiro)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
                <Button
                    type="button"
                    onClick={() => searchLocation(searchQuery)}
                    disabled={searching}
                    variant="outline"
                >
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
            </div>

            {address && (
                <div className="bg-eco-primary/5 border border-eco-primary/10 rounded-lg p-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-eco-primary shrink-0 mt-0.5" />
                    <span className="text-xs text-eco-primary-dark font-medium line-clamp-2">
                        {address}
                    </span>
                </div>
            )}

            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200 z-0 relative">
                <MapContainer
                    center={center}
                    zoom={13}
                    style={{ height: "100%", width: "100%", zIndex: 0 }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker />
                    <MapEvents />
                    <FlyToLocation coords={position} />
                </MapContainer>
            </div>
            <p className="text-xs text-eco-gray-medium mt-1">
                * Arrastra el marcador o haz clic en el mapa para ajustar la ubicación.
            </p>
        </div>
    )
}

// Export dynamic component to disable SSR
export default dynamic(() => Promise.resolve(LocationPickerClient), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">
            Cargando mapa...
        </div>
    ),
})
