"use server"

export async function getCategoria() {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/categoria'

    try {
        const response = await fetch(url) // (aguarda) faz uma requisição pra url
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json() // espera o response executar o json com os dados
        
        // Verifica se os dados estão no formato esperado
        if (data && Array.isArray(data.categorias)) {
            return data.categorias
        } else if (Array.isArray(data)) {
            return data
        } else {
            console.error('Formato de dados inesperado:', data)
            return []
        }
    } catch (error) {
        console.error('Erro ao buscar categorias:', error)
        return []
    }
}