import Link from "next/link"

const Sources = ({data}: {data: SourceProps[]}) => {
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
              <i className="text-2xl text-neutral-600 dark:text-neutral-300">{/* icon */}</i>
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
      </div>
    </div>
  )
}

export default Sources