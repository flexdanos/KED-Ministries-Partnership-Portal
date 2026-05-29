import CheckoutSdk, { type Config, type PurchaseInfo, type Callbacks } from '@hubteljs/checkout'

const clientId = import.meta.env.VITE_HUBTEL_CLIENT_ID || ''
const clientSecret = import.meta.env.VITE_HUBTEL_CLIENT_SECRET || ''
const merchantAccount = parseInt(import.meta.env.VITE_HUBTEL_MERCHANT_ACCOUNT || '0')
const callbackUrl = import.meta.env.VITE_HUBTEL_CALLBACK_URL || ''

export const hubtelConfig: Config = {
  branding: 'enabled',
  callbackUrl,
  merchantAccount,
  basicAuth: btoa(`${clientId}:${clientSecret}`),
  integrationType: 'External',
  allowedChannels: ['mobileMoney', 'bankCard'],
}

export function openHubtelModal(
  purchaseInfo: PurchaseInfo,
  callBacks: Callbacks
) {
  const checkout = new CheckoutSdk()
  checkout.openModal({ purchaseInfo, config: hubtelConfig, callBacks })
  return checkout
}

export async function checkTransactionStatus(clientReference: string): Promise<any> {
  const url = `https://api-txnstatus.hubtel.com/transactions/0553535875/status?clientReference=${clientReference}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`, // REST API still uses standard Basic Auth
    },
  })
  return response.json()
}
