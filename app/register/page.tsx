"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Eye, EyeOff, CheckCircle2, Mail, Lock, User, Phone, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"

interface Provincia {
  id_provincia: number;
  nombre: string;
}

interface Ciudad {
  id_ciudad: number;
  nombre: string;
}

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    cedula: "",
    telefono: "",
    provincia: "",
    id_ciudad: "", // Changed from 'ciudad' to 'id_ciudad' for consistency
    direccion: "", // Added for the new update
    terminos: false, // Added for the new update
  })

  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [ciudadesDisponibles, setCiudasDisponibles] = useState<Ciudad[]>([])

  // Cargar provincias al inicio
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const res = await api.get('/catalogos/provincias');
        setProvincias(res.data);
      } catch (error) {
        console.error("Error cargando provincias:", error);
      }
    };
    fetchProvincias();
  }, []);

  // Cargar ciudades cuando cambia la provincia
  useEffect(() => {
    if (formData.provincia) {
      const fetchCiudades = async () => {
        try {
          const res = await api.get(`/catalogos/ciudades?id_provincia=${formData.provincia}`);
          setCiudasDisponibles(res.data);
        } catch (error) {
          console.error("Error cargando ciudades:", error);
          setCiudasDisponibles([]);
        }
      };

      fetchCiudades();
      // Resetear ciudad solo si cambia la provincia (mejor control manual si se necesitara)
      setFormData((prev) => ({ ...prev, id_ciudad: "" }))
    } else {
      setCiudasDisponibles([])
    }
  }, [formData.provincia])

  // Validaciones en tiempo real
  const validateField = (name: string, value: string | boolean) => {
    let error = ""

    switch (name) {
      case "nombre":
      case "apellido":
        if (!value.toString().trim()) {
          error = "Este campo es requerido"
        } else if (value.toString().length < 2) {
          error = "Debe tener al menos 2 caracteres"
        }
        break

      case "correo":
        if (!value.toString().trim()) {
          error = "El correo es requerido"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) {
          error = "Correo electrónico inválido"
        }
        break

      case "contrasena":
        if (!value) {
          error = "La contraseña es requerida"
        } else if (value.toString().length < 8) {
          error = "Mínimo 8 caracteres"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value.toString())) {
          error = "Debe contener mayúscula, minúscula y número"
        }
        break

      case "cedula":
        if (!value.toString().trim()) {
          error = "La cédula es requerida"
        } else if (!/^\d{10}$/.test(value.toString())) {
          error = "Debe tener 10 dígitos"
        }
        break

      case "telefono":
        if (!value.toString().trim()) {
          error = "El teléfono es requerido"
        } else if (!/^\d{10}$/.test(value.toString())) {
          error = "Debe tener 10 dígitos"
        }
        break

      case "provincia":
        if (!value) {
          error = "Selecciona una provincia"
        }
        break

      case "id_ciudad":
        if (!value) {
          error = "Selecciona una ciudad"
        }
        break

      case "direccion": // Added for new update
        if (!value.toString().trim()) {
          error = "La dirección es requerida"
        }
        break

      case "terminos": // Added for new update
        if (!value) {
          error = "Debes aceptar los términos y condiciones"
        }
        break
    }

    return error
  }

  const handleBlur = (name: string) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name as keyof typeof formData])
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validar si el campo ya fue tocado
    if (touchedFields[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todos los campos
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) newErrors[key] = error as string
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouchedFields(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      return
    }

    setIsLoading(true)

    // Llamada API Real
    try {
      const response = await api.post('/auth/register', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        contrasena: formData.contrasena,
        cedula: formData.cedula,
        telefono: formData.telefono,
        id_ciudad: Number(formData.id_ciudad)
      });

      const { token, usuario, user } = response.data; // Backend might return user or usuario
      const userData = usuario || user;

      // Auto-login
      if (token && userData) {
        login(token, userData);
        router.push("/dashboard"); // Redirect directly to dashboard
      } else {
        router.push("/register/success");
      }

    } catch (error: any) {
      console.error("Error:", error);
      const message = error.response?.data?.error || error.response?.data?.message || "Error al crear la cuenta.";
      setErrors({ submit: message });
    } finally {
      setIsLoading(false);
    }
  }

  const isFieldValid = (name: string) => {
    return touchedFields[name] && !errors[name] && formData[name as keyof typeof formData]
  }

  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length - 2 // Exclude 'provincia' and 'id_ciudad' if they are not considered in progress
    const filledFields = Object.values(formData).filter((f) => {
      if (typeof f === "string" && f.trim() !== "") return true
      if (typeof f === "boolean" && f === true) return true
      return false
    }).length
    return Math.round((filledFields / totalFields) * 100)
  }

  const progress = calculateProgress()

  return (
    // Diseño minimalista con título centrado
    <div className="min-h-screen bg-gradient-to-br from-white via-eco-primary/5 to-eco-secondary/10">
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-eco-primary hover:text-eco-primary-dark transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver al inicio</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Título principal centrado */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-eco-primary-dark mb-4">CREA TU CUENTA</h1>
            <div className="w-24 h-1 bg-eco-primary mx-auto mb-6" />
            <p className="text-lg text-eco-gray-dark max-w-md mx-auto">
              Únete a la comunidad que protege el medio ambiente en Loja
            </p>
          </div>

          {/* Formulario con diseño limpio */}
          <div className="bg-white rounded-2xl shadow-xl border border-eco-gray-light/50 overflow-hidden">
            {/* Barra de progreso */}
            <div className="bg-eco-primary/5 px-6 py-4 border-b border-eco-gray-light/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-eco-gray-dark">Progreso del registro</span>
                <span className="text-sm font-bold text-eco-primary">{progress}%</span>
              </div>
              <div className="h-2 bg-eco-gray-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-eco-primary to-eco-secondary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Error general */}
              {errors.submit && (
                <div className="bg-eco-error/10 border border-eco-error/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-eco-error flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-eco-error font-medium">{errors.submit}</p>
                </div>
              )}

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-eco-primary-dark flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-medium text-eco-gray-dark">
                      Nombre *
                    </Label>
                    <div className="relative">
                      <Input
                        id="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        onBlur={() => handleBlur("nombre")}
                        className={`h-12 transition-all ${errors.nombre && touchedFields.nombre
                            ? "border-eco-error focus:ring-eco-error"
                            : isFieldValid("nombre")
                              ? "border-eco-success focus:ring-eco-success"
                              : "border-eco-gray-light focus:ring-eco-primary"
                          }`}
                        placeholder="Ej: Juan"
                      />
                      {isFieldValid("nombre") && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-success" />
                      )}
                    </div>
                    {errors.nombre && touchedFields.nombre && (
                      <p className="text-xs text-eco-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-sm font-medium text-eco-gray-dark">
                      Apellido *
                    </Label>
                    <div className="relative">
                      <Input
                        id="apellido"
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => handleChange("apellido", e.target.value)}
                        onBlur={() => handleBlur("apellido")}
                        className={`h-12 transition-all ${errors.apellido && touchedFields.apellido
                            ? "border-eco-error focus:ring-eco-error"
                            : isFieldValid("apellido")
                              ? "border-eco-success focus:ring-eco-success"
                              : "border-eco-gray-light focus:ring-eco-primary"
                          }`}
                        placeholder="Ej: Pérez"
                      />
                      {isFieldValid("apellido") && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-success" />
                      )}
                    </div>
                    {errors.apellido && touchedFields.apellido && (
                      <p className="text-xs text-eco-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.apellido}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Credenciales */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-eco-primary-dark flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Credenciales de acceso
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="correo" className="text-sm font-medium text-eco-gray-dark">
                    Correo electrónico *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-gray-medium" />
                    <Input
                      id="correo"
                      type="email"
                      value={formData.correo}
                      onChange={(e) => handleChange("correo", e.target.value)}
                      onBlur={() => handleBlur("correo")}
                      className={`h-12 pl-10 transition-all ${errors.correo && touchedFields.correo
                          ? "border-eco-error focus:ring-eco-error"
                          : isFieldValid("correo")
                            ? "border-eco-success focus:ring-eco-success"
                            : "border-eco-gray-light focus:ring-eco-primary"
                        }`}
                      placeholder="tucorreo@ejemplo.com"
                    />
                    {isFieldValid("correo") && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-success" />
                    )}
                  </div>
                  {errors.correo && touchedFields.correo && (
                    <p className="text-xs text-eco-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.correo}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasena" className="text-sm font-medium text-eco-gray-dark">
                    Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="contrasena"
                      type={showPassword ? "text" : "password"}
                      value={formData.contrasena}
                      onChange={(e) => handleChange("contrasena", e.target.value)}
                      onBlur={() => handleBlur("contrasena")}
                      className={`h-12 pr-10 transition-all ${errors.contrasena && touchedFields.contrasena
                          ? "border-eco-error focus:ring-eco-error"
                          : isFieldValid("contrasena")
                            ? "border-eco-success focus:ring-eco-success"
                            : "border-eco-gray-light focus:ring-eco-primary"
                        }`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-eco-gray-medium hover:text-eco-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.contrasena && touchedFields.contrasena && (
                    <p className="text-xs text-eco-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.contrasena}
                    </p>
                  )}
                  {!errors.contrasena && formData.contrasena && (
                    <p className="text-xs text-eco-gray-medium">Debe contener mayúscula, minúscula y número</p>
                  )}
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-eco-primary-dark flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Información de contacto
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cedula" className="text-sm font-medium text-eco-gray-dark">
                      Cédula *
                    </Label>
                    <div className="relative">
                      <Input
                        id="cedula"
                        type="text"
                        value={formData.cedula}
                        onChange={(e) => handleChange("cedula", e.target.value.replace(/\D/g, ""))}
                        onBlur={() => handleBlur("cedula")}
                        className={`h-12 transition-all ${errors.cedula && touchedFields.cedula
                            ? "border-eco-error focus:ring-eco-error"
                            : isFieldValid("cedula")
                              ? "border-eco-success focus:ring-eco-success"
                              : "border-eco-gray-light focus:ring-eco-primary"
                          }`}
                        placeholder="1234567890"
                        maxLength={10}
                      />
                      {isFieldValid("cedula") && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-success" />
                      )}
                    </div>
                    {errors.cedula && touchedFields.cedula && (
                      <p className="text-xs text-eco-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.cedula}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-sm font-medium text-eco-gray-dark">
                      Teléfono *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-gray-medium" />
                      <Input
                        id="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => handleChange("telefono", e.target.value.replace(/\D/g, ""))}
                        onBlur={() => handleBlur("telefono")}
                        className={`h-12 pl-10 transition-all ${errors.telefono && touchedFields.telefono
                            ? "border-eco-error focus:ring-eco-error"
                            : isFieldValid("telefono")
                              ? "border-eco-success focus:ring-eco-success"
                              : "border-eco-gray-light focus:ring-eco-primary"
                          }`}
                        placeholder="0987654321"
                        maxLength={10}
                      />
                      {isFieldValid("telefono") && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-success" />
                      )}
                    </div>
                    {errors.telefono && touchedFields.telefono && (
                      <p className="text-xs text-eco-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.telefono}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-eco-primary-dark flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="provincia" className="text-sm font-medium text-eco-gray-dark">
                      Provincia *
                    </Label>
                    <Select
                      value={formData.provincia}
                      onValueChange={(value) => handleChange("provincia", value)}
                      // Added onBlur to trigger validation on selection change
                      onOpenChange={() => handleBlur("provincia")}
                    >
                      <SelectTrigger
                        className={`h-12 ${errors.provincia && touchedFields.provincia
                            ? "border-eco-error"
                            : isFieldValid("provincia")
                              ? "border-eco-success"
                              : "border-eco-gray-light"
                          }`}
                      >
                        <SelectValue placeholder="Selecciona tu provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {provincias.map((prov) => (
                          <SelectItem key={prov.id_provincia} value={prov.id_provincia.toString()}>
                            {prov.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.provincia && touchedFields.provincia && (
                      <p className="text-xs text-eco-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.provincia}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id_ciudad" className="text-sm font-medium text-eco-gray-dark">
                      Ciudad *
                    </Label>
                    <Select
                      value={formData.id_ciudad}
                      onValueChange={(value) => handleChange("id_ciudad", value)}
                      disabled={!formData.provincia}
                      onOpenChange={() => handleBlur("id_ciudad")}
                    >
                      <SelectTrigger
                        className={`h-12 ${errors.id_ciudad && touchedFields.id_ciudad
                            ? "border-eco-error"
                            : isFieldValid("id_ciudad")
                              ? "border-eco-success"
                              : "border-eco-gray-light"
                          }`}
                      >
                        <SelectValue placeholder="Selecciona tu ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {ciudadesDisponibles.map((city) => (
                          <SelectItem key={city.id_ciudad} value={city.id_ciudad.toString()}>
                            {city.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.id_ciudad && touchedFields.id_ciudad && (
                      <p className="text-xs text-eco-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.id_ciudad}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-sm font-medium text-eco-gray-dark">
                    Dirección *
                  </Label>
                  <Input
                    id="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    onBlur={() => handleBlur("direccion")}
                    className={`h-12 transition-all ${errors.direccion && touchedFields.direccion
                        ? "border-eco-error focus:ring-eco-error"
                        : isFieldValid("direccion")
                          ? "border-eco-success focus:ring-eco-success"
                          : "border-eco-gray-light focus:ring-eco-primary"
                      }`}
                    placeholder="Ej: Av. Principal y Calle Secundaria"
                  />
                  {errors.direccion && touchedFields.direccion && (
                    <p className="text-xs text-eco-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.direccion}
                    </p>
                  )}
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-eco-primary/5 rounded-lg border border-eco-primary/10">
                  <Checkbox
                    id="terminos"
                    checked={!!formData.terminos} // Ensure boolean
                    onCheckedChange={(checked) => handleChange("terminos", checked as boolean)}
                    className="mt-1"
                    onBlur={() => handleBlur("terminos")} // Add onBlur for validation
                  />
                  <div className="flex-1">
                    <Label htmlFor="terminos" className="text-sm text-eco-gray-dark cursor-pointer leading-relaxed">
                      Acepto los{" "}
                      <a href="#" className="text-eco-primary font-medium hover:underline">
                        términos y condiciones
                      </a>{" "}
                      y la{" "}
                      <a href="#" className="text-eco-primary font-medium hover:underline">
                        política de privacidad
                      </a>
                    </Label>
                    {errors.terminos && touchedFields.terminos && (
                      <p className="text-xs text-eco-error flex items-center gap-1 mt-2">
                        <AlertCircle className="w-3 h-3" />
                        {errors.terminos}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-eco-primary hover:bg-eco-primary-dark text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-white">Creando cuenta...</span>
                    </span>
                  ) : (
                    <span className="text-white font-semibold">Crear mi cuenta</span>
                  )}
                </Button>

                <p className="text-center text-sm text-eco-gray-medium">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    href="/login"
                    className="text-eco-primary font-semibold hover:text-eco-primary-dark hover:underline transition-colors"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
