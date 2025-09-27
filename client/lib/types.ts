interface UserProps {
  id: string
  username: string
  email: string
}

interface WalletProps {
  id: string
  name: string
  currencyId: string
  incomeBalance: number
  expensesBalance: number
  currnecy: {
      name: string
      format: string
  }
  monthIncomes: number
  monthExpenses: number
}

interface WalletAndTotalDataProps {
  wallets: WalletDataProps
  balance: TotalBalanceProps
}

interface TotalBalanceProps {
  total: number
  totalIncomes: number
  totalExpenses: number
}

interface ExpenseProps {
  id: string,
  title: string,
  amount: number,
  date: string,
  category: {
    id: string,
    title: string
  }
}

interface IncomeProps {
  id: string,
  title?: string,
  amount: number,
  date: string,
  source: {
    id: string,
    title: string
  }
}

interface WalletDataProps extends WalletProps {
  expenses: ExpenseProps[]
  incomes: IncomeProps[]
}