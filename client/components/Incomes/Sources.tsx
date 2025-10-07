'use client'
import Link from "next/link"
import AlertOrDrower from "../Create/AlertOrDrower"
import { useState } from "react"
import CreateSource from "../Create/CreateSource"

const Sources = ({data}: {data: SourceProps[]}) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <label className="text-2xl">Income sources</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
        {data.map(source => (
          <Link
            key={source.id}
            className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg p-4 flex flex-col gap-2 border border-neutral-200
                      dark:border-neutral-700 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
            href={'/source/' + source.id}
          >
            {/* Icon and Title */}
            <div className="flex items-center gap-3">
              <div className="text-2xl text-neutral-600 dark:text-neutral-300">{source.icon}</div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                {source.title}
              </h3>
            </div>

              {/* Spent & Budget Info */}
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                <span className="flex gap-1">Earned: <p className="font-bold">{source.currency.format.replace('{}', String(source.earned))}</p></span>
                {/* <span>{b.amount ? ('Remaining: ' + b.currency.format.replace('{}', String(b.amount - b.spent))) : "No budget entered"}</span> */}
              </div>
          </Link>
        ))}

        <AlertOrDrower open={open} setOpen={setOpen} trigger={
          <button
            className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg p-4 flex flex-col gap-2 border border-neutral-200
              dark:border-neutral-700 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer flex-center"
          >
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
              <div className="text-center">+</div>
              <div>Create new source</div>
            </h3>
          </button>
        } title="Create a category">
        <CreateSource exit={() => setOpen(false)} />
      </AlertOrDrower>
      </div>
    </div>
  )
}

export default Sources