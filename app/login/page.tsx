import { NextPage } from 'next'

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <main>
      <img src="/images/paslogo.png" alt="PAS Logo"/>
      <h1>Login</h1>
      <div>
         <h2>Entre com a conta</h2>   
         <img src="/images/govlogo.png" alt="gov.br logo"/>
      </div>
      
    </main>
  )
}

export default Page