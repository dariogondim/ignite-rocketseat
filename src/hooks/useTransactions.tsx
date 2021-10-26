import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

interface Transaction {
    id: number
    title: string
    amount: number
    type: string
    category: string
    createdAt: string
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionResponse {
    transactions: Transaction[];
}

interface TransactionsProviderProps {
    children: ReactNode
}

interface TransactionsContextData {
    transactions: Transaction[]
    createTransaction: (transaction: TransactionInput) => Promise<void>
}

const TransactionContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        api.get<TransactionResponse>('transactions')
        .then(response => setTransactions(response.data.transactions))
    }, [])

    async function createTransaction(transactionInput:TransactionInput){     
        const response = await api.post('/transaction', 
        {
            ...transactionInput, 
            createdAt: new Date()
        })
        
        const { transaction } = response.data as any
     
        setTransactions([
            ...transactions,
            transaction
        ])
    }

    return (
        <TransactionContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}


export function useTransactions() {
    const context = useContext(TransactionContext)

    return context
}