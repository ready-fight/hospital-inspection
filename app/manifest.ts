import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '設備定期点検',
    short_name: '設備点検',
    description: '病院設備の定期保守点検報告システム',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f5f7',
    theme_color: '#183153',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
    ]
  }
}
