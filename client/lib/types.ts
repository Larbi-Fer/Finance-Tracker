interface UserProps {
  id: string
  username: string
  email: string
}

interface WalletMainProps {
  id: string
  name: string
  balance: number
  icon?: string
  currnecy: {
    format: string
  }
}

interface WalletProps {
  id: string
  name: string
  currencyId: string
  incomeBalance: number
  expensesBalance: number
  icon?: string
  currnecy: {
    name: string
    format: string
  }
  monthIncomes: number
  monthExpenses: number
}

interface WalletAndTotalDataProps {
  wallets: WalletDataProps[]
  balance: TotalBalanceProps[]
}

interface TotalBalanceProps {
  total: number
  monthIncomes: number
  monthExpenses: number
  currency: {
    name: string
    format: string
  }
}

interface ExpenseProps {
  id: string,
  title: string,
  amount: number | string,
  date: string,
  icon?: string
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
  icon?: string
  source: {
    id: string,
    title: string
  }
  wallet?: WalletInsideExpenseProps | string
}

interface WalletDataProps extends WalletProps {
  expenses: ExpenseProps[]
  incomes: IncomeProps[]
}

// category
interface CategoryProps {
  id: string
  title: string
  _count: {
    expenses: number
  }
  budget: {
    amount: number
    currency: { format: string }
    spent: number
  }[]
}

// income source
interface SourceProps {
  id: string
  title: string
  _count: {
    incomes: number
  }
  currency: { format: string }
  earned: number
}


interface CurrencyProps {
  id: string
  name: string
  format: string
}