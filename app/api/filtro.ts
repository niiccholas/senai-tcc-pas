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

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtros),
    })

    const json = await response.json()

    return json

}