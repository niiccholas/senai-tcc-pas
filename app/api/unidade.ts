"use server"

export async function getUnidades() {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/'

    console.log('=== API GETUNIDADES INICIADA ===')
    console.log('URL:', url)

    try {
        console.log('🚀 Fazendo requisição para API getUnidades...')
        
        const response = await fetch(url) // (aguarda) faz uma requisição pra url

        console.log('📡 Resposta recebida!')
        console.log('Status da resposta:', response.status)
        console.log('Response OK:', response.ok)

        if (!response.ok) {
            console.error('❌ Erro na resposta getUnidades:', response.status, response.statusText)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        console.log('📋 Convertendo resposta para JSON...')
        const data = await response.json() // espera o response executar o json com os dados

        console.log('✅ Resposta da API getUnidades completa:', data)
        console.log('Tipo da resposta:', typeof data)
        console.log('Chaves da resposta:', Object.keys(data))
        
        if (data.unidades) {
            console.log('📍 Unidades encontradas:', data.unidades.length)
            console.log('Primeira unidade:', data.unidades[0])
        } else if (Array.isArray(data)) {
            console.log('📍 Array de unidades encontrado:', data.length)
            console.log('Primeira unidade:', data[0])
        } else {
            console.log('⚠️ Estrutura de resposta não reconhecida')
        }

        return data 
    } catch (error) {
        console.error('💥 Erro na API getUnidades:', error)
        throw error
    }
}

export async function getUnidadesById(id: string) {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/' + id

    const response = await fetch(url) // (aguarda) faz uma requisição pra url

    const data = await response.json() // espera o response executar o json com os dados

    return data 
}