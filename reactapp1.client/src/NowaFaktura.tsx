import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./NowaFaktura.css";

export default function NowaFaktura() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        numer: "",
        dataWystawienia: "",
        dataSprzedazy: "",
        terminPlatnosci: "",
        sprzedawca: "",
        nabywca: "",
        wartoscNetto: "",
        vatStawka: "23",
        vatKwota: "",
        wartoscBrutto: "",
        kategoria: "Koszty",
        rodzajTransakcji: "Nabycie krajowe",
        status: "Wystawiona",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("https://localhost:7093/api/Faktury", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    ...form,
                    wartoscNetto: Number(form.wartoscNetto),
                    vatStawka: Number(form.vatStawka),
                    vatKwota: Number(form.vatKwota),
                    wartoscBrutto: Number(form.wartoscBrutto),
                }),
            });

            if (!response.ok) {
                throw new Error("Nie uda³o siê dodaæ faktury");
            }

            navigate("/faktury");
        } catch (error) {
            console.error(error);
            alert("B³¹d podczas tworzenia faktury");
        }
    };

    return (
        <div className="nowa-faktura-page">
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

            <main className="nowa-faktura-main">
                <section className="nowa-faktura-hero">
                    <h1>Nowa faktura</h1>
                    <p>Utwórz nowy dokument i zapisz go w bazie</p>
                </section>

                <form className="nowa-faktura-form" onSubmit={handleSubmit}>
                    <section className="nowa-faktura-card">
                        <h2>Dane podstawowe</h2>

                        <div className="form-grid">
                            <div className="faktury-field">
                                <label>Numer</label>
                                <input name="numer" value={form.numer} onChange={handleChange} />
                            </div>

                            <div className="faktury-field">
                                <label>Data wystawienia</label>
                                <input type="date" name="dataWystawienia" value={form.dataWystawienia} onChange={handleChange} />
                            </div>

                            <div className="faktury-field">
                                <label>Data sprzeda¿y</label>
                                <input type="date" name="dataSprzedazy" value={form.dataSprzedazy} onChange={handleChange} />
                            </div>

                            <div className="faktury-field">
                                <label>Termin p³atnoœci</label>
                                <input type="date" name="terminPlatnosci" value={form.terminPlatnosci} onChange={handleChange} />
                            </div>
                        </div>
                    </section>

                    <section className="nowa-faktura-card">
                        <h2>Strony faktury</h2>

                        <div className="form-grid two-columns">
                            <div className="faktury-field">
                                <label>Sprzedawca</label>
                                <input name="sprzedawca" value={form.sprzedawca} onChange={handleChange} />
                            </div>

                            <div className="faktury-field">
                                <label>Nabywca</label>
                                <input name="nabywca" value={form.nabywca} onChange={handleChange} />
                            </div>
                        </div>
                    </section>

                    <section className="nowa-faktura-card">
                        <h2>Wartoœci i klasyfikacja</h2>

                        <div className="form-grid">
                            <div className="faktury-field">
                                <label>Wartoœæ netto</label>
                                <input type="number" step="0.01" name="wartoscNetto" value={form.wartoscNetto} onChange={handleChange} />
                            </div>

                            <div className="faktury-field">
                                <label>VAT stawka</label>
                                <select name="vatStawka" value={form.vatStawka} onChange={handleChange}>
                                    <option value="23">23%</option>
                                    <option value="8">8%</option>
                                    <option value="5">5%</option>
                                    <option value="0">0%</option>
                                </select>
                            </div>

                            <div className="faktury-field">
                                <label>VAT kwota</label>
                                <input type="number" step="0.01" name="vatKwota" value={form.vatKwota} onChange={handleChange} />
                            </div>

                            <div className="faktury-field">
                                <label>Wartoœæ brutto</label>
                                <input type="number" step="0.01" name="wartoscBrutto" value={form.wartoscBrutto} onChange={handleChange} />
                            </div>

                            <div className="faktury-field">
                                <label>Kategoria</label>
                                <select name="kategoria" value={form.kategoria} onChange={handleChange}>
                                    <option value="Koszty">Koszty</option>
                                    <option value="Us³ugi">Us³ugi</option>
                                    <option value="Towary">Towary</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Inne">Inne</option>
                                </select>
                            </div>

                            <div className="faktury-field">
                                <label>Rodzaj transakcji</label>
                                <select
                                    name="rodzajTransakcji"
                                    value={form.rodzajTransakcji}
                                    onChange={handleChange}
                                >
                                    <option value="Nabycie krajowe">Nabycie krajowe</option>
                                    <option value="Sprzeda¿ krajowa">Sprzeda¿ krajowa</option>
                                    <option value="WNT">WNT</option>
                                    <option value="WDT">WDT</option>
                                    <option value="Import us³ug">Import us³ug</option>
                                </select>
                            </div>

                            <div className="faktury-field">
                                <label>Status</label>
                                <select name="status" value={form.status} onChange={handleChange}>
                                    <option value="Wystawiona">Wystawiona</option>
                                    <option value="Op³acona">Op³acona</option>
                                    <option value="Anulowana">Anulowana</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="button" className="secondary-btn" onClick={() => navigate("/faktury")}>
                            Wróæ
                        </button>
                        <button type="submit" className="primary-btn">
                            Zapisz fakturê
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}