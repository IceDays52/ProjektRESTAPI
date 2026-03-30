import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./ProfilKonta.css";
import { CgSmile, CgSmileSad, CgSmileNeutral } from "react-icons/cg";
import WykresyFinanse from "./WykresyFinanse";
import StatystykiWykresy from "./StatystykiWykresy";
import KolowyWykresFinanse from "./KolowyWykresFinanse";

export default function ProfilKonta() {
    const [login, setLogin] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<any[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null);
    const [uploadMessage, setUploadMessage] = useState("");

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
                setLogin("Brak użytkownika");
                setUserId(null);
            });
    }, []);

  
    useEffect(() => {
        if (!login || login === "Brak użytkownika") return;

        fetch(`https://localhost:7093/api/Notifications/${login}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setNotifications(data))
            .catch(() => setNotifications([]));
    }, [login]);

 
    useEffect(() => {
        if (!userId) return;

        fetch(`https://localhost:7093/api/Documents/my/${userId}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setDocuments(data))
            .catch(() => setDocuments([]));
    }, [userId]);

    useEffect(() => {
        if (!uploadStatus) return;

        const timer = setTimeout(() => {
            setUploadStatus(null);
            setUploadMessage("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [uploadStatus]);

    
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus("error");
            setUploadMessage("Najpierw wybierz plik.");
            return;
        }

        if (!userId) {
            setUploadStatus("error");
            setUploadMessage("Brak użytkownika.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", String(userId));
        formData.append("category", "faktura");

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
            setUploadStatus("success");
            setUploadMessage("Dokument został wysłany.");
        } catch (err) {
            console.error(err);
            setUploadStatus("error");
            setUploadMessage("Błąd wysyłania dokumentu.");
        }
    };

    return (
        <div className="profil-page">
            <aside className={`profil-sidebar ${menuOpen ? "open" : ""}`}>
                <button
                    className="profil-sidebar-trigger"
                    onClick={() => setMenuOpen((prev) => !prev)}
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
                        <NavLink to="/">Płatności</NavLink>
                        <NavLink to="/faktury">Faktury</NavLink>
                        <NavLink to="/statystyki">Statystyki</NavLink>
                    </nav>
                </div>
            </aside>

            <main className={`profil-main ${menuOpen ? "shift" : ""}`}>
                <div className="profil-hero">
                    <h1>
                        <Mood mood="happy" /> {login}
                    </h1>
                </div>

                <section className="profil-cardd documents-notifications-section">
                    {}
                    <div className="panel-column">
                        <h2>Powiadomienia</h2>

                        <div className="panel-box">
                            {notifications.length === 0 ? (
                                <p>Brak powiadomień</p>
                            ) : (
                                <ul className="notifications-list">
                                    {notifications.map((n: any) => (
                                        <li key={n.id}>
                                            <h4>{n.title}</h4>
                                            <p>{n.message}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="panel-column">
                        <h2>Dokumenty</h2>

                        {uploadStatus && (
                            <div
                                className={
                                    uploadStatus === "success"
                                        ? "upload-alert upload-alert-success"
                                        : "upload-alert upload-alert-error"
                                }
                            >
                                {uploadMessage}
                            </div>
                        )}

                        <div className="panel-box documents-upload">
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

                           

                            <button
                                className="upload-btn"
                                onClick={handleUpload}
                                disabled={!selectedFile}
                            >
                                Wyślij dokument  {selectedFile ? selectedFile.name : "Nie wybrano pliku"}
                            </button>
                        </div>

                  </div>
                </section>

                {}
                <section className="profil-card">
                    <h2>Podsumowanie roczne</h2>
                    <KolowyWykresFinanse login={login} />
                </section>

                {}
                <section className="profil-card">
                    <h2>Statystyki</h2>
                    <WykresyFinanse login={login} />
                </section>

                <section className="profil-card">
                    <h2>Dodatkowe statystyki</h2>
                    <StatystykiWykresy login={login} />
                </section>
            </main>
        </div>
    );
}