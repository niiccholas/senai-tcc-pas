"use server"

export async function getEspecialidade() {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/especialidade'

    try {
        const response = await fetch(url) // (aguarda) faz uma requisição pra url
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json() // espera o response executar o json com os dados
        
        // Verifica se os dados estão no formato esperado
        if (data && Array.isArray(data.especialidades)) {
            return data.especialidades
        } else if (Array.isArray(data)) {
            return data
        } else {
            console.error('Formato de dados inesperado:', data)
            return []
        }
    } catch (error) {
        console.error('Erro ao buscar especialidades:', error)
        return []
    }
}
