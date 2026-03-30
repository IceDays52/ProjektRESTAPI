import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, type FormEvent } from "react";
import "./ResetHasla.css";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [tokenValid, setTokenValid] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setTokenValid(false);
                setMessage("Brak tokenu resetowania has³a.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `https://localhost:7093/api/Auth/validate-reset-token?token=${token}`
                );

                if (!res.ok) {
                    const data = await res.text();
                    setTokenValid(false);
                    setMessage(data || "Link wygas³ lub jest nieprawid³owy.");
                }
            } catch {
                setTokenValid(false);
                setMessage("B³¹d po³¹czenia z serwerem.");
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token]);

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setMessage("Brak tokenu resetowania has³a.");
            return;
        }

        if (!newPassword.trim()) {
            setMessage("Wpisz nowe has³o.");
            return;
        }

        try {
            const res = await fetch("https://localhost:7093/api/Auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            const data = await res.text();

            if (res.ok) {
                setMessage("Has³o zosta³o zmienione.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setMessage(data || "Nie uda³o siê zmieniæ has³a.");
            }
        } catch {
            setMessage("B³¹d po³¹czenia z serwerem.");
        }
    };

    if (loading) {
        return (
            <div className="forgot-page">
                <div className="forgot-card">
                    <div className="forgot-header">
                        <h1>Sprawdzanie linku...</h1>
                        <p>Proszê chwilê poczekaæ.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="forgot-page">
                <div className="forgot-card">
                    <div className="forgot-header">
                        <h1>Link niewa¿ny</h1>
                        <p>{message}</p>
                    </div>

                    <button
                        className="forgot-back-button"
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Wyœlij nowy link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-page">
            <div className="forgot-card">
                <div className="forgot-header">
                    <h1>Ustaw nowe has³o</h1>
                    <p>
                        Wpisz nowe has³o do swojego konta. Po zapisaniu zostaniesz
                        przekierowany do logowania.
                    </p>
                </div>

                <form className="forgot-form" onSubmit={handleResetPassword}>
                    <label htmlFor="newPassword">Nowe has³o</label>
                    <input
                        id="newPassword"
                        type="password"
                        placeholder="Wpisz nowe has³o"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button type="submit">Zmieñ has³o</button>
                </form>

                {message && <div className="forgot-message">{message}</div>}
            </div>
        </div>
    );
}

export default ResetPassword;