import styles from "./page.module.css";

export default function ProfileSettingsPage(){
    return(
        <main className={styles.main}>
            <div className={styles.systemSettings}>
                <div className={styles.options}>
                    <div className={styles.photo}>
                        <img src="null" alt="" />
                    </div> 
                        <ul>Tema</ul>
                        <ul>Idioma</ul>
                        <ul>Contato</ul>
                        <ul><a href="/termos-de-uso">Termos de uso</a></ul>
                        <ul><a href="/sobre">Sobre</a></ul>
                </div>
                <button>Desconectar</button>
            </div>
            <div className={styles.accountSettings}>
                <div className={styles.personalData}>
                    <h4>Dados pessoais</h4>
                    <div className={styles.personalContent}>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/user-verification%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Nome completo</p>
                                    <span>Jair Messias Bolsonaro</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/id-card%20(1)%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>CPF</p>
                                    <span>123.456.789-00</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/worldwide%20(1)%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Naturalidade</p>
                                    <span>Barueri/SP</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/calendar%20(1)%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Nascimento</p>
                                    <span>10/10/2007</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/mom%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Nome da Mãe</p>
                                    <span>Virgínia Fonseca</span>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className={styles.registrationData}>
                    <h4>Dados de cadastro</h4>
                    <div className={styles.registrationContent}>
                        <ul>
                            <div className={styles.registrationInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/mail%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>E-mail</p>
                                    <input placeholder="exemploemail@email.com"/>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.registrationInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/pin%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Endereço</p>
                                    <input placeholder="Rua Cabreira de Paula, 879"/>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.registrationInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/telephone%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Telefone</p>
                                    <input placeholder="(11) 44002-8922"/>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}