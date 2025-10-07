'use client'
import Link from "next/link"
import { Progress } from "../ui/progress"
import React from "react"
import CreateCategory from "../Create/CreateCategory"
import AlertOrDrower from "../Create/AlertOrDrower"

const Categories = ({categs}: {categs: CategoryProps[]}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
      {categs.map(categ => (
        <Link
          key={categ.id}
          className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg p-4 flex flex-col gap-2 border border-neutral-200
                    dark:border-neutral-700 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
          href={'/category/' + categ.id}
        >
          {/* Icon and Title */}
          <div className="flex items-center gap-3">
            <div className="text-2xl text-neutral-600 dark:text-neutral-300">{categ.icon}</div>
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

      <AlertOrDrower open={open} setOpen={setOpen} trigger={
        <button
          className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg p-4 flex flex-col gap-2 border border-neutral-200
            dark:border-neutral-700 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer flex-center"
        >
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            <div className="text-center">+</div>
            <div>Create new category</div>
          </h3>
        </button>
      } title="Create a category">
        <CreateCategory budget={categs[0].budget.map(b => ({...b, amount: 0}))} exit={() => setOpen(false)} />
      </AlertOrDrower>
    </div>

  )
}

export default Categories