import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"

const IconPicker = ({icon, className, onEmojiClick}: {icon: string, className?: string, onEmojiClick: (props: EmojiClickData) => void}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("p-1 my-2 text-center", className)}>{icon || 'Icon'}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <div>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default IconPicker