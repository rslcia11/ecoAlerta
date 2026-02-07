"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/services/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Trash2, Send, MessageSquare } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

interface Comment {
    id_comentario: number;
    contenido: string;
    creado_en: string;
    id_usr: number;
    nombre: string;
    apellido: string;
    avatar?: string;
}

interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportId: number | null;
    onCommentAdded?: () => void;
}

export function CommentsModal({ isOpen, onClose, reportId, onCommentAdded }: CommentsModalProps) {
    const { user } = useAuth()
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [newComment, setNewComment] = useState("")

    useEffect(() => {
        if (isOpen && reportId) {
            fetchComments()
        } else {
            setComments([])
            setNewComment("")
        }
    }, [isOpen, reportId])

    const fetchComments = async () => {
        if (!reportId) return
        setLoading(true)
        try {
            const res = await api.get(`/reportes/${reportId}/comentarios`)
            if (res.data.success) {
                setComments(res.data.data)
            }
        } catch (error) {
            console.error("Error fetching comments:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!newComment.trim() || !reportId) return

        setSubmitting(true)
        try {
            const res = await api.post(`/reportes/${reportId}/comentarios`, {
                contenido: newComment
            })
            if (res.data.success) {
                setNewComment("")
                fetchComments() // Refresh list
                if (onCommentAdded) onCommentAdded()
            }
        } catch (error) {
            console.error("Error posting comment:", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (commentId: number) => {
        if (!confirm("¿Eliminar comentario?")) return
        try {
            await api.delete(`/comentarios/${commentId}`)
            setComments(prev => prev.filter(c => c.id_comentario !== commentId))
        } catch (error) {
            console.error("Error deleting comment:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Comentarios ({comments.length})
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4 -mr-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-eco-primary" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            No hay comentarios aún. ¡Sé el primero!
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            {comments.map((comment) => (
                                <div key={comment.id_comentario} className="flex gap-3 text-sm">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={comment.avatar} />
                                        <AvatarFallback className="bg-eco-primary/10 text-eco-primary text-xs">
                                            {comment.nombre ? comment.nombre[0] : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-900">
                                                {comment.nombre} {comment.apellido}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatRelativeTime(comment.creado_en)}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg text-gray-700 relative group">
                                            {comment.contenido}

                                            {user && Number(user.id_usr) === Number(comment.id_usr) && (
                                                <button
                                                    onClick={() => handleDelete(comment.id_comentario)}
                                                    className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="pt-4 border-t mt-auto flex gap-2">
                    <Textarea
                        placeholder="Escribe un comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="resize-none min-h-[44px] max-h-[120px]"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    <Button
                        size="icon"
                        onClick={handleSubmit}
                        disabled={submitting || !newComment.trim()}
                        className="bg-eco-primary hover:bg-eco-primary-dark shrink-0"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
