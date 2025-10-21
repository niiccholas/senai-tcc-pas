"use client"

import { NextPage } from 'next'
import Input from '../components/inputLogin/input'
import Form from "next/form"
import styles from './page.module.css'
import { loginUsuario } from "../api/usuario"
import React from 'react'
import { useRouter } from "next/navigation"

const Page: NextPage<{}> = ({}) => {
  const [cpf, setCpf] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [onErrorCheckmark, setErrorCheckmark] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const router = useRouter()

  async function handleLogin(formData: FormData) {
    setLoading(true)
    try {
      const cpf = formData.get("cpf") as string
      const rawCpf = cpf.replace(/\D/g, "")
      const senha = formData.get("senha") as string

      const data = await loginUsuario(rawCpf, senha)

      if (data.status) {
        router.push("/inicio")
      } else {
        alert("Login inválido")
      }
    } catch (error) {
      console.error('Erro no login:', error)
      alert("Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <img src="/images/paslogo.png" alt="PAS Logo" className={styles.logoLogin} />
      <h1 className={styles.title}>Login</h1>

      <div className={styles.containerGov}>
        <h2>Entre com a conta</h2>
        <img src="/images/govlogo.png" alt="gov.br logo" />
      </div>

      <Form action={handleLogin} className={styles.form}>
        <Input
          name="cpf"
          srcImg="https://files.svgcdn.io/solar/card-2-outline.svg"
          heightImg="80%"
          isCPF={true}
          value={cpf}
          onChange={setCpf}
          type="text"
        />
        <Input
          name="senha"
          srcImg="https://files.svgcdn.io/fa6-solid/lock.svg"
          heightImg="60%"
          value={password}
          onChange={setPassword}
          type="password"
        />

        <label className={styles.label}>
          <input
            type="checkbox"
            name="accept"
            onChange={() => setErrorCheckmark(prev => !prev)}
            required
          />
          <span className={styles.checkmark}></span>
          <p className={styles.termos}>
            Li e aceito os{" "}
            <span style={{ color: "#298BE6" }}>Termos de Uso</span>{" "}
            e a{" "}
            <span style={{ color: "#298BE6" }}>Política de Privacidade</span>
          </p>
        </label>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Carregando..." : "ENTRAR"}
        </button>
      </Form>

      <p style={{ color: "#298BE6", paddingTop: "3vh" }}>
        Não tem conta?{" "}
        <a
          href="https://sso.acesso.gov.br/"
          className={styles.link}
          style={{ color: "#0B2A46", fontWeight: "500" }}
        >
          Cadastre-se
        </a>
      </p>

      <button className={styles.noLogin} onClick={() => router.push("/inicio")}>
        Continuar sem login
      </button>
    </main>
  )
}

export default Page