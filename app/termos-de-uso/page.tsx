import styles from "./page.module.css";

export default function TermsConditionsPage(){
    return(
        <main className={styles.main}>
            <div className={styles.label}>
                <img src="/images/paslogo.png" alt="logo do site PAS: Painel de Acesso a Saúde" />
                <h1>Termos de uso e Responsabilidade</h1>
            </div>
            <div className={styles.content}>
                <p>
                    Ao utilizar este aplicativo, o usuário reconhece e concorda com as condições descritas a seguir: 
                </p>
                <div className={styles.list}>
                    <section>
                        <h2>1. Finalidade do Serviço</h2>
                        <ul>
                            <li>O aplicativo tem como objetivo disponibilizar informações sobre o tempo de espera em unidades públicas de saúde.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Coleta e Tratamento de Dados</h2>
                        <ul>
                            <li>Poderão ser coletados dados pessoais como:
                                <ul>
                                    <li>CPF;</li>
                                    <li>E-mail gov.br (quando aplicável);</li>
                                    <li>Dados de saúde estritamente necessários à finalidade do serviço;</li>
                                </ul>
                            </li>
                            <li>O tratamento dos dados respeita a Lei Geral de Proteção de Dados – LGPD (Lei nº 13.709/2018).</li>
                            <li>As informações coletadas serão utilizadas exclusivamente para as finalidades previstas neste Termo.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Compartilhamento de Dados</h2>
                        <ul>
                            <li>Não haverá compartilhamento de dados pessoais com terceiros, salvo quando exigido por lei ou ordem judicial.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Responsabilidades do Usuário</h2>
                        <ul>
                            <li>Fornecer informações corretas e atualizadas no cadastro;</li>
                            <li>Manter o sigilo de suas credenciais de acesso;</li>
                            <li>Utilizar o aplicativo apenas para as finalidades previstas neste Termo.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Responsabilidades do Governo Federal (gov.br)</h2>
                        <ul>
                            <li>O Governo Federal do Brasil (gov.br) não se responsabiliza por:
                                <ul>
                                    <li>Falhas técnicas temporárias ou indisponibilidade do sistema;</li>
                                    <li>Informações incorretas fornecidas pelo usuário;</li>
                                    <li>Acesso indevido decorrente de uso inadequado das credenciais do usuário.</li>
                                </ul>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Atualizações do Termo</h2>
                        <ul>
                            <li>Este Termo poderá ser atualizado a qualquer momento, sem aviso prévio.</li>
                            <li>É responsabilidade do usuário consultar regularmente esta página para verificar eventuais alterações.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Aceite</h2>
                        <ul>
                            <li>O uso do aplicativo implica a leitura, compreensão e aceite integral deste Termo.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    )
}