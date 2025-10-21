import styles from "./page.module.css";

export default function ProfileSettingsPage(){
    return(
        <main className={styles.main}>
            <div className={styles.systemSettings}>
                <div className={styles.options}>
                    <div className={styles.photo}>
                        <img src="https://file.garden/aOx43sIeICuTJI2s/nophoto.png" alt="" />
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
                                    <span>Jair Messias Bolsonaro</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/worldwide%20(1)%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Naturalidade</p>
                                    <span>Jair Messias Bolsonaro</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/calendar%20(1)%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Nascimento</p>
                                    <span>Jair Messias Bolsonaro</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src="https://file.garden/aOx43sIeICuTJI2s/mom%201.png" alt="" />
                                <div className={styles.label}>
                                    <p>Nome da Mãe</p>
                                    <span>Jair Messias Bolsonaro</span>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className={styles.registrationData}></div>
            </div>
        </main>
    )
}