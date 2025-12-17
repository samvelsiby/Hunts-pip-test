export const CLOUDFLARE_STREAM = {
  accountId: '489f932edab80dec3ec3ed8dccd8bf17',
  customerSubdomain: 'customer-pyq7haxijl6gyz2i.cloudflarestream.com',
  apiBase: 'https://api.cloudflare.com/client/v4',
} as const

export const CLOUDFLARE_STREAM_UIDS = {
  obCharts: '4d5b7e08ebc6f0fc2f528c835d9e4932',
  services2: '9c3ff996efb813d7f2513ba48c589f75',
  phooen: 'd58e10884bffd3a50e097903c6138116',
  tradeChartsLoop: 'cb7a0b865d518a51f2efbad53f509320',
  comp1: '5c79505553e17a1ce57ba51d5da60f28',
} as const

export function cloudflareStreamHlsUrl(uid: string) {
  return `https://${CLOUDFLARE_STREAM.customerSubdomain}/${uid}/manifest/video.m3u8`
}


