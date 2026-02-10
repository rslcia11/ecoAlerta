import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarColor, getInitials } from "@/lib/avatarUtils"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
    nombre?: string;
    apellido?: string;
    avatarUrl?: string;
    className?: string;
}

export function UserAvatar({ nombre, apellido, avatarUrl, className }: UserAvatarProps) {
    const identifier = nombre || "Usuario";
    const colorClass = getAvatarColor(identifier);
    const initials = getInitials(nombre || "U");

    return (
        <Avatar className={cn("border-2 border-white shadow-sm", className)}>
            <AvatarImage src={avatarUrl} alt={identifier} />
            <AvatarFallback className={cn("text-white font-semibold", colorClass)}>
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
