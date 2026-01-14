"use client"

import { useState } from "react"
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
  Leaf,
  Flame,
  Trash2,
  TreePine,
  Dog,
  Droplets,
  Home,
  TrendingUp,
  Award,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  estado: "activo" | "en_proceso" | "resuelto"
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

// Iconos por categoría
const iconosCategoria = {
  fauna: Dog,
  basura: Trash2,
  quema: Flame,
  deforestacion: TreePine,
  contaminacion: Droplets,
}

// Colores por estado
const coloresEstado = {
  activo: "bg-eco-error/10 text-eco-error border-eco-error/20",
  en_proceso: "bg-eco-warning/10 text-eco-warning border-eco-warning/20",
  resuelto: "bg-eco-success/10 text-eco-success border-eco-success/20",
}

export default function DashboardPage() {
  const router = useRouter()
  const [usuario] = useState({
    nombre: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    avatar: "",
    reportes: 12,
    nivel: "Ciudadano Activo",
  })

  const [alertas, setAlertas] = useState<Alert[]>(alertasEjemplo)
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas")
  const [busqueda, setBusqueda] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Filtrar alertas
  const alertasFiltradas = alertas.filter((alerta) => {
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
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-eco-primary rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
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
                    <Avatar className="w-10 h-10 border-2 border-eco-primary">
                      <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-eco-primary text-white font-semibold">
                        {usuario.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="pb-0">
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-eco-primary text-white">
                          {usuario.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{usuario.nombre}</p>
                        <p className="text-xs text-gray-500">{usuario.nivel}</p>
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
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>
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
                <Avatar className="w-9 h-9">
                  <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-eco-primary text-white text-sm">
                    {usuario.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-gray-900">{usuario.nombre}</span>
              </Link>

              {/* Navegación */}
              <div className="space-y-1 mt-2">
                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left">
                  <div className="w-9 h-9 bg-eco-primary/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-eco-primary" />
                  </div>
                  <span className="font-medium text-gray-700">Mis reportes</span>
                </button>

                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Tendencias</span>
                </button>

                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left">
                  <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Logros</span>
                </button>

                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left">
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
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-eco-primary text-white">
                    {usuario.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
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
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2">
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Filtrar por categoría" />
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
              </div>
            </div>

            {/* Lista de reportes estilo posts de Facebook */}
            {alertasFiltradas.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay reportes</h3>
                <p className="text-gray-500">Intenta ajustar los filtros o crea un nuevo reporte</p>
              </div>
            ) : (
              alertasFiltradas.map((alerta) => {
                const IconoCategoria = iconosCategoria[alerta.categoria as keyof typeof iconosCategoria] || AlertCircle
                return (
                  <div key={alerta.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    {/* Header del post */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-eco-secondary text-white">
                            {alerta.autor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
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
                      <Badge className={`${coloresEstado[alerta.estado]} capitalize`}>
                        {alerta.estado.replace("_", " ")}
                      </Badge>
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
                      <Button variant="ghost" className="flex-1 text-gray-600 hover:bg-gray-100">
                        <ThumbsUp className="w-5 h-5 mr-2" />
                        Me gusta
                      </Button>
                      <Button variant="ghost" className="flex-1 text-gray-600 hover:bg-gray-100">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Comentar
                      </Button>
                    </div>
                  </div>
                )
              })
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
                    <span className="font-bold text-eco-primary">{usuario.reportes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Flame className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-sm text-gray-700">Activos</span>
                    </div>
                    <span className="font-bold text-yellow-600">
                      {alertas.filter((a) => a.estado === "activo").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">Resueltos</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {alertas.filter((a) => a.estado === "resuelto").length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contactos o sugerencias */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Actividad reciente</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📊 3 nuevos reportes hoy</p>
                  <p>✅ 2 casos resueltos esta semana</p>
                  <p>🎯 89% de efectividad</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
