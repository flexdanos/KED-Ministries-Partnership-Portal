interface PaystackTransaction {
  id: string
  domain: string
  status: string
  reference: string
  amount: number
  message: string
  gateway_response: string
  paid_at: string
  created_at: string
  channel: string
  currency: string
  ip_address: string
  metadata: {
    custom_fields: Array<{
      display_name: string
      variable_name: string
      value: string
    }>
    consumer_id: number
    consumer: {
      email: string
      phonenumber: string
      name: string
    }
  }
  fees: number
  authorization: {
    authorization_code: string
    bin: string
    last4: string
    exp_month: string
    exp_year: string
    card_type: string
    bank: string
    country_code: string
    brand: string
    reusable: boolean
    signature: string
  }
  customer: {
    id: number
    first_name: string
    last_name: string
    email: string
    customer_code: string
    phone: string
    metadata: any
    risk_action: string
    international_format_phone: string
  }
  plan: string
  subaccount: string
  split: any
  order_id: string
  paidAt: string
  createdAt: string
  transaction_date: string
  plan_object: any
  subaccount_object: any
}

interface PaystackResponse<T> {
  status: boolean
  message: string
  data: T
}

interface TransactionListResponse {
  status: boolean
  message: string
  data: PaystackTransaction[]
  meta: {
    total: number
    skipped: number
    perPage: number
    page: number
    pageCount: number
  }
}

class PaystackService {
  private secretKey: string
  private baseUrl = 'https://api.paystack.co'

  constructor() {
    this.secretKey = import.meta.env.VITE_PAYSTACK_SECRET_KEY || ''
    console.log('Paystack secret key status:', {
      hasKey: !!this.secretKey,
      keyLength: this.secretKey.length,
      keyPrefix: this.secretKey.substring(0, 10) + '...',
      envVars: Object.keys(import.meta.env).filter(k => k.includes('PAYSTACK'))
    })
    if (!this.secretKey) {
      console.error('Paystack secret key not found in environment variables')
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders = {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Paystack API request failed:', error)
      throw error
    }
  }

  async getTransactions(options: {
    perPage?: number
    page?: number
    from?: string
    to?: string
    status?: string
  } = {}): Promise<TransactionListResponse> {
    const params = new URLSearchParams()
    
    if (options.perPage) params.append('perPage', options.perPage.toString())
    if (options.page) params.append('page', options.page.toString())
    if (options.from) params.append('from', options.from)
    if (options.to) params.append('to', options.to)
    if (options.status) params.append('status', options.status)

    const endpoint = `/transaction?${params.toString()}`
    return this.makeRequest<TransactionListResponse>(endpoint)
  }

  async getTransaction(id: string): Promise<PaystackResponse<PaystackTransaction>> {
    return this.makeRequest<PaystackResponse<PaystackTransaction>>(`/transaction/${id}`)
  }

  async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date,
    status?: string
  ): Promise<TransactionListResponse> {
    const from = startDate.toISOString().split('T')[0]
    const to = endDate.toISOString().split('T')[0]
    
    return this.getTransactions({
      from,
      to,
      status,
      perPage: 100
    })
  }

  async getTransactionTotals(
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const params = new URLSearchParams()
    
    if (startDate) {
      const from = startDate.toISOString().split('T')[0]
      params.append('from', from)
    }
    
    if (endDate) {
      const to = endDate.toISOString().split('T')[0]
      params.append('to', to)
    }

    const endpoint = `/transaction/totals?${params.toString()}`
    return this.makeRequest(endpoint)
  }

  formatTransaction(transaction: PaystackTransaction) {
    return {
      id: transaction.id,
      reference: transaction.reference,
      date: new Date(transaction.created_at).toLocaleDateString(),
      description: this.getTransactionDescription(transaction),
      category: transaction.amount > 0 ? 'Revenue' : 'Expenses',
      amount: transaction.amount / 100, // Convert from kobo to naira
      status: transaction.status,
      customer: transaction.customer?.email || 'Unknown',
      paymentMethod: transaction.channel || 'Unknown',
      metadata: transaction.metadata
    }
  }

  private getTransactionDescription(transaction: PaystackTransaction): string {
    if (transaction.metadata?.custom_fields) {
      const customField = transaction.metadata.custom_fields.find(
        (field: any) => field.variable_name === 'description'
      )
      if (customField?.value) {
        return customField.value
      }
    }
    
    if (transaction.customer?.email) {
      return `Payment from ${transaction.customer.email}`
    }
    
    return `Transaction ${transaction.reference}`
  }
}

export const paystackService = new PaystackService()
export type { PaystackTransaction, TransactionListResponse }
