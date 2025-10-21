"use server"

export async function getUnidades() {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/'

    try {
        
        const response = await fetch(url) 

        if (!response.ok) {
            console.error('❌ Erro na resposta getUnidades:', response.status, response.statusText)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json() 
        
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