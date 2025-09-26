import Link from "next/link"
import Image from "next/image"
import HomeIcon from "@/icons/HomeIcon"

const Sidebar = () => {
  return (
    <div className="p-2">
      <div className="border-b-2 py-2 mb-3">
        <label className="text-2xl">Dollar - USA</label>
      </div>

      <Item href="/home" text="Home" />
    </div>
  )
}

const Item = ({href, text}: {href: string, text: string}) => (
    <Link href={href}>
      <button className="w-full py-[3px] px-1 my-2 flex-center justify-start text-left bg-transparent hover:bg-[#aaa3]">
        <HomeIcon />
        <div className="px-2">{text}</div>
      </button>
    </Link>
  )

export default Sidebar