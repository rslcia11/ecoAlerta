"use client"

import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Plus,
  Bell,
  Settings,
  LogOut,
  MapPin,
  ThumbsUp,
  MessageSquare,
  Search,
  User,
  ShieldCheck,
  Flame,
  Trash2,
  TreePine,
  Dog,
  Droplets,
  Home,
  TrendingUp,
  Award,
  BarChart3,
  Edit,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserAvatar } from "@/components/ui/UserAvatar"
import { CommentsModal } from "@/components/dashboard/CommentsModal"
import { formatRelativeTime, cleanLocationName } from "@/lib/utils"

// Tipos para las alertas
interface Alert {
  id: number
  titulo: string
  descripcion: string
  categoria: string
  ubicacion: string
  fecha: string
  autor: string
  imagen?: string
  likes: number
  comentarios: number
  vistas: number
  estado: "activo" | "en_proceso" | "resuelto" | "rechazado"
  id_usuario?: number
  liked_by_me?: boolean
  ubicacion_nombre?: string
}

// Datos de ejemplo de alertas
const alertasEjemplo: Alert[] = [
  {
    id: 1,
    titulo: "Acumulación de basura en Río Zamora",
    descripcion: "Gran cantidad de desechos plásticos en la orilla del río, necesita limpieza urgente.",
    categoria: "basura",
    ubicacion: "Río Zamora, Sector La Tebaida",
    fecha: "Hace 2 horas",
    autor: "María González",
    imagen: "/basura-rio.jpg",
    likes: 23,
    comentarios: 8,
    vistas: 156,
    estado: "activo",
  },
  {
    id: 2,
    titulo: "Perro abandonado en Parque Jipiro",
    descripcion: "Cachorro en condiciones precarias, necesita rescate inmediato.",
    categoria: "fauna",
    ubicacion: "Parque Jipiro, entrada principal",
    fecha: "Hace 5 horas",
    autor: "Carlos Ruiz",
    imagen: "/perro-abandonado.jpg",
    likes: 45,
    comentarios: 15,
    vistas: 289,
    estado: "en_proceso",
  },
  {
    id: 3,
    titulo: "Quema de basura en sector periférico",
    descripcion: "Quema indiscriminada de residuos generando contaminación del aire.",
    categoria: "quema",
    ubicacion: "Barrio Pueblo Nuevo",
    fecha: "Hace 1 día",
    autor: "Ana Martínez",
    imagen: "/quema-basura.jpg",
    likes: 67,
    comentarios: 22,
    vistas: 412,
    estado: "resuelto",
  },
  {
    id: 4,
    titulo: "Deforestación en área protegida",
    descripcion: "Tala ilegal de árboles en zona de conservación.",
    categoria: "deforestacion",
    ubicacion: "Loma de Púcara",
    fecha: "Hace 3 horas",
    autor: "Pedro Sánchez",
    imagen: "/deforestacion.jpg",
    likes: 89,
    comentarios: 34,
    vistas: 523,
    estado: "activo",
  },
]

const CATEGORY_MAP: Record<number, string> = {
  1: "basura",           // Vertido de basura ilegal
  2: "deforestacion",    // Tala de árboles
  3: "contaminacion",    // Contaminación de río o quebrada
  4: "ruido",            // Ruido excesivo
  5: "fauna",            // Fauna urbana herida
  6: "aire",             // Contaminación del aire
  7: "infraestructura"   // Infraestructura en mal estado
};

// Iconos por categoría (Map keys to IDs for easier lookup or mapped strings)
const iconosCategoria: Record<string, any> = {
  fauna: Dog,
  basura: Trash2,
  quema: Flame,
  deforestacion: TreePine,
  contaminacion: Droplets,
  ruido: AlertCircle, // Fallback
  aire: AlertCircle, // Fallback
  infraestructura: Home // Fallback
}

// Colores por estado
const coloresEstado: Record<string, string> = {
  activo: "bg-eco-error/10 text-eco-error border-eco-error/20",
  en_proceso: "bg-eco-warning/10 text-eco-warning border-eco-warning/20",
  resuelto: "bg-eco-success/10 text-eco-success border-eco-success/20",
  rechazado: "bg-gray-100 text-gray-500 border-gray-200",
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  // No longer needed local state for user, usage context

  const [alertas, setAlertas] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas")
  const [filtroProvincia, setFiltroProvincia] = useState<string>("todas")
  const [filtroCiudad, setFiltroCiudad] = useState<string>("todas")
  const [smartFiltersActive, setSmartFiltersActive] = useState(true)
  const [smartStatus, setSmartStatus] = useState<string>("")
  const [provincias, setProvincias] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [userStats, setUserStats] = useState({ totalReportes: 0, activos: 0 })
  const [activeTab, setActiveTab] = useState<"feed" | "tendencias" | "estadisticas">("feed")
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null)
  const [trendingReports, setTrendingReports] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [reportesHoy, setReportesHoy] = useState(0)

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const res = await api.get('/catalogos/provincias');
        setProvincias(res.data);
      } catch (e) {
        console.error(e)
      }
    }
    fetchProvincias();
  }, [])

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        let cityReports = [];
        let provinceReports = [];
        let allReports = [];

        // Determine current filter targets
        let targetProvincia = filtroProvincia;
        let targetCiudad = filtroCiudad;

        // If smart filters are on and no manual filter is set, use user location
        if (smartFiltersActive && user && filtroProvincia === "todas" && filtroCiudad === "todas") {
          // 1. Try City
          if (user.id_ciudad) {
            const resCity = await api.get(`/reportes/publicos?id_ciudad=${user.id_ciudad}`);
            cityReports = resCity.data.data;
            if (cityReports.length > 0) {
              setSmartStatus(`Mostrando reportes de tu ciudad: ${user.ciudad_nombre || user.ciudad || 'Local'}`);
              setAlertas(mapReports(cityReports));
              setLoading(false);
              return;
            }
          }

          // 2. Try Province
          if (user.id_provincia) {
            const resProv = await api.get(`/reportes/publicos?id_provincia=${user.id_provincia}`);
            provinceReports = resProv.data.data;
            if (provinceReports.length > 0) {
              setSmartStatus(`No hay reportes en tu ciudad. Mostrando tu provincia: ${user.provincia_nombre || user.provincia || 'Local'}`);
              setAlertas(mapReports(provinceReports));
              setLoading(false);
              return;
            }
          }

          // 3. Fallback to All
          const resAll = await api.get('/reportes/publicos');
          allReports = resAll.data.data;
          setSmartStatus("No hay reportes cercanos. Mostrando todos los reportes públicos.");
          setAlertas(mapReports(allReports));
        } else {
          // Manual filtering or Guest mode
          setSmartStatus("");
          let url = '/reportes/publicos';
          const params = new URLSearchParams();
          if (filtroProvincia !== "todas") params.append('id_provincia', filtroProvincia);
          if (filtroCiudad !== "todas") params.append('id_ciudad', filtroCiudad);

          const queryStr = params.toString();
          const res = await api.get(url + (queryStr ? `?${queryStr}` : ''));
          setAlertas(mapReports(res.data.data));
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    const mapReports = (data: any[]) => {
      return data.map((r: any) => ({
        id: r.id_reporte,
        titulo: r.descripcion ? r.descripcion.substring(0, 50) + "..." : "Reporte sin título",
        descripcion: r.descripcion,
        categoria: CATEGORY_MAP[r.id_categoria] || "general",
        ubicacion: cleanLocationName(r.ubicacion) || `Lat: ${r.latitud}, Lng: ${r.longitud}`,
        fecha: formatRelativeTime(r.creado_en),
        autor: `${r.autor_nombre || 'Anónimo'} ${r.autor_apellido || ''}`,
        imagen: r.imagen ? `${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${r.imagen}` : undefined,
        likes: r.likes || 0,
        comentarios: r.comentarios || 0,
        vistas: r.vistas || 0,
        liked_by_me: !!r.liked_by_me,
        estado: (r.estado === 'Aprobado') ? 'activo' as any
          : (r.estado === 'Pendiente' || r.estado === 'por aprobar') ? 'en_proceso' as any
            : (r.estado === 'Rechazado') ? 'rechazado' as any
              : 'resuelto' as any,
        id_usuario: r.id_usr
      }));
    };

    const fetchUserStats = async () => {
      try {
        const res = await api.get('/reportes/mis-stats');
        if (res.data.success) {
          setUserStats(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    const fetchTodayCount = async () => {
      try {
        const res = await api.get('/reportes/hoy');
        if (res.data.success) {
          setReportesHoy(res.data.data.reportesHoy);
        }
      } catch (error) {
        console.error("Error fetching today count:", error);
      }
    };

    fetchReports();
    if (user) fetchUserStats();
    fetchTodayCount();
  }, [user, filtroProvincia, filtroCiudad, smartFiltersActive]);

  // Fetch trending when tab changes
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/trending?limit=10');
        if (res.data.success) {
          setTrendingReports(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching trending:", error);
      }
    };

    if (activeTab === "tendencias") {
      fetchTrending();
    }
  }, [activeTab]);

  // Fetch notifications when tab changes
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notificaciones');
        if (res.data.success) {
          setNotifications(res.data.data.notifications);
          setUnreadCount(res.data.data.unreadCount);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (activeTab === "estadisticas" && user) {
      fetchNotifications();
    }
  }, [activeTab, user]);

  const handleLogout = () => {
    logout()
  }

  const deleteReport = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este reporte?")) return;
    try {
      await api.delete(`/reportes/${id}`);
      setAlertas(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error al eliminar", error);
      alert("No se pudo eliminar el reporte");
    }
  }

  const handleLike = async (reportId: number) => {
    if (!user) {
      alert("Debes iniciar sesión para dar me gusta");
      return;
    }
    try {
      const res = await api.post(`/reportes/${reportId}/like`);
      if (res.data.success) {
        const { liked, likes } = res.data.data;
        // Update alertas with new like count and status
        setAlertas(prev => prev.map(a =>
          a.id === reportId ? { ...a, likes, liked_by_me: liked } : a
        ));
        // Update trendingReports too
        setTrendingReports(prev => prev.map(r =>
          r.id_reporte === reportId ? { ...r, likes, liked_by_me: liked } : r
        ));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  const handleMarkRead = async (notificationId: number) => {
    try {
      await api.put(`/notificaciones/${notificationId}/read`);
      setNotifications(prev => prev.map(n =>
        n.id_notificacion === notificationId ? { ...n, leido: 1 } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking read:", error);
    }
  }

  // Filtrar alertas
  const alertasFiltradas = alertas.filter((alerta) => {
    // Standard filters
    const coincideCategoria = filtroCategoria === "todas" || alerta.categoria === filtroCategoria
    const coincideBusqueda =
      alerta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.ubicacion.toLowerCase().includes(busqueda.toLowerCase())

    return coincideCategoria && coincideBusqueda
  })

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo y búsqueda */}
            <div className="flex items-center gap-4 flex-1">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-eco-primary rounded-xl flex items-center justify-center shadow-md shadow-eco-primary/10">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </Link>

              <div className="relative max-w-md w-full hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar en Eco Alerta..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 h-10 bg-[#f0f2f5] border-none rounded-full"
                />
              </div>
            </div>

            {/* Acciones centrales */}
            <div className="flex items-center gap-2 justify-center flex-1">
              <Button variant="ghost" size="icon" className="w-28 h-12 rounded-lg hover:bg-gray-100 text-eco-primary">
                <Home className="w-6 h-6" />
              </Button>
            </div>

            {/* Acciones del usuario */}
            <div className="flex items-center gap-2 justify-end flex-1">
              <Button asChild className="bg-eco-primary hover:bg-eco-primary-dark text-white font-semibold rounded-lg">
                <Link href="/dashboard/new-report">
                  <Plus className="w-5 h-5 mr-2" />
                  Crear
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 w-10 h-10 rounded-full">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-eco-error rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-gray-100 rounded-full p-1 transition-colors">
                    <UserAvatar
                      nombre={user?.nombre}
                      apellido={user?.apellido}
                      avatarUrl={user?.avatar}
                      className="w-10 h-10 border-2 border-eco-primary"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="pb-0">
                    <div className="flex items-center gap-3 py-2">
                      <UserAvatar
                        nombre={user?.nombre}
                        apellido={user?.apellido}
                        avatarUrl={user?.avatar}
                        className="w-12 h-12"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{user?.nombre || "Usuario"} {user?.apellido || ""}</p>
                        <p className="text-xs text-gray-500">{user?.rol || "Invitado"}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Ver perfil
                    </Link>
                  </DropdownMenuItem>
                  {user?.rol === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin" className="cursor-pointer text-blue-600 font-medium">
                          <Award className="w-4 h-4 mr-2" />
                          Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-eco-error cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Sidebar izquierdo */}
          <aside className="col-span-12 lg:col-span-3 space-y-2">
            <div className="sticky top-20">
              {/* Perfil del usuario */}
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <UserAvatar
                  nombre={user?.nombre}
                  apellido={user?.apellido}
                  avatarUrl={user?.avatar}
                  className="w-9 h-9"
                />
                <span className="font-semibold text-gray-900">{user?.nombre || "Usuario"}</span>
              </Link>

              {/* Navegación */}
              <div className="space-y-1 mt-2">
                {user?.rol === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors w-full text-left border border-blue-100 bg-blue-50 mb-2"
                  >
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-blue-800">Panel Admin</span>
                  </Link>
                )}

                <button
                  onClick={() => setActiveTab("feed")}
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left ${activeTab === "feed" ? "bg-green-50" : ""}`}
                >
                  <div className="w-9 h-9 bg-eco-primary/10 rounded-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-eco-primary" />
                  </div>
                  <span className="font-medium text-gray-700">Inicio</span>
                </button>

                <Link
                  href="/dashboard/my-reports"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                >
                  <div className="w-9 h-9 bg-eco-primary/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-eco-primary" />
                  </div>
                  <span className="font-medium text-gray-700">Mis reportes</span>
                </Link>

                <button
                  onClick={() => setActiveTab("tendencias")}
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left ${activeTab === "tendencias" ? "bg-blue-50" : ""}`}
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Tendencias</span>
                </button>

                <button
                  onClick={() => setActiveTab("estadisticas")}
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left ${activeTab === "estadisticas" ? "bg-orange-50" : ""}`}
                >
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-700">Estadísticas</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Feed central */}
          <main className="col-span-12 lg:col-span-6 space-y-4">
            {/* Tendencias Tab */}
            {/* Tendencias Tab */}
            {activeTab === "tendencias" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Tendencias
                </h2>
                {trendingReports.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay reportes virales aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trendingReports.map((report, index) => (
                      <div key={report.id_reporte} className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl font-bold text-gray-200 select-none">#{index + 1}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate pr-4">{report.descripcion}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <span>Por {report.autor_nombre} {report.autor_apellido}</span>
                              <span>•</span>
                              <span>{formatRelativeTime(report.creado_en)}</span>
                            </div>
                            {report.ubicacion && (
                              <div className="flex items-center gap-1 text-xs text-eco-primary mt-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{report.ubicacion}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-6 mt-3">
                              <button
                                onClick={() => handleLike(report.id_reporte)}
                                className={`flex items-center gap-1.5 text-sm transition-colors ${report.liked_by_me ? 'text-red-500 font-medium' : 'text-gray-600 hover:text-red-500'}`}
                              >
                                <ThumbsUp className={`w-4 h-4 ${report.liked_by_me ? 'fill-red-500' : ''}`} />
                                <span>{report.likes}</span>
                              </button>
                              <button
                                onClick={() => setSelectedReportId(report.id_reporte)}
                                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span>{report.comentarios}</span>
                              </button>
                              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                <BarChart3 className="w-4 h-4" />
                                <span>{report.vistas}</span>
                              </div>
                            </div>
                          </div>
                          {report.imagen && (
                            <img
                              src={`${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${report.imagen}`}
                              alt=""
                              className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Estadísticas Tab (Notificaciones del autor) */}
            {activeTab === "estadisticas" && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-orange-600" />
                    Notificaciones
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white ml-2 rounded-full px-2 py-0.5 text-xs">
                        {unreadCount} nuevas
                      </Badge>
                    )}
                  </h2>
                </div>

                {!user ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Inicia sesión para ver tu actividad</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No tienes notificaciones aún</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id_notificacion}
                        className={`group relative border rounded-xl p-4 transition-all duration-200 ${notif.leido ? 'bg-white hover:border-gray-300' : 'bg-blue-50/50 border-blue-200 shadow-sm'}`}
                        onClick={() => !notif.leido && handleMarkRead(notif.id_notificacion)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.tipo === 'like' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {notif.tipo === 'like' ? <ThumbsUp className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-gray-900">
                                <span className="font-bold text-gray-900">{notif.origen_nombre} {notif.origen_apellido}</span>
                                <span className="text-gray-600 font-normal">
                                  {notif.tipo === 'like' ? ' le gustó tu reporte' : ' comentó en tu reporte'}
                                </span>
                              </p>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatRelativeTime(notif.creado_en)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1 italic">"{notif.reporte_descripcion}"</p>

                            {!notif.leido && (
                              <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                Nueva
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Feed Tab (default) */}
            {activeTab === "feed" && (
              <>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <UserAvatar
                      nombre={user?.nombre}
                      apellido={user?.apellido}
                      avatarUrl={user?.avatar}
                      className="w-10 h-10"
                    />
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 justify-start text-gray-500 hover:bg-gray-100 rounded-full h-10 bg-[#f0f2f5] border-none"
                    >
                      <Link href="/dashboard/new-report">¿Qué problema ambiental quieres reportar?</Link>
                    </Button>
                  </div>
                  <div className="border-t pt-3 flex items-center justify-around">
                    <Button variant="ghost" className="flex-1 text-gray-600 hover:bg-gray-100">
                      <AlertCircle className="w-5 h-5 mr-2 text-eco-error" />
                      Reportar
                    </Button>
                  </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg shadow p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">Filtrar por ubicación</h3>
                    {user && (
                      <button
                        onClick={() => {
                          setSmartFiltersActive(!smartFiltersActive);
                          if (!smartFiltersActive) {
                            setFiltroProvincia("todas");
                            setFiltroCiudad("todas");
                          }
                        }}
                        className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${smartFiltersActive ? 'bg-eco-primary/10 text-eco-primary' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {smartFiltersActive ? "" : "Activar Feed Inteligente"}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las categorías</SelectItem>
                        <SelectItem value="fauna">Fauna</SelectItem>
                        <SelectItem value="basura">Basura</SelectItem>
                        <SelectItem value="quema">Quema</SelectItem>
                        <SelectItem value="deforestacion">Deforestación</SelectItem>
                        <SelectItem value="contaminacion">Contaminación</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filtroProvincia}
                      onValueChange={(val) => {
                        setFiltroProvincia(val);
                        setFiltroCiudad("todas");
                        if (val !== "todas") setSmartFiltersActive(false);
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las provincias</SelectItem>
                        {provincias.map((p: any) => (
                          <SelectItem key={p.id_provincia} value={p.id_provincia.toString()}>
                            {p.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {smartStatus && (
                    <div className="flex items-center gap-2 text-xs text-eco-primary-dark bg-eco-primary/5 p-2 rounded-md animate-in fade-in slide-in-from-top-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {smartStatus}
                    </div>
                  )}
                </div>

                {/* Lista de reportes estilo posts de Facebook */}
                {loading ? (
                  <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-primary"></div></div>
                ) : alertasFiltradas.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay reportes</h3>
                    <p className="text-gray-500">Intenta ajustar los filtros o crea un nuevo reporte</p>
                  </div>
                ) : (
                  alertasFiltradas.map((alerta) => {
                    const IconoCategoria = iconosCategoria[alerta.categoria] || AlertCircle
                    return (
                      <div key={alerta.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                        {/* Header del post */}
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              nombre={alerta.autor}
                              className="w-10 h-10"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{alerta.autor}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{alerta.fecha}</span>
                                <span>•</span>
                                <MapPin className="w-3 h-3" />
                                <span>{alerta.ubicacion}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${coloresEstado[alerta.estado]} capitalize`}>
                              {alerta.estado.replace("_", " ")}
                            </Badge>

                            {/* Dropdown for Edit/Delete if owner */}
                            {user && Number(user.id_usr) === Number(alerta.id_usuario) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/dashboard/edit-report/${alerta.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteReport(alerta.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>

                        {/* Contenido del post */}
                        <div className="px-4 pb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-eco-primary/10 rounded-full flex items-center justify-center">
                              <IconoCategoria className="w-4 h-4 text-eco-primary" />
                            </div>
                            <Badge variant="outline" className="capitalize text-xs">
                              {alerta.categoria}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{alerta.titulo}</h3>
                          <p className="text-gray-700">{alerta.descripcion}</p>
                        </div>

                        {/* Imagen */}
                        {alerta.imagen && (
                          <div className="relative">
                            <img
                              src={alerta.imagen || "/placeholder.svg"}
                              alt={alerta.titulo}
                              className="w-full h-96 object-cover"
                            />
                          </div>
                        )}

                        {/* Estadísticas */}
                        <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-b">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4 fill-eco-primary text-eco-primary" />
                            <span>{alerta.likes}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span>{alerta.comentarios} comentarios</span>
                            <span>{alerta.vistas} vistas</span>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="px-4 py-2 flex items-center justify-around">
                          <Button
                            variant="ghost"
                            className={`flex-1 hover:bg-gray-100 ${alerta.liked_by_me ? 'text-red-600 bg-red-50/50' : 'text-gray-600 hover:text-red-500'}`}
                            onClick={() => handleLike(alerta.id)}
                          >
                            <ThumbsUp className={`w-5 h-5 mr-2 ${alerta.liked_by_me ? 'fill-red-600' : ''}`} />
                            {alerta.liked_by_me ? 'Te gusta' : 'Me gusta'}
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex-1 text-gray-600 hover:bg-gray-100 hover:text-blue-500"
                            onClick={() => setSelectedReportId(alerta.id)}
                          >
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Comentar
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </>
            )}
          </main>

          {/* Sidebar derecho */}
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            <div className="sticky top-20 space-y-4">
              {/* Estadísticas */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Tus estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-eco-primary/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-eco-primary" />
                      </div>
                      <span className="text-sm text-gray-700">Reportes</span>
                    </div>
                    <span className="font-bold text-eco-primary">{userStats.totalReportes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Flame className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-sm text-gray-700">Activos</span>
                    </div>
                    <span className="font-bold text-yellow-600">{userStats.activos}</span>
                  </div>
                </div>
              </div>

              {/* Actividad reciente */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Actividad reciente</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📊 {reportesHoy} {reportesHoy === 1 ? 'nuevo reporte' : 'nuevos reportes'} hoy</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CommentsModal
        isOpen={!!selectedReportId}
        onClose={() => setSelectedReportId(null)}
        reportId={selectedReportId}
        onCommentAdded={() => {
          if (!selectedReportId) return;
          setAlertas(prev => prev.map(a =>
            a.id === selectedReportId ? { ...a, comentarios: (a.comentarios || 0) + 1 } : a
          ));
          setTrendingReports(prev => prev.map(r =>
            r.id_reporte === selectedReportId ? { ...r, comentarios: (r.comentarios || 0) + 1 } : r
          ));
        }}
      />
    </div >
  )
}
