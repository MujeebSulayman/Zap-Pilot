const EARN_BASE_URL = 'https://earn.li.fi'
const COMPOSER_BASE_URL = 'https://li.quest/v1'

interface FetchOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

async function lifiFetch<T>(baseUrl: string, endpoint: string, options: FetchOptions = {}): Promise<T> {
  // Ensure we don't end up with double slashes
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${cleanBase}${cleanEndpoint}`
  
  console.log(`[LI.FI Fetch] ${url}`) // Added for debugging
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (process.env.LIFI_API_KEY) {
    headers['x-lifi-api-key'] = process.env.LIFI_API_KEY
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`LI.FI API error: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return res.json()
}

export async function getEarnVaults(params?: {
  chainId?: number
  asset?: string
  protocol?: string
  minTvlUsd?: number
  sortBy?: 'apy' | 'tvl'
  limit?: number
  cursor?: string
}) {
  const queryParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
  }
  
  const endpoint = queryParams.toString() ? `/v1/vaults?${queryParams.toString()}` : '/v1/vaults'
  return lifiFetch<any>(EARN_BASE_URL, endpoint)
}

export async function getEarnVaultByAddress(chainId: number, address: string) {
  return lifiFetch<any>(EARN_BASE_URL, `/v1/vaults/${chainId}/${address}`)
}

export async function getEarnChains() {
  return lifiFetch<any>(EARN_BASE_URL, '/v1/chains')
}

export async function getEarnProtocols() {
  return lifiFetch<any>(EARN_BASE_URL, '/v1/protocols')
}

// Get portfolio positions for an address
export async function getEarnPortfolio(walletAddress: string) {
  return lifiFetch<any>(EARN_BASE_URL, `/v1/portfolio/${walletAddress}/positions`)
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

