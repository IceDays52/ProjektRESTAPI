import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./ProfilKonta.css";
import { CgSmile, CgSmileSad, CgSmileNeutral } from "react-icons/cg";
import WykresyFinanse from "./WykresyFinanse";
import StatystykiWykresy from "./StatystykiWykresy";
export default function ProfilKonta() {
    const [login, setLogin] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const moodIcons = {
        happy: CgSmile,
        sad: CgSmileSad,
        neutral: CgSmileNeutral,
    };

    function Mood({mood}) {
        const Icon = moodIcons[mood] || CgSmileNeutral;
        return <Icon size={35} />;
    }

    useEffect(() => {
        fetch("https://localhost:7093/api/Auth/me", {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Nie zalogowany");
                return res.json();
            })
            .then((data) => setLogin(data.login))
            .catch(() => setLogin("Brak u¿ytkownika"));
    }, []);

    return (
        <div className="profil-page">
            <aside className={`profil-sidebar ${menuOpen ? "open" : ""}`}>
                <button
                    className="profil-sidebar-trigger"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Otwórz menu"
                    type="button"
                >
                    <div className="profil-bars">
                        <span />
                        <span />
                        <span />
                    </div>
                </button>

                <div className="profil-sidebar-content">
                    <h1 className="profil-logo" onClick={() => navigate("/")}>
                        MC
                    </h1>

                    <nav className="profil-nav">
                        <NavLink to="/" onClick={() => setMenuOpen(false)}>
                            Strona glowna
                        </NavLink>
                        <NavLink to="/profil" onClick={() => setMenuOpen(false)}>
                            Profil
                        </NavLink>
                        <NavLink to="/statystyki" onClick={() => setMenuOpen(false)}>
                            Statystyki
                        </NavLink>
                        <NavLink to="/raporty" onClick={() => setMenuOpen(false)}>
                            Raporty
                        </NavLink>
                        <NavLink to="/ustawienia" onClick={() => setMenuOpen(false)}>
                            Ustawienia
                        </NavLink>
                    </nav>
                </div>
            </aside>

            <main className={`profil-main ${menuOpen ? "shift" : ""}`}>
                <div className="profil-hero">
                    <h1>
                     <Mood mood="happy" /> {login}
                    </h1>
                </div>

                <section className="profil-card">
                    <h2>Powiadomienia</h2>
                </section>

                <section className="profil-card">
                    <h2>Koszty / Przychody</h2>
                    <WykresyFinanse login={login} />
                </section> 

                <section className="profil-card">
                    <h2>Statystyki</h2>
                    <StatystykiWykresy login={login} />
                </section>

                <section className="profil-card">
                    <h2>Za³¹czniki - do pobrania</h2>
                </section>
            </main>
        </div>
    );
}