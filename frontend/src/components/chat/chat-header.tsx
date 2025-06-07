import { ChatRoom } from '@/types/chat';

interface ChatHeaderProps {
    room: ChatRoom
}

export const ChatHeader = ({room}: ChatHeaderProps) => (
    <div className='flex items-center pl-3 pb-4 border-b'>
        <div>
            <h3 className='font-bold text-2xl'>{room.name}</h3>
        </div>
    </div>
)