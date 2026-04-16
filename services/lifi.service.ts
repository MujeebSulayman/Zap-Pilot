const EARN_BASE_URL = 'https://earn.li.fi/v1/earn'
const COMPOSER_BASE_URL = 'https://li.quest/v1'

interface FetchOptions {
  method?: string
  body?: any
}

async function lifiFetch<T>(baseUrl: string, endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${baseUrl}${endpoint}`
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  
  if (process.env.LIFI_API_KEY) {
    headers['x-lifi-api-key'] = process.env.LIFI_API_KEY
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    next: { revalidate: 60 * 5 } // cache for 5 minutes
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`LI.FI API error: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return res.json()
}

export async function getEarnVaults() {
  return lifiFetch<any>(EARN_BASE_URL, '/vaults')
}

export async function getEarnVaultByAddress(chainId: number, address: string) {
  return lifiFetch<any>(EARN_BASE_URL, `/vaults/${chainId}/${address}`)
}

export async function getEarnChains() {
  return lifiFetch<any>(EARN_BASE_URL, '/chains')
}

export async function getEarnProtocols() {
  return lifiFetch<any>(EARN_BASE_URL, '/protocols')
}

// Get portfolio positions for an address
export async function getEarnPortfolio(walletAddress: string) {
  return lifiFetch<any>(EARN_BASE_URL, `/portfolio/${walletAddress}/positions`)
}

export async function getQuoteForDeposit(
  fromChain: number,
  toChain: number,
  fromToken: string,
  vaultAddress: string, // this is the toToken for Composer
  fromAddress: string,
  toAddress: string,
  fromAmount: string
) {
  const queryParams = new URLSearchParams({
    fromChain: fromChain.toString(),
    toChain: toChain.toString(),
    fromToken,
    toToken: vaultAddress,
    fromAddress,
    toAddress,
    fromAmount
  })
  
  return lifiFetch<any>(COMPOSER_BASE_URL, `/quote?${queryParams.toString()}`)
}

export async function getQuoteForWithdraw(
  fromChain: number,
  toChain: number,
  vaultAddress: string, // fromToken
  destinationToken: string, // toToken
  fromAddress: string,
  toAddress: string,
  fromAmount: string
) {
  const queryParams = new URLSearchParams({
    fromChain: fromChain.toString(),
    toChain: toChain.toString(),
    fromToken: vaultAddress,
    toToken: destinationToken,
    fromAddress,
    toAddress,
    fromAmount
  })
  
  return lifiFetch<any>(COMPOSER_BASE_URL, `/quote?${queryParams.toString()}`)
}

