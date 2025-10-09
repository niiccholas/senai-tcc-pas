"use server"

export async function getEspecilidade() {
    const url = ' https://api-tcc-node-js-1.onrender.com/v1/pas/especialidade'

    const response = await fetch(url) // (aguarda) faz uma requisição pra url

    const data = await response.json() // espera o response executar o json com os dados

    return data 
}
