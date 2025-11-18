"use server"

export async function getCategorias() {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/categoria'

    const response = await fetch(url)

    const data = await response.json()

    return data.categorias
}

export async function getEspecialidades() {

    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/especialidade'

    const response = await fetch(url)

    const data = await response.json()

    return data.especialidades
    
}

export async function filtrar(filtros: object){

    const url = "https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/filtrar"

    console.log('=== API FILTRAR INICIADA ===')
    console.log('URL:', url)
    console.log('Filtros enviados:', filtros)
    console.log('JSON enviado:', JSON.stringify(filtros))

    try {
        console.log(' Fazendo requisição para API...')
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filtros),
        })

        console.log(' Resposta recebida!')
        console.log('Status da resposta:', response.status)
        console.log('Response OK:', response.ok)
        console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
            console.error(' Erro na resposta:', response.status, response.statusText)
            const errorText = await response.text()
            console.error('Texto do erro:', errorText)
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }

        console.log(' Convertendo resposta para JSON...')
        const json = await response.json()
        
        console.log(' Resposta da API filtrar completa:', json)
        console.log('Tipo da resposta:', typeof json)
        console.log('Chaves da resposta:', Object.keys(json))
        
        if (json.unidadesDeSaude) {
            console.log(' Unidades encontradas:', json.unidadesDeSaude.length)
            console.log('Primeira unidade:', json.unidadesDeSaude[0])
        } else {
            console.log(' Propriedade unidadesDeSaude não encontrada')
        }

        return json
    } catch (error) {
        console.error(' Erro na API filtrar:', error)
        console.error('Stack trace:', error.stack)
        throw error
    }

}