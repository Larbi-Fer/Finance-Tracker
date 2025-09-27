
const WalletsSection = ({wallets, total}: {wallets: WalletProps[], total: TotalBalanceProps}) => {
  const balance = wallets.reduce((acc, w) => acc + (w.incomeBalance - w.expensesBalance), 0)

  return (
    <div>
      <div className="flex-center justify-start">
        <Card wallet={{
          ...wallets[0],
          name: 'Total',
          monthExpenses: total.totalExpenses,
          monthIncomes: total.totalIncomes,
        }} balance={total.total} background="linear-gradient(45deg, rgb(125 34 0), #4f4f4fa8)" />
        {wallets.map(wallet => (
          <Card wallet={wallet} key={wallet.id} />
        ))}
      </div>
    </div>
  )
}

const Card = ({wallet, balance, background}: {wallet: WalletProps, balance?: number, background?: string}) => {
  const generateBalance = (f: string, b: number) => f.replace('{}', b.toString())

  return (
    <div
      key={wallet.id}
      className={`m-3 p-4 rounded-xl border shadow-sm bg-white dark:bg-gray-800
      border-gray-200 dark:border-gray-700 min-w-2xs min-h-[160px] flex flex-col justify-between
      transition-colors duration-300 hover:shadow-md hover:border-primary-500
      dark:hover:border-primary-400 bg-gradient-to-b` + (background ? ' ' + background : '')}
      style={{backgroundImage: background || 'linear-gradient(45deg, #111, transparent)'}}
    >
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {wallet.name}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <b>Balance:</b>{" "}
          {generateBalance(
            wallet.currnecy.format,
            balance || wallet.incomeBalance - wallet.expensesBalance
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-sm gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Incomes</p>
          <p className="text-green-600 dark:text-green-400 font-semibold">
            {generateBalance(wallet.currnecy.format, wallet.monthIncomes)}
          </p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Expenses</p>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            {generateBalance(wallet.currnecy.format, wallet.monthExpenses)}
          </p>
        </div>
      </div>
    </div>

  )
}

export default WalletsSection