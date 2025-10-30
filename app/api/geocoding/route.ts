import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cep = searchParams.get('cep')

  if (!cep) {
    return NextResponse.json({ error: 'CEP é obrigatório' }, { status: 400 })
  }

  try {
    // Remover caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '')
    
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
      return NextResponse.json(coords)
    } else {
      return NextResponse.json({ error: 'Coordenadas não encontradas para o CEP' }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Erro ao geocodificar CEP:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
