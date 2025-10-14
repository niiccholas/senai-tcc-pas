"use server"

export async function getCampanhas() {
    const url = 'https://api-fake-de-campanhas-com-json-server-1.onrender.com/campanhas'

    const response = await fetch(url) // (aguarda) faz uma requisição pra url

    const data = await response.json() // espera o response executar o json com os dados

    return data 
}