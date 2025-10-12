'use client';


import LocationMap from '../components/map/LocationMap';
import styles from './page.module.css';


export default function MapPage(){
    return(
        <main className={styles.main}>
            <LocationMap 
            />
        </main>
    )
} 