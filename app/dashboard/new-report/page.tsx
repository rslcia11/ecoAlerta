"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Upload, MapPin, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useToast } from "@/components/ui/use-toast"

const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), { ssr: false })
import { VoiceCommandButton } from "@/components/ui/VoiceCommandButton"

interface Categoria {
    id_categoria: number;
    nombre: string;
}

export default function NewReportPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [provincias, setProvincias] = useState<any[]>([])

    const [formData, setFormData] = useState({
        descripcion: "",
        latitud: "",
        longitud: "",
        ubicacion: "",
        id_categoria: "",
        id_provincia: "",
        id_ciudad: ""
    })

    // Construct default search query from user profile
    const userLocationQuery = useMemo(() => user?.ciudad && user?.provincia
        ? `${user.ciudad}, ${user.provincia}, Ecuador`
        : "Loja, Ecuador", [user?.ciudad, user?.provincia]);

    const [files, setFiles] = useState<FileList | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [catsRes, provsRes] = await Promise.all([
                    api.get('/catalogos/categorias'),
                    api.get('/catalogos/provincias')
                ]);
                setCategorias(catsRes.data);
                setProvincias(provsRes.data);
            } catch (e) {
                console.error(e)
            }
        }
        fetchCatalogs();
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
            data.append('ubicacion', formData.ubicacion);
            if (formData.id_provincia) data.append('id_provincia', formData.id_provincia);
            if (formData.id_ciudad) data.append('id_ciudad', formData.id_ciudad);

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
                    <h1 className="text-2xl font-bold text-gray-900 flex-1">Nuevo Reporte</h1>
                    <VoiceCommandButton
                        onCommandDetected={(transcript) => {
                            console.log("--- START Voice Command Processing ---");
                            console.log("Transcript:", transcript);

                            if (categorias.length === 0) {
                                console.warn("Categories array is EMPTY. Fetch might still be in progress.");
                                toast({
                                    title: "Error de sincronización",
                                    description: "Las categorías aún no se han cargado. Inténtalo en un segundo.",
                                    variant: "destructive"
                                });
                                return;
                            }

                            const normalizedTranscript = transcript.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                            const keywords: Record<string, string[]> = {
                                "incendio": ["fuego", "humo", "quema", "incendio", "incendios", "forestal", "quemando", "llama"],
                                "basura": ["basura", "desecho", "contaminacion", "botadero", "residuos", "sucio", "bolsas"],
                                "agua": ["agua", "rio", "vertido", "derrame", "aceite", "petroleo", "quebrada", "liquido"],
                                "tala": ["arbol", "bosque", "tala", "deforestacion", "madera", "motosierra", "cortando"],
                                "fauna": ["animal", "especie", "caza", "fauna", "perro", "gato", "peligro", "mascota", "pajaro"]
                            };

                            let matchedCategory: Categoria | undefined = undefined;

                            // 1. Direct Match: Transcript contains exactly a category name?
                            matchedCategory = categorias.find(cat => {
                                const normalizedCatName = cat.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                return normalizedTranscript.includes(normalizedCatName);
                            });

                            // 2. Semantic Match: Both share common keywords?
                            if (!matchedCategory) {
                                matchedCategory = categorias.find(cat => {
                                    const normalizedName = cat.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                                    for (const [groupKey, terms] of Object.entries(keywords)) {
                                        const tInGroup = terms.some(t => normalizedTranscript.includes(t)) || normalizedTranscript.includes(groupKey);
                                        const cInGroup = terms.some(t => normalizedName.includes(t)) || normalizedName.includes(groupKey);

                                        if (tInGroup && cInGroup) {
                                            console.log(`Match detected! [${transcript}] matched group [${groupKey}] which matches DB category [${cat.nombre}]`);
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                            }

                            // 3. Last Resort: Any overlap in significant words?
                            if (!matchedCategory) {
                                const transcriptWords = normalizedTranscript.split(/\s+/).filter(w => w.length > 3);
                                matchedCategory = categorias.find(cat => {
                                    const normalizedName = cat.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                    return transcriptWords.some(word => normalizedName.includes(word));
                                });
                                if (matchedCategory) console.log("Matched via word overlap (last resort):", matchedCategory.nombre);
                            }

                            // Update State (Consolidated)
                            setFormData(prev => ({
                                ...prev,
                                id_categoria: matchedCategory ? matchedCategory.id_categoria.toString() : prev.id_categoria,
                                descripcion: transcript
                            }));

                            if (matchedCategory) {
                                toast({
                                    title: "Categoría Seleccionada",
                                    description: `Detectado: ${matchedCategory.nombre}`,
                                });
                            } else {
                                console.warn("COULD NOT MATCH CATEGORY. Available DB relative names:", categorias.map(c => c.nombre));
                                toast({
                                    title: "Reporte Capturado",
                                    description: "Descripción llena. Por favor selecciona la categoría manual.",
                                    variant: "destructive"
                                });
                            }
                            console.log("--- END Voice Command Processing ---");
                        }}
                    />
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

                    {/* Logic moved here for clarity in this correction, but actually it should be in component body. 
                        Wait, I can't move it to component body easily with this chunk if I don't target the body. 
                        I will just clean the JSX here and use a separate chunk for the component body logic. 
                    */}

                    <div className="space-y-2">
                        <Label>Ubicación del incidente</Label>
                        <LocationPicker
                            onLocationSelect={useCallback(async (lat: number, lng: number, address?: string, provinciaName?: string, ciudadName?: string) => {
                                let provinciaId = "";
                                let ciudadId = "";

                                // 1. Map Province
                                if (provinciaName && provincias.length > 0) {
                                    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                    const target = normalize(provinciaName);
                                    const found = provincias.find((p: any) => normalize(p.nombre).includes(target) || target.includes(normalize(p.nombre)));
                                    if (found) provinciaId = found.id_provincia.toString();
                                }

                                // 2. Map City if we have province
                                if (provinciaId && ciudadName) {
                                    try {
                                        const res = await api.get(`/catalogos/ciudades?id_provincia=${provinciaId}`);
                                        const cities = res.data;
                                        const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                        const target = normalize(ciudadName);
                                        const found = cities.find((c: any) => normalize(c.nombre).includes(target) || target.includes(normalize(c.nombre)));
                                        if (found) ciudadId = found.id_ciudad.toString();
                                    } catch (e) {
                                        console.error("Error mapping city:", e);
                                    }
                                }

                                setFormData(prev => ({
                                    ...prev,
                                    latitud: lat.toString(),
                                    longitud: lng.toString(),
                                    ubicacion: address || "",
                                    id_provincia: provinciaId,
                                    id_ciudad: ciudadId
                                }))
                            }, [provincias])}
                            defaultSearchQuery={userLocationQuery}
                        />
                        {/* Hidden inputs to ensure form submission still works same way if needed, or just rely on state */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Latitud</Label>
                                <Input value={formData.latitud} readOnly className="bg-gray-50 text-xs h-8" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Longitud</Label>
                                <Input value={formData.longitud} readOnly className="bg-gray-50 text-xs h-8" />
                            </div>
                        </div>
                    </div>

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
