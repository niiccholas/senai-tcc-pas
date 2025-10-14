"use client"

import { useRouter } from "next/navigation"
import styles from "./page.module.css"

export default function FilterButton() {
    const router = useRouter()

    return (
        <button 
            type="submit" 
            className={styles.sendFilter} 
            onClick={() => router.push("/unidades")}
        >
            FILTRAR
        </button>
    )
}
