const LIFI_BASE_URL = 'https://li.quest/v1'

interface FetchOptions {
  method?: string
  body?: any
}

async function lifiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${LIFI_BASE_URL}${endpoint}`
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
    // Add cache revalidation if helpful, but Earn yields shouldn't be overly stale
    next: { revalidate: 60 * 5 } // cache for 5 minutes
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`LI.FI API error: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return res.json()
}

export async function getEarnVaults() {
  // To get vaults we might just want a full list or some top generic ones
  return lifiFetch<any>('/earn/vaults')
}

export async function getEarnVaultByAddress(chainId: number, address: string) {
  // Some endpoints might exist to query specific vault, or we just filter from list
  const vaults = await getEarnVaults()
  return (vaults.vaults || []).find((v: any) => v.chainId === chainId && v.address.toLowerCase() === address.toLowerCase())
}

export async function getEarnChains() {
  return lifiFetch<any>('/earn/chains')
}

export async function getEarnProtocols() {
  return lifiFetch<any>('/earn/protocols')
}

// Get portfolio positions for an address
export async function getEarnPortfolio(walletAddress: string) {
  return lifiFetch<any>(`/earn/portfolio?account=${walletAddress}`)
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
    toToken: vaultAddress, // critical requirement for composer
    fromAddress,
    toAddress,
    fromAmount
  })
  
  return lifiFetch<any>(`/quote?${queryParams.toString()}`)
}

// Notice that withdrawing needs a proper Composer implementation if isRedeemable is true
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
  
  return lifiFetch<any>(`/quote?${queryParams.toString()}`)
}
