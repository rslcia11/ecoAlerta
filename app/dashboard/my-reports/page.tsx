"use client"

import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    AlertCircle,
    ArrowLeft,
    MapPin,
    Edit,
    Trash2,
    MoreVertical,
    Dog,
    Flame,
    TreePine,
    Droplets,
    Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Report {
    id: number
    descripcion: string
    categoria: string
    ubicacion: string
    fecha: string
    estado: string
    imagen?: string
}

const CATEGORY_MAP: Record<number, string> = {
    1: "basura",
    2: "deforestacion",
    3: "contaminacion",
    4: "ruido",
    5: "fauna",
    6: "aire",
    7: "infraestructura"
};

const CATEGORY_NAMES: Record<string, string> = {
    basura: "Vertido de basura ilegal",
    deforestacion: "Tala de árboles",
    contaminacion: "Contaminación de río o quebrada",
    ruido: "Ruido excesivo",
    fauna: "Fauna urbana herida",
    aire: "Contaminación del aire",
    infraestructura: "Infraestructura en mal estado"
};

const iconosCategoria: Record<string, any> = {
    fauna: Dog,
    basura: Trash2,
    quema: Flame,
    deforestacion: TreePine,
    contaminacion: Droplets,
    ruido: AlertCircle,
    aire: AlertCircle,
    infraestructura: Home
}

const coloresEstado: Record<string, string> = {
    "por aprobar": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Aprobado": "bg-green-100 text-green-700 border-green-200",
    "Rechazado": "bg-red-100 text-red-700 border-red-200",
    "en progreso": "bg-blue-100 text-blue-700 border-blue-200",
    "culminado": "bg-gray-100 text-gray-700 border-gray-200",
}

// Función para formatear tiempo relativo
import { cleanLocationName } from "@/lib/utils"

function formatRelativeTime(dateString: string): string {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    return date.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function MyReportsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMyReports = async () => {
            try {
                const res = await api.get('/reportes/mis-reportes');
                const mappedReports = res.data.data.map((r: any) => ({
                    id: r.id_reporte,
                    descripcion: r.descripcion,
                    categoria: CATEGORY_MAP[r.id_categoria] || "general",
                    ubicacion: cleanLocationName(r.ubicacion) || `Lat: ${r.latitud}, Lng: ${r.longitud}`,
                    fecha: formatRelativeTime(r.creado_en),
                    estado: r.estado,
                    imagen: r.imagen ? `${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${r.imagen}` : undefined,
                }));
                setReports(mappedReports);
            } catch (error) {
                console.error("Error fetching my reports:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyReports();
        }
    }, [user]);

    const deleteReport = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este reporte?")) return;
        try {
            await api.delete(`/reportes/${id}`);
            setReports(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error al eliminar", error);
            alert("No se pudo eliminar el reporte");
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5]">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-gray-900">Mis Reportes</h1>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-primary"></div>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes reportes</h3>
                        <p className="text-gray-500 mb-4">Aún no has creado ningún reporte ambiental.</p>
                        <Button asChild className="bg-eco-primary hover:bg-eco-primary-dark">
                            <Link href="/dashboard/new-report">Crear mi primer reporte</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-gray-600">
                                Tienes <span className="font-bold text-eco-primary">{reports.length}</span> {reports.length === 1 ? 'reporte' : 'reportes'}
                            </p>
                        </div>

                        {reports.map((report) => {
                            const IconoCategoria = iconosCategoria[report.categoria] || AlertCircle;
                            return (
                                <div key={report.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                                    <div className="p-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-eco-primary/10 rounded-full flex items-center justify-center">
                                                    <IconoCategoria className="w-5 h-5 text-eco-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{CATEGORY_NAMES[report.categoria] || report.categoria}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{report.fecha}</span>
                                                        <span>•</span>
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{report.ubicacion}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={coloresEstado[report.estado] || "bg-gray-100 text-gray-700"}>
                                                    {report.estado}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/dashboard/edit-report/${report.id}`)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => deleteReport(report.id)} className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-700 mb-3">{report.descripcion}</p>

                                        {/* Image */}
                                        {report.imagen && (
                                            <img
                                                src={report.imagen}
                                                alt="Imagen del reporte"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
