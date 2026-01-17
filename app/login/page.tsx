"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  })
  const [errors, setErrors] = useState({
    correo: "",
    contrasena: "",
    submit: "",
  })
  const [touchedFields, setTouchedFields] = useState({
    correo: false,
    contrasena: false,
  })

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "correo":
        if (!value) return "El correo es obligatorio"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Correo electrónico inválido"
        return ""
      case "contrasena":
        if (!value) return "La contraseña es obligatoria"
        if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres"
        return ""
      default:
        return ""
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touchedFields[field as keyof typeof touchedFields]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }))
    }
  }

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field as keyof typeof formData]),
    }))
  }

  const isFieldValid = (field: string): boolean => {
    return (
      formData[field as keyof typeof formData].length > 0 &&
      !validateField(field, formData[field as keyof typeof formData])
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({ correo: "", contrasena: "", submit: "" })

    // Validar todos los campos
    const correoError = validateField("correo", formData.correo)
    const contrasenaError = validateField("contrasena", formData.contrasena)

    if (correoError || contrasenaError) {
      setErrors({
        correo: correoError,
        contrasena: contrasenaError,
        submit: "Por favor corrige los errores antes de continuar",
      })
      setTouchedFields({ correo: true, contrasena: true })
      setIsLoading(false)
      return
    }

    // Llamada al backend real
    try {
      const response = await api.post('/auth/login', {
        correo: formData.correo,
        contrasena: formData.contrasena
      });

      const { token, usuario } = response.data;

      // Usar el contexto para guardar sesión
      login(token, usuario);

      // Redirigir al dashboard
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || "Error al iniciar sesión. Verifica tus credenciales.";
      setErrors({
        ...errors,
        submit: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-eco-primary/5 to-eco-secondary/10">
      {/* Botón volver al inicio */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-eco-primary hover:text-eco-primary-dark transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver al inicio</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="max-w-md w-full">
          {/* Título principal */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-eco-primary rounded-full mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-eco-primary-dark mb-3">BIENVENIDO</h1>
            <div className="w-20 h-1 bg-eco-primary mx-auto mb-4" />
            <p className="text-lg text-eco-gray-dark">Inicia sesión para continuar protegiendo el medio ambiente</p>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-xl border border-eco-gray-light/50 overflow-hidden animate-fade-in-up delay-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Error general */}
              {errors.submit && (
                <div className="bg-eco-error/10 border border-eco-error/20 rounded-lg p-4 flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-eco-error flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-eco-error font-medium">{errors.submit}</p>
                </div>
              )}

              {/* Campo de correo */}
              <div className="space-y-2">
                <Label htmlFor="correo" className="text-sm font-medium text-eco-gray-dark">
                  Correo electrónico
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

              {/* Campo de contraseña */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="contrasena" className="text-sm font-medium text-eco-gray-dark">
                    Contraseña
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-eco-primary hover:text-eco-primary-dark hover:underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-gray-medium" />
                  <Input
                    id="contrasena"
                    type={showPassword ? "text" : "password"}
                    value={formData.contrasena}
                    onChange={(e) => handleChange("contrasena", e.target.value)}
                    onBlur={() => handleBlur("contrasena")}
                    className={`h-12 pl-10 pr-10 transition-all ${errors.contrasena && touchedFields.contrasena
                        ? "border-eco-error focus:ring-eco-error"
                        : isFieldValid("contrasena")
                          ? "border-eco-success focus:ring-eco-success"
                          : "border-eco-gray-light focus:ring-eco-primary"
                      }`}
                    placeholder="Ingresa tu contraseña"
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
              </div>

              {/* Botón de envío */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-eco-primary hover:bg-eco-primary-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-white">Iniciando sesión...</span>
                  </span>
                ) : (
                  <span className="text-white font-semibold">Iniciar sesión</span>
                )}
              </Button>

              {/* Link a registro */}
              <p className="text-center text-sm text-eco-gray-medium pt-4">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="text-eco-primary font-semibold hover:text-eco-primary-dark hover:underline transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center animate-fade-in-up delay-300">
            <p className="text-sm text-eco-gray-medium">
              Al iniciar sesión, aceptas nuestros{" "}
              <Link href="/terms" className="text-eco-primary hover:underline">
                términos y condiciones
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
