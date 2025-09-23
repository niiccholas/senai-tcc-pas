"use server" // ao mexer com a api, é recomendável rodar no server component

export async function loginUsuario(cpf: string, senha: string) {
  const url = "https://api-fake-de-usuarios-com-json-server-3.onrender.com/login";

  const usuario = { cpf, senha };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  })

  let status = false

  const json = await response.json()

  if(response.ok){
    status = true
  }

  json.status = status

  return json
}