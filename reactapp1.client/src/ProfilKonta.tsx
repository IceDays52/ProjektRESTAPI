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

    const [notifications, setNotifications] = useState<any[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const moodIcons = {
        happy: CgSmile,
        sad: CgSmileSad,
        neutral: CgSmileNeutral,
    };

    function Mood({ mood }: { mood: keyof typeof moodIcons }) {
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
            .then((data) => {
                setLogin(data.login);
                setUserId(data.id);
            })
            .catch(() => {
                setLogin("Brak u¿ytkownika");
                setUserId(null);
            });
    }, []);

    useEffect(() => {
        if (!login || login === "Brak u¿ytkownika") return;

        fetch(`https://localhost:7093/api/Notifications/${login}`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("B³¹d pobierania powiadomieñ");
                return res.json();
            })
            .then((data) => {
                console.log("POWIADOMIENIA:", data);
                setNotifications(data);
            })
            .catch((err) => {
                console.error(err);
                setNotifications([]);
            });
    }, [login]);

    useEffect(() => {
        if (!userId) return;

        fetch(`https://localhost:7093/api/Documents/my/${userId}`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("B³¹d pobierania dokumentów");
                return res.json();
            })
            .then((data) => {
                console.log("DOKUMENTY:", data);
                setDocuments(data);
            })
            .catch((err) => {
                console.error(err);
                setDocuments([]);
            });
    }, [userId]);

    const handleUpload = async () => {
        if (!selectedFile || !userId) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", String(userId));
        formData.append("uploadedByUserId", String(userId));
        formData.append("category", "faktura");
        formData.append("direction", "client_to_office");

        try {
            const response = await fetch("https://localhost:7093/api/Documents/upload", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const refreshed = await fetch(`https://localhost:7093/api/Documents/my/${userId}`, {
                credentials: "include",
            });

            const data = await refreshed.json();
            setDocuments(data);
            setSelectedFile(null);
        } catch (error) {
            console.error("UPLOAD ERROR:", error);
        }
    };

    const handleDownload = async (id: number, fileName: string) => {
        try {
            const response = await fetch(`https://localhost:7093/api/Documents/download/${id}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Nie uda³o siê pobraæ pliku");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("DOWNLOAD ERROR:", error);
        }
    };

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

                <section className="profil-cardd">
                    <div>
                        <h2>Powiadomienia</h2>

                        {notifications.length === 0 ? (
                            <p>Brak powiadomien</p>
                        ) : (
                            <ul className="notifications-list">
                                {notifications.map((item: any) => (
                                    <li key={item.id} className="notification-item">
                                        <h4>{item.title}</h4>
                                        <p>{item.message}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <h2>Dokumenty</h2>

                        <div className="documents-upload">
                            <label className="file-upload-label">
                                <input
                                    type="file"
                                    accept=".pdf,.zip,.xls,.xlsx"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        setSelectedFile(file);
                                    }}
                                />
                                <span>Wybierz plik</span>
                            </label>

                            <span className="selected-file-name">
                                {selectedFile ? selectedFile.name : "Nie wybrano pliku"}
                            </span>

                            <button
                                className="upload-btn"
                                onClick={handleUpload}
                                disabled={!selectedFile}
                            >
                                Wyslij dokument
                            </button>
                        </div>

                        <div className="documents-list">
                            {documents.length === 0 ? (
                                <p>Brak dokumentów</p>
                            ) : (
                                <ul>
                                    {documents.map((doc: any) => (
                                        <li key={doc.id}>
                                            <span>{doc.originalFileName}</span>
                                            <button
                                                onClick={() =>
                                                    handleDownload(doc.id, doc.originalFileName)
                                                }
                                            >
                                                Pobierz
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
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