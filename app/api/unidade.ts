"use server"

export async function getUnidades() {
    const url = 'http://10.107.134.34:8080/v1/pas/unidades'

    const response = await fetch(url) // (aguarda) faz uma requisição pra url

    const data = await response.json() // espera o response executar o json com os dados

    return data 
}