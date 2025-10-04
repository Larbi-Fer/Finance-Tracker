'use client'
import Link from "next/link"
import { Progress } from "../ui/progress"
import React from "react"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"

const Categories = ({categs}: {categs: CategoryProps[]}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
      {categs.map(categ => (
        <Link
          key={categ.id}
          className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg p-4 flex flex-col gap-2 border border-neutral-200
                    dark:border-neutral-700 transition-colors hover:bg-amber-100 dark:hover:bg-neutral-700"
          href={'/category/' + categ.id}
        >
          {/* Icon and Title */}
          <div className="flex items-center gap-3">
            <i className="text-2xl text-neutral-600 dark:text-neutral-300">{/* icon */}</i>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
              {categ.title}
            </h3>
          </div>

          {categ.budget.map((b, i) => (
            <React.Fragment key={i}>
              {/* Spent & Budget Info */}
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                <span>Spent: {b.currency.format.replace('{}', String(b.spent))}</span>
                <span>{b.amount ? ('Remaining: ' + b.currency.format.replace('{}', String(b.amount - b.spent))) : "No budget entered"}</span>
              </div>

              {/* Progress Bar */}
              <Progress value={b.amount ? ((b.spent / b.amount) * 100) : 0} />
            </React.Fragment>
          ))}
        </Link>
      ))}

      <CreateCategoryAlert open={open} setOpen={setOpen} trigger={
        <button
          className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg p-4 flex flex-col gap-2 border border-neutral-200
            dark:border-neutral-700 transition-colors hover:bg-amber-100 dark:hover:bg-neutral-700 cursor-pointer flex-center"
        >
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            <div className="text-center">+</div>
            <div>Create new category</div>
          </h3>
        </button>
      } />
    </div>

  )
}


const CreateCategoryAlert = ({open, setOpen, trigger}: {trigger: React.ReactNode, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] dark:bg-[#3335] dark:backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Create a category</DialogTitle>
            <DialogDescription>
              
            </DialogDescription>
          </DialogHeader>
          <form>
            <Input placeholder="Test" autoFocus />
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create a category</DrawerTitle>
          <DrawerDescription>
            
          </DrawerDescription>
        </DrawerHeader>
        <form>
          Creation form
        </form>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <button>Cancel</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


export default Categories