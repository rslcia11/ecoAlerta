"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import dynamic from "next/dynamic"
import { Search, Loader2 } from "lucide-react"
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

interface LocationPickerProps {
    initialLat?: number
    initialLng?: number
    defaultSearchQuery?: string // e.g. "Loja, Ecuador"
    onLocationSelect: (lat: number, lng: number) => void
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
    const mapRef = useRef<LeafletMap | null>(null)

    // Map events to handle click/drag
    const MapEvents = () => {
        useMapEvents({
            click(e: any) {
                setPosition([e.latlng.lat, e.latlng.lng])
                onLocationSelect(e.latlng.lat, e.latlng.lng)
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

    // Initial geocoding if defaultSearchQuery is provided and no initial coords
    useEffect(() => {
        if (!initialLat && !initialLng && defaultSearchQuery) {
            searchLocation(defaultSearchQuery);
        }
    }, [defaultSearchQuery]); // Run once if query provided

    const searchLocation = async (query: string) => {
        if (!query) return
        setSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
            )
            const data = await response.json()
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat)
                const lon = parseFloat(data[0].lon)
                setPosition([lat, lon])
                onLocationSelect(lat, lon)
            }
        } catch (error) {
            console.error("Error geocoding:", error)
        } finally {
            setSearching(false)
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
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        const { lat, lng } = marker.getLatLng()
                        setPosition([lat, lng])
                        onLocationSelect(lat, lng)
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
