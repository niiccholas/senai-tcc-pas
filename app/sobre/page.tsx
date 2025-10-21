import styles from "./page.module.css";

export default function AboutPage() {
    return(
        <main className={styles.main}>
            <div className={styles.label}>
                <img src="/images/paslogo.png" alt="logo do site PAS: Painel de Acesso a Saúde" />
                <h1>Sobre</h1>
            </div>
            <div className={styles.content}>
                <p>
                O PAS – Painel de Acesso à Saúde é uma iniciativa desenvolvida em parceria com órgãos públicos de saúde, com o objetivo de ampliar a acessibilidade e promover maior eficiência no atendimento hospitalar.
                </p>
                    O sistema de saúde brasileiro enfrenta desafios significativos, especialmente relacionados ao tempo de espera em hospitais e prontos-socorros. Muitos cidadãos, em especial os que dependem exclusivamente do Sistema Único de Saúde (SUS), precisam lidar com filas extensas, deslocamentos desnecessários e, em alguns casos, acabam desistindo de buscar atendimento devido à demora.
                <p>
                    Diante dessa realidade, o PAS foi criado como uma ferramenta prática, gratuita e de fácil acesso, permitindo à população encontrar hospitais próximos com base em sua localização e consultar o tempo estimado de espera para atendimento.
                </p>
                <p>
                    Nosso compromisso é contribuir para uma experiência mais transparente, ágil e eficiente no acesso aos serviços de saúde pública.
                </p>
            </div>
        </main>
    )
}