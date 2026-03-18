import './App.css';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import LottieModule from "lottie-react";
import animationData from "./assets/analytics-animation.json";

export default function Wspolpraca() {
    const fadeUp: Variants = {
        hidden: {
            opacity: 0,
            y: 40
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        }
    };
    const Lottie = (LottieModule as any).default ?? LottieModule;
    const navigate = useNavigate();
    return (
        <>
        <motion.header className="header" variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }} >
            <motion.div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }} variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}><h1>MC</h1></motion.div>
            <motion.div className="lista" variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}>
                <h1>Oferta</h1>
                <motion.div className="dropdown" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <motion.div className="promo-section" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <motion.div className="promo-box" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}>
                            <div className="promo-icon">💼</div>
                            <p>Zatrudniamy</p>
                            <span>Sprawdz nas</span>
                        </motion.div>
                    </motion.div>
                    <motion.div className="links-section" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <motion.div className="link-item" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}>
                            <span className="link-icon">📊</span>
                            <motion.div className="link-content" variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}>
                                <motion.div className="link-title" variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}>Zaloz Firme/Ksef Informacje</motion.div>
                                <motion.div className="link-description" variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                        viewport={{ once: true, amount: 0.2 }}>Jak zalozyc firme? Problem z ksefem?</motion.div>
                            </motion.div>
                        </motion.div>
                        <motion.div className="link-item" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}>
                            <span className="link-icon">📈</span>
                            <motion.div className="link-content" variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}>
                                <motion.div className="link-title" variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}>Ksiegowosc</motion.div>
                                <motion.div className="link-description" variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}>Jak wyglada praca z nami!!</motion.div>
                            </motion.div>
                        </motion.div>
                        <motion.div className="link-item" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}>
                            <span className="link-icon">📄</span>
                            <motion.div className="link-content" variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}>
                                <motion.div className="link-title" variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}>Cennik</motion.div>
                                <motion.div className="link-description" variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}>Zobacz cennik ksiegowosci</motion.div>
                            </motion.div>
                        </motion.div>
                        <motion.div className="link-item" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}>
                            <span className="link-icon">🔍</span>
                            <motion.div className="link-content" variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}>
                                <motion.div className="link-title" variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}>Zaloguj/Rejestracja</motion.div>
                                <motion.div className="link-description" variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}></motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.div
                onClick={() => navigate("/wspolpraca")}
                style={{ cursor: "pointer" }}
                className="lista">
                <h1>Wspolpraca</h1>
            </motion.div>
        </motion.header>

            <motion.section className="Sekcja">
                <div className="SekcjaD">
                    <div className="Teksty"><h1>Oferta 1 - Student</h1></div>
                    <div className="lottie-box">
                        <Lottie animationData={animationData} loop={true}/>
                        <div className="TekstP"><p>Cos tam o firmie jak bylo to wygladalo dla studtenda ogolnie tak to ma wygaldac i jakis losowy tekst</p></div>
                    </div>
                </div>
                <div className="SekcjaD">  <div className="Teksty"><h1>Oferta 2 - Doświadoczony</h1> </div>




                </div>
                <div className="SekcjaD">  <div className="Teksty"><h1>Oferta 3 - Wspolpraca <span>B2B</span></h1></div>



                </div> 
            </motion.section>
           
        </>
        
    );


    console.log(animationData);
}