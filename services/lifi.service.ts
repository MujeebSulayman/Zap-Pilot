const EARN_BASE_URL = 'https://earn.li.fi'
const COMPOSER_BASE_URL = 'https://li.quest/v1'

let tokenMetadataCache: Record<string, any> | null = null
let protocolMetadataCache: any[] | null = null
let lastMetadataFetch = 0
let lastProtocolFetch = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

async function getTokenMetadata() {
  const now = Date.now()
  if (tokenMetadataCache && (now - lastMetadataFetch < CACHE_DURATION)) {
    return tokenMetadataCache
  }

  try {
    const res = await fetch(`${COMPOSER_BASE_URL}/tokens`)
    const data = await res.json()
    tokenMetadataCache = data.tokens || {}
    lastMetadataFetch = now
    return tokenMetadataCache
  } catch (error) {
    console.error('Failed to fetch LI.FI token metadata:', error)
    return {}
  }
}

async function getProtocolMetadata() {
  const now = Date.now()
  if (protocolMetadataCache && (now - lastProtocolFetch < CACHE_DURATION)) {
    return protocolMetadataCache
  }

  try {
    // Using verified production path (verified via curl)
    const res = await fetch(`${EARN_BASE_URL}/v1/protocols`)
    const data = await res.json()
    protocolMetadataCache = Array.isArray(data) ? data : []
    lastProtocolFetch = now
    return protocolMetadataCache
  } catch (error) {
    console.error('Failed to fetch LI.FI protocol metadata:', error)
    return []
  }
}

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

  const data = await res.json()
  const [tokenMetadata, protocolMetadata] = await Promise.all([
    getTokenMetadata(),
    getProtocolMetadata()
  ])
  
  // Enrich data with REAL metadata stitching
  if (data.data && Array.isArray(data.data)) {
    data.data = data.data.map((vault: any) => enrichVault(vault, tokenMetadata, protocolMetadata))
  } else if (data && typeof data === 'object' && !Array.isArray(data)) {
    return enrichVault(data, tokenMetadata, protocolMetadata)
  }

  return data
}

function enrichVault(vault: any, tokenMetadata: any, protocolMetadata: any[]) {
  // 1. Asset Logos
  if (vault.underlyingTokens && vault.underlyingTokens[0]) {
    const asset = vault.underlyingTokens[0]
    const chainTokens = tokenMetadata[vault.chainId.toString()] || []
    const tokenInfo = chainTokens.find((t: any) => 
      t.address.toLowerCase() === asset.address.toLowerCase()
    )
    if (tokenInfo?.logoURI) {
      vault.underlyingTokens[0].logoURI = tokenInfo.logoURI
    } else {
      // 3. FALLBACK: Zapper.fi verified asset registry
      const networkMap: Record<number, string> = {
        1: 'ethereum',
        8453: 'base',
        42161: 'arbitrum',
        137: 'polygon',
        10: 'optimism',
        43114: 'avalanche',
        56: 'binance'
      }
      const networkName = networkMap[vault.chainId]
      if (networkName) {
        vault.underlyingTokens[0].logoURI = `https://storage.googleapis.com/zapper-fi-assets/tokens/${networkName}/${asset.address.toLowerCase()}.png`
      }
    }
  }
  
  // 2. Protocol Logos with Smart Slug Resolution
  const protocolName = typeof vault.protocol === 'string' ? vault.protocol : vault.protocol?.name
  if (protocolName) {
    // 1. Try to find in LI.FI registry first
    const protoInfo = protocolMetadata.find((p: any) => {
      const pName = p.name.toLowerCase()
      const vName = protocolName.toLowerCase()
      return vName.includes(pName) || pName.includes(vName)
    })
    
    let resolvedLogo = protoInfo?.logoUri
    
    // 2. FALLBACK: Institutional Slug Resolver (DeFi Llama Registry)
    if (!resolvedLogo) {
      // Manual mapping for tricky protocol names
      const slugMap: Record<string, string> = {
        'aave-v3': 'aave',
        'euler-v2': 'euler',
        'ethena-usde': 'ethena',
        'ether.fi-liquid': 'etherfi',
        'ether.fi-stake': 'etherfi',
        'yo-protocol': 'yo.xyz',
        'spark-savings': 'spark',
        'maple': 'maple',
        'pendle': 'pendle-finance',
        'upshift': 'upshift',
        'neverland': 'neverland-finance'
      }

      const slug = slugMap[protocolName.toLowerCase()] || protocolName.split('-')[0].split('.')[0].toLowerCase()
      resolvedLogo = `https://icons.llama.fi/${slug}.png`
    }
    
    if (typeof vault.protocol === 'string') {
      vault.protocol = { name: protocolName, logoURI: resolvedLogo, url: protoInfo?.url || '#' }
    } else {
      vault.protocol.logoURI = resolvedLogo
    }
  }
  
  return vault
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

