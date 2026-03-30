import { useState, type FormEvent } from "react";
import "./ResetHasla.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch("https://localhost:7093/api/Auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
            } else {
                setMessage("B³¹d wysy³ania linku.");
            }
        } catch {
            setMessage("B³¹d po³¹czenia.");
        }
    };

    return (
        <div className="forgot-page">
            <div className="forgot-card">
                <div className="forgot-header">
                    <h1>Przypomnij haslo</h1>
                    <p>
                        Podaj adres email przypisany do konta. Wyslemy Ci link do ustawienia nowego hasla.
                    </p>
                </div>

                <form className="forgot-form" onSubmit={handleForgotPassword}>
                    <label htmlFor="email">Adres email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="np. twojemail@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button type="submit">Wyslij link resetujacy</button>
                </form>

                {message && <div className="forgot-message">{message}</div>}
            </div>
        </div>
    );
}

export default ForgotPassword;