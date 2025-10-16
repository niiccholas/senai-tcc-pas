"use server"

export async function getCategorias() {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/categoria'

    const response = await fetch(url) // (aguarda) faz uma requisição pra url

    const data = await response.json() // espera o response executar o json com os dados

    return data.categorias
}

export async function getEspecialidades() {

    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/especialidade'

    const response = await fetch(url) // (aguarda) faz uma requisição pra url

    const data = await response.json() // espera o response executar o json com os dados

    return data.especialidades
    
}

export async function filtrar(filtros: object){

    const url = "https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/filtrar"

    console.log('=== API FILTRAR ===')
    console.log('URL:', url)
    console.log('Filtros enviados:', filtros)
    console.log('JSON enviado:', JSON.stringify(filtros))

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtros),
    })

    const json = await response.json()
    
    console.log('Resposta da API filtrar:', json)
    console.log('Status da resposta:', response.status)

    return json

}