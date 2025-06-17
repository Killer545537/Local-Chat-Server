import type { ChatRoom } from "@/types/chat"

interface ChatHeaderProps {
    room: ChatRoom
}

export const ChatHeader = ({ room }: ChatHeaderProps) => (
    <div className="flex items-center justify-between px-4 py-3 bg-card/80 border-b border-border backdrop-blur-sm">
        <div className="flex items-center space-x-3">
            {/* macOS Traffic Light Buttons */}
            <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                <div className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"></div>
            </div>
            <div className="h-4 w-px bg-border"></div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
            <h3 className="font-semibold text-foreground text-sm tracking-tight">{room.name}</h3>
        </div>
        <div className="w-16"></div> {/* Spacer for centering */}
    </div>
)
