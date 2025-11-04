import { NextRequest, NextResponse } from 'next/server'

// Cache em memória para geocodificação (TTL: 24 horas)
const geocodeCache = new Map<string, { coords: any; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 horas em millisegundos

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cep = searchParams.get('cep')

  if (!cep) {
    return NextResponse.json({ error: 'CEP é obrigatório' }, { status: 400 })
  }

  try {
    // Remover caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '')
    
    // Verificar cache primeiro
    const cached = geocodeCache.get(cepLimpo)
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log('🎯 Cache hit para CEP:', cepLimpo)
      
      // Retornar com headers de cache
      const response = NextResponse.json(cached.coords)
      response.headers.set('Cache-Control', 'public, max-age=86400') // 24 horas
      response.headers.set('X-Cache', 'HIT')
      return response
    }
    
    console.log('🔍 Geocodificando CEP via Nominatim:', cepLimpo)
    
    // Usar API do Nominatim com CEP brasileiro
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&country=Brazil&postalcode=${cepLimpo}&limit=1`,
      {
        headers: {
          'User-Agent': 'PAS-TCC-App/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      }
      
      // Salvar no cache
      geocodeCache.set(cepLimpo, {
        coords,
        timestamp: Date.now()
      })
      
      // Limpar cache antigo periodicamente
      if (geocodeCache.size > 1000) {
        const now = Date.now()
        for (const [key, value] of geocodeCache.entries()) {
          if (now - value.timestamp > CACHE_TTL) {
            geocodeCache.delete(key)
          }
        }
      }
      
      console.log('✅ CEP geocodificado e salvo no cache:', cepLimpo)
      
      const nextResponse = NextResponse.json(coords)
      nextResponse.headers.set('Cache-Control', 'public, max-age=86400') // 24 horas
      nextResponse.headers.set('X-Cache', 'MISS')
      return nextResponse
    } else {
      // Salvar resultado negativo no cache por menos tempo (1 hora)
      geocodeCache.set(cepLimpo, {
        coords: null,
        timestamp: Date.now()
      })
      
      return NextResponse.json({ error: 'Coordenadas não encontradas para o CEP' }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Erro ao geocodificar CEP:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
