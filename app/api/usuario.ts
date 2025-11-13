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

export async function atualizarUsuario(id: string, dadosUsuario: any) {
  const url = `https://api-fake-de-usuarios-com-json-server-3.onrender.com/usuarios/${id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosUsuario),
    });

    if (!response.ok) {
      console.error('❌ Erro na atualização:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Usuário atualizado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('💥 Erro ao atualizar usuário:', error);
    throw error;
  }
}