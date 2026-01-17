"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Upload, MapPin, Loader2 } from "lucide-react"

interface Categoria {
    id_categoria: number;
    nombre: string;
}

export default function NewReportPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const [formData, setFormData] = useState({
        descripcion: "",
        id_categoria: "",
        latitud: "",
        longitud: "",
    })

    const [files, setFiles] = useState<FileList | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        // Fetch categories
        const fetchCats = async () => {
            try {
                const res = await api.get('/catalogos/categorias');
                setCategorias(res.data);
            } catch (e) {
                console.error(e)
            }
        }
        fetchCats();

        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFormData(prev => ({
                        ...prev,
                        latitud: pos.coords.latitude.toString(),
                        longitud: pos.coords.longitude.toString()
                    }))
                },
                (err) => console.error("Error obteniendo ubicación", err)
            )
        }
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(e.target.files)
            setPreviewUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData();
            data.append('descripcion', formData.descripcion);
            data.append('id_categoria', formData.id_categoria);
            data.append('latitud', formData.latitud);
            data.append('longitud', formData.longitud);

            if (files) {
                for (let i = 0; i < files.length; i++) {
                    data.append('archivos', files[i]);
                }
            }

            await api.post('/reportes', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            router.push('/dashboard');

        } catch (error) {
            console.error("Error creating report:", error);
            alert("Error al crear el reporte. Verifica los datos.");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5] p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Nuevo Reporte</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select
                            value={formData.id_categoria}
                            onValueChange={(val) => setFormData({ ...formData, id_categoria: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categorias.map(cat => (
                                    <SelectItem key={cat.id_categoria} value={cat.id_categoria.toString()}>
                                        {cat.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción del problema</Label>
                        <Textarea
                            id="descripcion"
                            placeholder="Describe detalladamente qué está sucediendo..."
                            className="resize-none min-h-[120px]"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitud">Latitud</Label>
                            <Input
                                id="latitud"
                                value={formData.latitud}
                                onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                                placeholder="-4.000"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitud">Longitud</Label>
                            <Input
                                id="longitud"
                                value={formData.longitud}
                                onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                                placeholder="-79.200"
                                required
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Ubicación detectada automáticamente (puedes editarla)
                    </p>

                    <div className="space-y-2">
                        <Label>Evidencia fotográfica</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <Upload className="w-8 h-8" />
                                    <span className="text-sm">Arrastra fotos o haz clic para subir</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-eco-primary hover:bg-eco-primary-dark text-white font-bold h-12 text-lg rounded-xl shadow-lg shadow-eco-primary/20 transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            Publicar Reporte
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
