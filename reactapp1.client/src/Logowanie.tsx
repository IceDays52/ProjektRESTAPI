import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import LottieModule from "lottie-react";
import animationData from "./assets/zpunet-icon.json";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" }
    }
};

const formVariants: Variants = {
    hidden: { opacity: 0, x: 40, scale: 0.98 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.35, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        x: -40,
        scale: 0.98,
        transition: { duration: 0.25, ease: "easeInOut" }
    }
};

export default function Logowanie() {
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const navigate = useNavigate();
    const Lottie = (LottieModule as any).default ?? LottieModule;

    const [login, setLogin] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [registerLogin, setRegisterLogin] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");

    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const [isLogin, setIsLogin] = useState(true);
    const [showVerification, setShowVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const parseResponse = async (response: Response) => {
        const text = await response.text();

        try {
            return text ? JSON.parse(text) : {};
        } catch {
            return { message: text || "Nieznana odpowiedź serwera" };
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    const resetLoginForm = () => {
        setLogin("");
        setLoginPassword("");
    };

    const resetRegisterForm = () => {
        setRegisterLogin("");
        setRegisterEmail("");
        setConfirmEmail("");
        setRegisterPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setDay("");
        setMonth("");
        setYear("");
    };

    const resetVerificationForm = () => {
        setVerificationCode("");
    };

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            !registerLogin ||
            !registerEmail ||
            !confirmEmail ||
            !registerPassword ||
            !confirmPassword ||
            !firstName ||
            !lastName ||
            !day ||
            !month ||
            !year
        ) {
            setMessage("Wypełnij wszystkie pola");
            setMessageType("error");
            return;
        }

        if (registerEmail !== confirmEmail) {
            setMessage("E-maile się nie zgadzają");
            setMessageType("error");
            return;
        }

        if (registerPassword !== confirmPassword) {
            setMessage("Hasła się nie zgadzają");
            setMessageType("error");
            return;
        }

        const birthDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

        const registerData = {
            login: registerLogin,
            email: registerEmail,
            password: registerPassword,
            firstName,
            lastName,
            birthDate
        };

        try {
            const response = await fetch("https://localhost:7093/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(registerData)
            });

            const data = await parseResponse(response);

            if (!response.ok) {
                throw new Error(data?.message || "Błąd rejestracji");
            }

            setVerificationEmail(registerEmail);
            setShowVerification(true);
            setMessage(data?.message || "Konto utworzone. Wpisz kod wysłany na email.");
            setMessageType("success");
            resetRegisterForm();
        } catch (error: any) {
            console.error("Błąd:", error);
            setMessage(error.message || "Nie udało się zarejestrować");
            setMessageType("error");
        }
    };

    const handleVerifyEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!verificationEmail || !verificationCode) {
            setMessage("Wpisz kod weryfikacyjny");
            setMessageType("error");
            return;
        }

        try {
            const response = await fetch("https://localhost:7093/api/Auth/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: verificationEmail,
                    code: verificationCode
                })
            });

            const data = await parseResponse(response);

            if (!response.ok) {
                throw new Error(data?.message || "Błąd weryfikacji");
            }

            setMessage(data?.message || "Email został potwierdzony. Możesz się zalogować.");
            setMessageType("success");
            setShowVerification(false);
            setIsLogin(true);
            resetVerificationForm();
        } catch (error: any) {
            console.error("Błąd:", error);
            setMessage(error.message || "Nie udało się potwierdzić emaila");
            setMessageType("error");
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!login || !loginPassword) {
            setMessage("Wypełnij wszystkie pola");
            setMessageType("error");
            return;
        }

        const loginData = {
            login,
            password: loginPassword
        };

        try {
            const response = await fetch("https://localhost:7093/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(loginData)
            });

            const data = await parseResponse(response);

            if (!response.ok) {
                if (data?.requiresEmailVerification) {
                    setVerificationEmail(data.email || "");
                    setShowVerification(true);
                    setMessage(data.message || "Email nie został potwierdzony. Wpisz kod z emaila.");
                    setMessageType("success");
                    return;
                }

                throw new Error(data?.message || "Błąd logowania");
            }

            setMessage(data?.message || "Zalogowano poprawnie");
            setMessageType("success");

            setTimeout(() => {
                navigate("/profil-konta");
            }, 800);
        } catch (error: any) {
            console.error("Błąd:", error);
            setMessage(error.message || "Nie udało się zalogować");
            setMessageType("error");
        } finally {
            resetLoginForm();
        }
    };

    return (
        <>
            <motion.header
                className="header"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    className="logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <h1>MC</h1>
                </motion.div>

                <motion.div
                    className="lista"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <h1>Oferta</h1>

                    <motion.div
                        className="dropdown"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div
                            className="promo-section"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <motion.div
                                className="promo-box"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <div className="promo-icon">💼</div>
                                <p>Zatrudniamy</p>
                                <span>Sprawdz nas</span>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="links-section"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <motion.div
                                className="link-item"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <span className="link-icon">📊</span>
                                <motion.div className="link-content">
                                    <motion.div className="link-title">
                                        Zaloz Firme/Ksef Informacje
                                    </motion.div>
                                    <motion.div className="link-description">
                                        Jak zalozyc firme? Problem z ksefem?
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="link-item"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <span className="link-icon">📈</span>
                                <motion.div className="link-content">
                                    <motion.div className="link-title">
                                        Ksiegowosc
                                    </motion.div>
                                    <motion.div className="link-description">
                                        Jak wyglada praca z nami!!
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="link-item"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <span className="link-icon">📄</span>
                                <motion.div className="link-content">
                                    <motion.div className="link-title">
                                        Cennik
                                    </motion.div>
                                    <motion.div className="link-description">
                                        Zobacz cennik ksiegowosci
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="link-item"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <span className="link-icon">🔍</span>
                                <motion.div className="link-content">
                                    <motion.div
                                        className="link-title"
                                        onClick={() => navigate("/logowanie")}
                                        style={{ cursor: "pointer" }}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        Zaloguj/Rejestracja
                                    </motion.div>

                                    <motion.div className="link-description" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    onClick={() => navigate("/wspolpraca")}
                    style={{ cursor: "pointer" }}
                    className="lista"
                >
                    <h1>Wspolpraca</h1>
                </motion.div>
            </motion.header>

            <section className="Logowanie-Sekcja">
                <div className="Giff">
                    <div className="lottie-crop">
                        <Lottie animationData={animationData} loop={true} />
                    </div>
                </div>

                <div>
                    {!showVerification && (
                        <div className="auth-switch">
                            <button
                                type="button"
                                className={isLogin ? "switch-btn active" : "switch-btn"}
                                onClick={() => {
                                    resetRegisterForm();
                                    setShowVerification(false);
                                    setIsLogin(true);
                                }}
                            >
                                Zaloguj się
                            </button>

                            <button
                                type="button"
                                className={!isLogin ? "switch-btn active" : "switch-btn"}
                                onClick={() => {
                                    resetLoginForm();
                                    setShowVerification(false);
                                    setIsLogin(false);
                                }}
                            >
                                Rejestracja
                            </button>
                        </div>
                    )}

                    <div className="auth-panel">
                        <AnimatePresence mode="wait">
                            {showVerification ? (
                                <motion.div
                                    key="verify"
                                    className="register-box"
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <h1>POTWIERDŹ EMAIL</h1>

                                    <form className="my-form" onSubmit={handleVerifyEmailSubmit}>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="dark-input"
                                            value={verificationEmail}
                                            readOnly
                                        />

                                        <input
                                            type="text"
                                            placeholder="Kod z emaila"
                                            className="dark-input"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                        />

                                        <button type="submit" className="start-btn small-btn">
                                            Potwierdź konto
                                        </button>

                                        <button
                                            type="button"
                                            className="PrzypomnijHaslo"
                                            onClick={() => {
                                                setShowVerification(false);
                                                setIsLogin(true);
                                                resetVerificationForm();
                                            }}
                                        >
                                            Wróć do logowania
                                        </button>
                                    </form>
                                </motion.div>
                            ) : isLogin ? (
                                <motion.div
                                    key="login"
                                    className="login-box"
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <h1>ZALOGUJ SIĘ</h1>

                                    <form className="my-form" onSubmit={handleLoginSubmit}>
                                        <input
                                            type="text"
                                            placeholder="Login"
                                            className="dark-input"
                                            value={login}
                                            onChange={(e) => setLogin(e.target.value)}
                                        />

                                        <input
                                            type="password"
                                            placeholder="Hasło"
                                            className="dark-input"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                        />

                                        <button type="submit" className="start-btn small-btn">
                                            Zaloguj się
                                        </button>

                                        <button
                                            type="button"
                                            className="PrzypomnijHaslo"
                                            onClick={handleForgotPassword}
                                        >
                                            Przypomnij hasło
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register"
                                    className="register-box"
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <h1>REJESTRACJA</h1>

                                    <form className="my-form" onSubmit={handleRegisterSubmit}>
                                        <input
                                            type="text"
                                            placeholder="Login"
                                            className="dark-input"
                                            value={registerLogin}
                                            onChange={(e) => setRegisterLogin(e.target.value)}
                                        />

                                        <div className="name-row">
                                            <input
                                                type="text"
                                                placeholder="Imię"
                                                className="dark-input"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />

                                            <input
                                                type="text"
                                                placeholder="Nazwisko"
                                                className="dark-input"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>

                                        <div className="date-row">
                                            <select
                                                className="dark-input"
                                                value={day}
                                                onChange={(e) => setDay(e.target.value)}
                                            >
                                                <option value="">Dzień</option>
                                                {Array.from({ length: 31 }, (_, i) => (
                                                    <option key={i + 1} value={String(i + 1)}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="dark-input"
                                                value={month}
                                                onChange={(e) => setMonth(e.target.value)}
                                            >
                                                <option value="">Miesiąc</option>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <option key={i + 1} value={String(i + 1)}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="dark-input"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                            >
                                                <option value="">Rok</option>
                                                {Array.from({ length: 100 }, (_, i) => {
                                                    const y = new Date().getFullYear() - i;
                                                    return (
                                                        <option key={y} value={String(y)}>
                                                            {y}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        <input
                                            type="email"
                                            placeholder="Twój e-mail"
                                            className="dark-input"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                        />

                                        <input
                                            type="email"
                                            placeholder="Potwierdź Twój e-mail"
                                            className="dark-input"
                                            value={confirmEmail}
                                            onChange={(e) => setConfirmEmail(e.target.value)}
                                        />

                                        <input
                                            type="password"
                                            placeholder="Hasło"
                                            className="dark-input"
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                        />

                                        <input
                                            type="password"
                                            placeholder="Potwierdź hasło"
                                            className="dark-input"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />

                                        <button type="submit" className="start-btn small-btn">
                                            Zarejestruj się
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {message && (
                    <motion.div
                        className={`toast ${messageType}`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}