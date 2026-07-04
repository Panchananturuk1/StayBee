export type StaybeeImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9'

export function staybeeImage(prompt: string, imageSize: StaybeeImageSize) {
  const encodedPrompt = encodeURIComponent(prompt)
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=${imageSize}`
}
