import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./dropdown-menu"

export type DropdownListProps = {id: string, title: string, [key: string]: any}[]

const Dropdown = ({ list, val, handleChange, suffix, placeholder }: {list: DropdownListProps, val: string, handleChange: (val: string) => void, suffix?: (item: any) => string, placeholder: string}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={"w-full my-2 text-start" + (val ? '' : ' text-muted-foreground')}>{val ? list.find(v => v.id == val)?.title : placeholder}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuRadioGroup value={val} onValueChange={handleChange}>
          {list.map(item => (
            <DropdownMenuRadioItem key={item.id} value={item.id} className="flex justify-between">
              <div>{item.title}</div>
              {suffix && <div>{suffix(item)}</div>}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Dropdown