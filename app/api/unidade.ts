"use server"

export async function getUnidades() {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/'

    const response = await fetch(url) // (aguarda) faz uma requisição pra url

    const data = await response.json() // espera o response executar o json com os dados

    return data 
}

export async function getUnidadesById(id: string) {
    const url = 'https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/' + id

    const response = await fetch(url) // (aguarda) faz uma requisição pra url

    const data = await response.json() // espera o response executar o json com os dados

    return data 
}