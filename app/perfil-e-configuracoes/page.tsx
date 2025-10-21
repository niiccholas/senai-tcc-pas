import styles from "./page.module.css";

export default function ProfileSettingsPage(){
    return(
        <main className={styles.main}>
            <div className={styles.systemSettings}>
                <div className={styles.options}></div>
                <button>Desconectar</button>
            </div>
            <div className={styles.accountSettings}>
                <div className="personalData"></div>
                <div className="registrationData"></div>
            </div>
        </main>
    )
}