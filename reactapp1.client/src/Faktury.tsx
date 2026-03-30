import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Faktury.css";

type Faktura = {
    id: number;
    numer: string;
    sprzedawca: string;
    nabywca: string;
    dataWystawienia: string;
    terminPlatnosci: string;
    status: string;
    wartoscNetto: number;
    vatKwota: number;
    wartoscBrutto: number;
    vatStawka: number;
    kategoria: string;
    rodzajTransakcji: string;
};

export default function Faktury() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [faktury, setFaktury] = useState<Faktura[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:7093/api/Faktury/my", {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("B³¹d pobierania faktur");
                return res.json();
            })
            .then((data) => setFaktury(data))
            .catch((err) => {
                console.error(err);
                setFaktury([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredFaktury = faktury.filter((f) => {
        const matchSearch =
            f.numer.toLowerCase().includes(search.toLowerCase()) ||
            f.sprzedawca.toLowerCase().includes(search.toLowerCase()) ||
            f.nabywca.toLowerCase().includes(search.toLowerCase());

        const matchStatus = statusFilter ? f.status === statusFilter : true;

        return matchSearch && matchStatus;
    });

    return (
        <div className="faktury-page">
            <aside className={`faktury-sidebar ${menuOpen ? "open" : ""}`}>
                <button
                    className="faktury-sidebar-trigger"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    type="button"
                >
                    <div className="faktury-bars">
                        <span />
                        <span />
                        <span />
                    </div>
                </button>

                <div className="faktury-sidebar-content">
                    <h1 className="faktury-logo" onClick={() => navigate("/")}>
                        MC
                    </h1>

                    <nav className="faktury-nav">
                        <NavLink to="/profil-konta">P³atnoœci</NavLink>
                        <NavLink to="/faktury">Faktury</NavLink>
                        <NavLink to="/statystyki">Statystyki</NavLink>
                    </nav>
                </div>
            </aside>

            <main className={`faktury-main ${menuOpen ? "shift" : ""}`}>
                <section className="faktury-hero">
                    <div>
                        <h1>Faktury</h1>
                        <p>Lista wszystkich faktur u¿ytkownika</p>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/faktury/nowa")}
                    >
                        + Nowa faktura
                    </button>
                </section>

                <section className="faktury-card">
                    <div className="filters-row">
                        <div className="faktury-field">
                            <label>Szukaj</label>
                            <input
                                type="text"
                                placeholder="Numer, sprzedawca, nabywca..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="faktury-field">
                            <label>Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Wszystkie</option>
                                <option value="Wystawiona">Wystawiona</option>
                                <option value="Op³acona">Op³acona</option>
                                <option value="Anulowana">Anulowana</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="faktury-card">
                    {loading ? (
                        <p>£adowanie faktur...</p>
                    ) : filteredFaktury.length === 0 ? (
                        <p>Brak faktur do wyœwietlenia.</p>
                    ) : (
                        <div className="faktury-table-wrapper">
                            <div className="faktury-table faktury-table-header">
                                <span>Numer</span>
                                <span>Sprzedawca</span>
                                <span>Nabywca</span>
                                <span>Data wyst.</span>
                                <span>Netto</span>
                                <span>VAT</span>
                                <span>Brutto</span>
                                <span>Kategoria</span>
                                <span>Rodzaj</span>
                                <span>Status</span>
                            </div>

                            {filteredFaktury.map((f) => (
                                <div
                                    key={f.id}
                                    className="faktury-table faktury-table-row"
                                    onClick={() => navigate(`/faktury/${f.id}`)}
                                >
                                    <span>{f.numer}</span>
                                    <span>{f.sprzedawca}</span>
                                    <span>{f.nabywca}</span>
                                    <span>{f.dataWystawienia}</span>
                                    <span>{f.wartoscNetto.toFixed(2)} PLN</span>
                                    <span>{f.vatKwota.toFixed(2)} PLN</span>
                                    <span>{f.wartoscBrutto.toFixed(2)} PLN</span>
                                    <span>{f.kategoria}</span>
                                    <span>{f.rodzajTransakcji}</span>
                                    <span>
                                        <span className={`status-badge ${f.status.toLowerCase()}`}>
                                            {f.status}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}