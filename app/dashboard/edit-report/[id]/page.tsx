"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, MapPin, Loader2, Save } from "lucide-react"

interface Categoria {
    id_categoria: number;
    nombre: string;
}

export default function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { user } = useAuth()

    // Unwrap params using use() hook as per Next.js 15+ new patterns or just await if async component.
    // Since this is a client component, `params` is a Promise in newer Next.js versions.
    // However, in standard Next.js 13/14 App Router, for client components we often need to `use` it or it's passed as prop.
    // The provided code doesn't specify Next version exact nuances but 16 was mentioned.
    // In Next 15+, params is a promise.
    // Let's assume we need to unwrap it.
    const resolvedParams = use(params);
    const reportId = resolvedParams.id;

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const [formData, setFormData] = useState({
        descripcion: "",
        id_categoria: "",
        latitud: "",
        longitud: "",
    })

    useEffect(() => {
        // Fetch categories and report details
        const init = async () => {
            try {
                const catsRes = await api.get('/catalogos/categorias');
                setCategorias(catsRes.data);

                // In a real app we would have a specific GET endpoint for one report or find in list.
                // But we don't have public endpoint for GET /reportes/:id unless we use the public list or admin.
                // Wait, I didn't verify GET /reportes/:id exists for public?
                // ReportController has `findById`? No, `Report.findById` exists but is it exposed?
                // `routes/report.routes.js` does NOT have `GET /:id`.
                // Uh oh. I need to expose `GET /:id`.
                // For now, I'll use `getMyReports` and find it, or add the endpoint.
                // Adding endpoint is cleaner. I will add `GET /:id` in routes. It uses `Report.findById`.

                const reportRes = await api.get(`/reportes/mis-reportes`);
                // Workaround: fetch all my reports and find the one.
                const report = reportRes.data.data.find((r: any) => String(r.id_reporte) === String(reportId));

                if (report) {
                    setFormData({
                        descripcion: report.descripcion,
                        id_categoria: report.id_categoria.toString(),
                        latitud: report.latitud.toString(),
                        longitud: report.longitud.toString()
                    })
                } else {
                    alert("Reporte no encontrado");
                    router.push('/dashboard/mis-reportes');
                }
            } catch (e) {
                console.error(e)
                alert("Error cargando reporte");
            } finally {
                setLoading(false)
            }
        }
        init();
    }, [reportId, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            await api.put(`/reportes/${reportId}`, {
                descripcion: formData.descripcion,
                id_categoria: formData.id_categoria,
                latitud: formData.latitud,
                longitud: formData.longitud
            }); // PUT expects JSON, not FormData (unless I changed `updateReport` to use multer, but I didn't).

            router.push('/dashboard');

        } catch (error) {
            console.error("Error updating report:", error);
            alert("Error al actualizar el reporte.");
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8" /></div>

    return (
        <div className="min-h-screen bg-[#f0f2f5] p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Editar Reporte</h1>
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
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                            id="descripcion"
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
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitud">Longitud</Label>
                            <Input
                                id="longitud"
                                value={formData.longitud}
                                onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-eco-primary hover:bg-eco-primary-dark text-white font-bold h-12 text-lg rounded-xl shadow-lg shadow-eco-primary/20 transition-all hover:scale-[1.02]"
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
