"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Check, X, Eye, Loader2, User } from "lucide-react"

interface Report {
    id_reporte: number
    descripcion: string
    latitud: number
    longitud: number
    estado: string
    id_categoria: number
    usuario_nombre: string
    usuario_apellido: string
    usuario_cedula?: string
    usuario_telefono?: string
    usuario_correo?: string
    imagen?: string
}

export default function AdminDashboard() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState<Report | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.rol !== 'admin') {
                // router.push('/dashboard') // Descomentar para proteger
                // Por ahora lo dejamos abierto para pruebas si el rol no coincide exacto
            }
            fetchPendingReports()
        }
    }, [user, authLoading])

    const fetchPendingReports = async () => {
        try {
            setLoading(true)
            const res = await api.get('/reportes/pendientes')
            setReports(res.data.data)
        } catch (error) {
            console.error("Error fetching admin reports:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: number, verifyStatus: 'Aprobado' | 'Rechazado') => {
        try {
            setActionLoading(true)
            // Determine 'es_publico': true if approved, false if rejected
            const esPublico = verifyStatus === 'Aprobado'

            await api.put(`/reportes/admin/${id}`, {
                estado: verifyStatus,
                es_publico: esPublico
            })

            // Remove from list
            setReports(prev => prev.filter(r => r.id_reporte !== id))
            setSelectedReport(null)
        } catch (error) {
            console.error("Error updating status:", error)
            alert("Error al actualizar el estado")
        } finally {
            setActionLoading(false)
        }
    }

    if (authLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Alertas Pendientes de Aprobación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-8 text-center text-gray-500">Cargando reportes...</div>
                        ) : reports.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">No hay alertas pendientes.</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.map((report) => (
                                        <TableRow key={report.id_reporte}>
                                            <TableCell className="font-medium">#{report.id_reporte}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{report.usuario_nombre} {report.usuario_apellido}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md truncate" title={report.descripcion}>
                                                {report.descripcion}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{report.id_categoria}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                    {report.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="ghost" onClick={() => setSelectedReport(report)}>
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleUpdateStatus(report.id_reporte, 'Aprobado')}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleUpdateStatus(report.id_reporte, 'Rechazado')}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal de Detalle */}
            <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detalle del Reporte #{selectedReport?.id_reporte}</DialogTitle>
                        <DialogDescription>Revisa los detalles antes de aprobar o rechazar.</DialogDescription>
                    </DialogHeader>

                    {selectedReport && (
                        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Información del Usuario */}
                            <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
                                        <User className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">
                                            {selectedReport.usuario_nombre} {selectedReport.usuario_apellido}
                                        </p>
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Autor del Reporte</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                    <div className="bg-white p-2 rounded border">
                                        <span className="block text-xs text-gray-400 font-medium">Cédula</span>
                                        <span className="font-medium text-gray-700">{selectedReport.usuario_cedula || 'No registrada'}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border">
                                        <span className="block text-xs text-gray-400 font-medium">Teléfono</span>
                                        <span className="font-medium text-gray-700">{selectedReport.usuario_telefono || 'No registrado'}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border sm:col-span-1">
                                        <span className="block text-xs text-gray-400 font-medium">Correo</span>
                                        <span className="font-medium text-gray-700 break-all">{selectedReport.usuario_correo || 'No registrado'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Evidencia (Foto) */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    Evidencia Fotográfica
                                </h4>
                                {selectedReport.imagen ? (
                                    <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${selectedReport.imagen}`}
                                            alt="Evidencia del reporte"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-32 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                                        Sin evidencia fotográfica
                                    </div>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700">Descripción de la Alerta</h4>
                                <div className="bg-white p-4 border rounded-lg shadow-sm">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                        {selectedReport.descripcion}
                                    </p>
                                </div>
                            </div>

                            {/* Detalles Técnicos */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Ubicación (Coordenadas)</h4>
                                    <div className="bg-gray-50 p-2 rounded border font-mono text-xs text-gray-600">
                                        Lat: {selectedReport.latitud}<br />
                                        Lng: {selectedReport.longitud}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Categoría</h4>
                                    <div className="bg-gray-50 p-2 rounded border text-sm font-medium text-gray-700">
                                        ID: {selectedReport.id_categoria}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="destructive"
                            onClick={() => selectedReport && handleUpdateStatus(selectedReport.id_reporte, 'Rechazado')}
                            disabled={actionLoading}
                        >
                            Rechazar
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => selectedReport && handleUpdateStatus(selectedReport.id_reporte, 'Aprobado')}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                            Aprobar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
