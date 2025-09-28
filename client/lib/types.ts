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
  wallets: WalletDataProps[]
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
  amount: number | string,
  date: string,
  category: {
    id: string,
    title: string
  }
  categoryId?: string
  wallet?: WalletInsideExpenseProps | string
  walletId?: string
}

interface WalletInsideExpenseProps {
  id: string
  name: string
  currnecy?: {
    format: string
  }
}

interface IncomeProps {
  id: string,
  title?: string,
  amount: number | string,
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

// category
interface CategoryProps {
  id: string
  title: string
  amount: number
  _count: {
    expenses: number
  }
  month: number
}