'use client'
import Link from "next/link"
import {HomeIcon, IncomeIcon, SpendingIcon} from "@/icons"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"

const Sidebar = () => {
  const path = usePathname()
  return (
    <div className="p-2">
      <div className="border-b-2 py-2 mb-3">
        <label className="text-2xl">Dollar - USA</label>
      </div>

      <Item href="/home" text="Home" icon={<HomeIcon />} selected={path.startsWith('/home')} />
      <Item href="/spending" text="Spending" icon={<SpendingIcon />} selected={path.startsWith('/spending')} />
      <Item href="/incomes" text="Incomes" icon={<IncomeIcon />} selected={path.startsWith('/incomes')} />
    </div>
  )
}

const Item = ({href, text, icon, selected}: {href: string, text: string, icon: ReactNode, selected?: boolean}) => (
    <Link href={href}>
      <button className="w-full py-[3px] px-1 my-2 flex-center justify-start text-left bg-transparent hover:bg-[#aaa3]"
        style={{background: selected ? 'linear-gradient(45deg, rgb(125 34 0), #4f4f4fa8' : ''}}
      >
        {icon}
        <div className="px-2">{text}</div>
      </button>
    </Link>
  )

export default Sidebar