"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserAvatar } from "@/components/ui/UserAvatar"
import { Loader2, Save, X, Edit2, MapPin, Phone, Mail, CreditCard, User as UserIcon, Calendar, Camera, ShieldCheck, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import Link from "next/link"

interface Provincia {
    id_provincia: number;
    nombre: string;
}

interface Ciudad {
    id_ciudad: number;
    nombre: string;
}

interface UserProfile {
    id_usr: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    cedula: string;
    telefono: string;
    id_ciudad: number;
    ciudad_nombre?: string;
    provincia_nombre?: string;
    id_provincia?: number;
    creado_en?: string; // Assuming we might have this, strictly optional
}

export default function ProfilePage() {
    const { user: authUser } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [provincias, setProvincias] = useState<Provincia[]>([])
    const [ciudades, setCiudades] = useState<Ciudad[]>([])

    const [formData, setFormData] = useState({
        telefono: "",
        id_provincia: "",
        id_ciudad: ""
    })

    // Fetch Profile
    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await api.get('/usuarios/profile')
            if (res.data.success) {
                const data = res.data.data
                setProfile(data)
                setFormData({
                    telefono: data.telefono || "",
                    id_provincia: data.id_provincia?.toString() || "",
                    id_ciudad: data.id_ciudad?.toString() || ""
                })
                if (data.id_provincia) {
                    fetchCiudades(data.id_provincia)
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        } finally {
            setLoading(false)
        }
    }

    // Fetch Provincias
    useEffect(() => {
        const fetchProvincias = async () => {
            try {
                const res = await api.get('/catalogos/provincias')
                setProvincias(res.data)
            } catch (error) {
                console.error("Error fetching provincias:", error)
            }
        }
        fetchProvincias()
    }, [])

    const fetchCiudades = async (idProvincia: string | number) => {
        if (!idProvincia) {
            setCiudades([])
            return
        }
        try {
            const res = await api.get(`/catalogos/ciudades?id_provincia=${idProvincia}`)
            setCiudades(res.data)
        } catch (error) {
            console.error("Error fetching ciudades:", error)
            setCiudades([])
        }
    }

    const handleProvinceChange = (value: string) => {
        setFormData(prev => ({ ...prev, id_provincia: value, id_ciudad: "" }))
        fetchCiudades(value)
    }

    const handleSave = async () => {
        if (!formData.telefono || !formData.id_ciudad) {
            toast({
                title: "Campos requeridos",
                description: "Por favor completa tu teléfono y ciudad.",
                variant: "destructive",
            })
            return
        }

        setSaving(true)
        try {
            const res = await api.put('/usuarios/profile', {
                telefono: formData.telefono,
                id_ciudad: parseInt(formData.id_ciudad)
            })

            if (res.data.success) {
                setProfile(prev => prev ? {
                    ...prev,
                    telefono: formData.telefono,
                    id_ciudad: parseInt(formData.id_ciudad),
                    // We'd ideally need updated city/prov names here, but a refresh works too
                } : null)

                await fetchProfile()
                setIsEditing(false)
                toast({
                    title: "¡Perfil actualizado!",
                    description: "Tu información se ha guardado correctamente.",
                    className: "bg-green-50 border-green-200 text-green-800",
                })
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast({
                title: "Error",
                description: "No pudimos guardar los cambios. Intenta de nuevo.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (profile) {
            setFormData({
                telefono: profile.telefono || "",
                id_provincia: profile.id_provincia?.toString() || "",
                id_ciudad: profile.id_ciudad?.toString() || ""
            })
            if (profile.id_provincia) {
                fetchCiudades(profile.id_provincia)
            }
        }
        setIsEditing(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-eco-primary" />
            </div>
        )
    }

    if (!profile) return null

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Navigation Overlay */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/dashboard">
                    <Button variant="ghost" className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 rounded-full py-2 px-4 shadow-lg transition-all hover:scale-105 active:scale-95 group">
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Volver al inicio</span>
                    </Button>
                </Link>
            </div>

            {/* Cover Image & Header Area */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600 via-eco-primary to-teal-500 overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-visible"
                >
                    {/* Top Section with Avatar */}
                    <div className="px-6 md:px-10 pt-2 pb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12 gap-6">
                            <div className="relative group">
                                <div className="p-1.5 bg-white rounded-full shadow-sm">
                                    <UserAvatar
                                        nombre={profile.nombre}
                                        apellido={profile.apellido}
                                        avatarUrl={authUser?.avatar}
                                        className="w-32 h-32 md:w-36 md:h-36 text-4xl border-4 border-white shadow-md transition-transform group-hover:scale-105"
                                    />
                                </div>
                                {/* Optional: Edit Avatar Button (Visual Only for now) */}
                                <button className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 text-center md:text-left mb-2">
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    {profile.nombre} {profile.apellido}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-gray-500">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        {profile.rol || "Usuario"}
                                    </span>
                                    <span className="flex items-center text-sm">
                                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                        {profile.ciudad_nombre || "Ciudad"}, {profile.provincia_nombre || "Provincia"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                                {!isEditing ? (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 md:flex-none bg-gray-900 hover:bg-gray-800 text-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Editar Perfil
                                    </Button>
                                ) : (
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex-1 bg-eco-primary hover:bg-eco-primary-dark text-white shadow-sm"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                            Guardar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                            {/* Left Column: Stats or Summary (Optional, placeholder for now) */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Sobre mí</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                <Mail className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="font-medium truncate" title={profile.correo}>{profile.correo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                                <CreditCard className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Cédula</p>
                                                <p className="font-medium">{profile.cedula}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                <Calendar className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Miembro desde</p>
                                                <p className="font-medium">2024</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Editable Forms */}
                            <div className="lg:col-span-2 space-y-6">
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">Información de Contacto</h2>
                                        {isEditing && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Modo Edición</span>}
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Phone Field */}
                                            <div className="col-span-1 md:col-span-2">
                                                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                                    Número de Teléfono
                                                </Label>
                                                {isEditing ? (
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            value={formData.telefono}
                                                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })}
                                                            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                            placeholder="0999999999"
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-900 font-medium flex items-center gap-2 py-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {profile.telefono || "Sin registrar"}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Province Field */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                                    Provincia
                                                </Label>
                                                {isEditing ? (
                                                    <Select value={formData.id_provincia} onValueChange={handleProvinceChange}>
                                                        <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                                                            <SelectValue placeholder="Selecciona provincia" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {provincias.map(p => (
                                                                <SelectItem key={p.id_provincia} value={p.id_provincia.toString()}>
                                                                    {p.nombre}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-gray-900 font-medium py-2 border-b border-gray-100">
                                                        {profile.provincia_nombre || "No definida"}
                                                    </p>
                                                )}
                                            </div>

                                            {/* City Field */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                                    Ciudad
                                                </Label>
                                                {isEditing ? (
                                                    <Select
                                                        value={formData.id_ciudad}
                                                        onValueChange={(val) => setFormData({ ...formData, id_ciudad: val })}
                                                        disabled={!formData.id_provincia}
                                                    >
                                                        <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                                                            <SelectValue placeholder="Selecciona ciudad" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {ciudades.map(c => (
                                                                <SelectItem key={c.id_ciudad} value={c.id_ciudad.toString()}>
                                                                    {c.nombre}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-gray-900 font-medium py-2 border-b border-gray-100">
                                                        {profile.ciudad_nombre || "No definida"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
