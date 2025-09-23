"use client"

import { NextPage } from 'next'
import Input from '../components/inputLogin/input'
import Form from "next/form";
import './page.css'
import React from 'react';

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [cpf, setCpf] = React.useState("")

  return (
    <main>
      <img src="/images/paslogo.png" alt="PAS Logo" className='logoLogin'/>
      <h1>Login</h1>

      <div className='containerGov'>
         <h2>Entre com a conta</h2>   
         <img src="/images/govlogo.png" alt="gov.br logo"/>
      </div>

      <Form action="" className='form'>
        <Input name='cpf' srcImg='https://files.svgcdn.io/solar/card-2-outline.svg' heightImg='80%' isCPF={true} value={cpf} onChange={setCpf} type='text'></Input>
        <Input name='senha' srcImg='https://files.svgcdn.io/fa6-solid/lock.svg' heightImg='60%' type='password'></Input>

        <label>
            <input type="checkbox" name="accept" required/>
             <span className="checkmark"></span>
           <p>
            Li e aceito os{" "}
            <span style={{ color: "#298BE6" }}>Termos de Uso</span>{" "}
            e a{" "}
            <span style={{ color: "#298BE6" }}>Política de Privacidade</span>
          </p>
        </label>

        <button type="submit">ENTRAR</button>
      </Form>

      <p style={{color: "#298BE6", paddingTop: "3vh"}}>Não tem conta? <a href="https://sso.acesso.gov.br/" style={{ color: "#0B2A46", fontWeight: "500"}}>Cadastre-se</a></p>

      <button className='noLogin'>Continuar sem login</button>
     
    </main>
  )
}

export default Page