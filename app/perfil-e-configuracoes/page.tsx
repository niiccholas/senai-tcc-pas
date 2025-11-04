"use client";

import { useTheme } from "../context/ThemeContext";
import styles from "./page.module.css";

export default function ProfileSettingsPage(){
    const { theme, toggleTheme, isDark } = useTheme();
    
    // URLs dos ícones para cada tema
    const iconUrls = {
        // Dados pessoais
        userVerification: {
            light: "https://file.garden/aOx43sIeICuTJI2s/user-verification%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Client%20Management.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        idCard: {
            light: "https://file.garden/aOx43sIeICuTJI2s/id-card%20(1)%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Identification%20Documents.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        worldwide: {
            light: "https://file.garden/aOx43sIeICuTJI2s/worldwide%20(1)%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Earth%20Planet.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        calendar: {
            light: "https://file.garden/aOx43sIeICuTJI2s/calendar%20(1)%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Calendar.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        mom: {
            light: "https://file.garden/aOx43sIeICuTJI2s/mom%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/User.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        // Dados de cadastro
        mail: {
            light: "https://file.garden/aOx43sIeICuTJI2s/mail%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Email.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        pin: {
            light: "https://file.garden/aOx43sIeICuTJI2s/pin%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Location.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        telephone: {
            light: "https://file.garden/aOx43sIeICuTJI2s/telephone%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Phone.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        }
    };
    
    return(
        <main className={styles.main}>
            <div className={styles.systemSettings}>
                <div className={styles.options}>
                    <div className={styles.photo}>
                        <img src="null" alt="" />
                    </div> 
                        <ul className={styles.themeOption} onClick={toggleTheme}>
                            <span>Tema</span>
                            <div className={styles.themeToggle}>
                                {isDark ? <img src="https://file.garden/aOx43sIeICuTJI2s/Vector.png" alt="" /> :
                                 <img src="https://file.garden/aOx43sIeICuTJI2s/Moon%20and%20Stars.png" alt="" />}
                            </div>
                        </ul>
                        <ul>
                            <a href="mailto:contato@pas.gov.br?subject=Dúvida sobre o sistema PAS&body=Olá, gostaria de entrar em contato sobre...">Contato</a>
                        </ul>
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
                                <img src={isDark ? iconUrls.userVerification.dark : iconUrls.userVerification.light} alt="" />
                                <div className={styles.label}>
                                    <p>Nome completo</p>
                                    <span>Jair Messias Bolsonaro</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.idCard.dark : iconUrls.idCard.light} alt="" />
                                <div className={styles.label}>
                                    <p>CPF</p>
                                    <span>123.456.789-00</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.worldwide.dark : iconUrls.worldwide.light} alt="" />
                                <div className={styles.label}>
                                    <p>Naturalidade</p>
                                    <span>Barueri/SP</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.calendar.dark : iconUrls.calendar.light} alt="" />
                                <div className={styles.label}>
                                    <p>Nascimento</p>
                                    <span>10/10/2007</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.mom.dark : iconUrls.mom.light} alt="" />
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
                                <img src={isDark ? iconUrls.mail.dark : iconUrls.mail.light} alt="" />
                                <div className={styles.label}>
                                    <p>E-mail</p>
                                    <input placeholder="exemploemail@email.com"/>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.registrationInfo}>
                                <img src={isDark ? iconUrls.pin.dark : iconUrls.pin.light} alt="" />
                                <div className={styles.label}>
                                    <p>Endereço</p>
                                    <input placeholder="Rua Cabreira de Paula, 879"/>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.registrationInfo}>
                                <img src={isDark ? iconUrls.telephone.dark : iconUrls.telephone.light} alt="" />
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