import './App.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

export default function Logowanie() {
    const navigate = useNavigate();
    const Lottie = (LottieModule as any).default ?? LottieModule;

    const [Login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [wiadomosc, setWiadomosc] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ imie, email, wiadomosc });
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
                >
                    <h1>MC</h1>
                </motion.div>

                <motion.div className="lista">
                    <h1>Oferta</h1>
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
                <div>
                    <Lottie animationData={animationData} loop={true} />
                </div>

                <div>
                    <h1>ZALOGUJ SIE</h1>
                    <form className="my-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Login"
                            className="dark-input"
                            value={Login}
                            onChange={(e) => setLogin(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Twój e-mail"
                            className="dark-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                   

                        <button type="submit" className="start-btn small-btn">
                            Wyślij wiadomość
                        </button>
                        <button type="submit" className="PrzypomnijHaslo">
                            Przypomnij hasło
                        </button>
                    </form>

                </div>
                    
                <div>
                    <h1>REJESTRACJA</h1>
                </div>
            </section>
        </>
    );
}