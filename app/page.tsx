'use client'

export default function Page() {
    return (
        <header>
            <div className="logo">
            <img src="/images/paslogo.png" alt="Logo"/>
            </div>
           
            <nav className="navigation">
                <a href="">INÍCIO</a>
                <a href="">MAPA</a>
            </nav>

            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
        </header>
    )
}