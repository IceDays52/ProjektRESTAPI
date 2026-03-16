import './App.css';
import { useRef, useState, useEffect } from 'react';
import heroImage from './image.png';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface Review {
    id: number;
    author: string;
    text: string;
}
const locations = [
    { id: '1', name: 'Warszawa', position: { lat: 52.2297, lng: 21.0122 } },
    { id: '2', name: 'Kraków', position: { lat: 50.0647, lng: 19.9450 } },
    { id: '3', name: 'Wrocław', position: { lat: 51.1079, lng: 17.0385 } },
    { id: '4', name: 'Gdańsk', position: { lat: 54.3520, lng: 18.6466 } },
];

const reviews: Review[] = [
    { id: 1, author: "Jan Kowalski", text: "Świetna współpraca! Zawsze mogę liczyć na szybkie i profesjonalne wsparcie, a wszystkie dokumenty są prowadzone bezbłędnie." },
    { id: 2, author: "Anna Nowak", text: "Pełen profesjonalizm. MC Księgowość Kraków pomogło mi uporządkować sprawy księgowe i podpowiedziało najlepsze rozwiązania podatkowe dla mojej firmy." },
    { id: 3, author: "Piotr Wiśniewski", text: "Bardzo polecam! Obsługa jest zawsze dostępna, odpowiada na każde pytanie i potrafi doradzić w trudnych sytuacjach księgowych." },
    { id: 4, author: "Katarzyna Malinowska", text: "Jestem bardzo zadowolona ze współpracy. Dzięki MC Księgowość Kraków mam pewność, że moje rozliczenia są prowadzone rzetelnie i terminowo." },
    { id: 5, author: "Marek Zieliński", text: "Profesjonalizm i indywidualne podejście do klienta w jednym miejscu. Świetne biuro rachunkowe, które naprawdę rozumie potrzeby przedsiębiorcy." }
];

const TAGS = ["Ksiegowosc", "Rachunkowosc", "Kadry", "Spolki", "Pomoc(8-16)", "Wsparcie", "Rozrachunki"];
const TRIPLE_TAGS = [...TAGS, ...TAGS, ...TAGS];






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
export default function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const contactRef = useRef<HTMLDivElement>(null);
    const contactKak = useRef<HTMLDivElement>(null);

    const [imie, setImie] = useState("");
    const [email, setEmail] = useState("");
    const [wiadomosc, setWiadomosc] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch("https://localhost:7093/api/Uzytkownicy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                imie,
                email,
                wiadomosc
            })
        });

        if (response.ok) {
            alert("Wiadomość wysłana!");
            setImie("");
            setEmail("");
            setWiadomosc("");
        } else {
            alert("Błąd wysyłania");
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
            );
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const scrollToContact = () => {
        contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToContact2 = () => {
        contactKak.current?.scrollIntoView({ behavior: 'smooth' });
    };
    console.log("Moje lokalizacje to:", locations);


    const [probnyEmail, setProbnyEmail] = useState("");






    const handleProbnyPlanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("https://localhost:7093/api/Probnyplan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: probnyEmail
                })
            });

            if (response.ok) {
                alert("Email zapisany! Wyślemy próbny plan.");
                setProbnyEmail("");
            } else {
                alert("Błąd zapisu emaila.");
            }

        } catch {
            alert("Nie udało się połączyć z serwerem.");
        }
    };


    return (
        <> 
            <motion.header className="header" variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }} >
                <motion.div className="logo" variants={fadeUp}
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
                                        viewport={{ once: true, amount: 0.2 }}>Dashboard</motion.div>
                                    <motion.div className="link-description" variants={fadeUp}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, amount: 0.2 }}>View stats</motion.div>
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
                                        viewport={{ once: true, amount: 0.2 }}>Analytics</motion.div>
                                    <motion.div className="link-description" variants={fadeUp}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, amount: 0.2 }}>Track progress</motion.div>
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
                                        viewport={{ once: true, amount: 0.2 }}>Reports</motion.div>
                                    <motion.div className="link-description" variants={fadeUp}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, amount: 0.2 }}>Download data</motion.div>
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
                                        viewport={{ once: true, amount: 0.2 }}>Insights</motion.div>
                                    <motion.div className="link-description" variants={fadeUp}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, amount: 0.2 }}>Deep dive</motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div className="lista"><h1>Wspolpraca</h1></motion.div>
            </motion.header>

            <motion.section className="hero" variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}>
                <motion.div className="hero-text" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <h1>
                        MC KSIEGOWOSC<span className="DOLACZ">DOLACZ DO NAS</span>
                    </h1>

                    <motion.div className="Tata" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <p>
                            MC Księgowość to profesjonalne biuro rachunkowe oferujące pełną obsługę księgową i podatkową dla firm różnej wielkości. Specjaliści z MC Księgowość dbają o terminowe prowadzenie ksiąg, rozliczenia podatkowe oraz raportowanie finansowe. Firma zapewnia indywidualne podejście do każdego klienta i doradztwo w optymalizacji kosztów. Dzięki nowoczesnym narzędziom online, przedsiębiorcy mają stały dostęp do swoich danych finansowych w czasie rzeczywistym. MC Księgowość stawia na rzetelność, bezpieczeństwo i długotrwałą współpracę z klientami.
                        </p>
                    </motion.div>

                    { }
                    <motion.div className="PAPA-container" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <motion.div className="PAPA" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="my-button"
                                onClick={scrollToContact}
                            >
                                <p>KONTAKT</p>
                            </motion.button>
                        </motion.div>
                        <motion.div className="PAPA" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}><motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="my-button"
                            onClick={scrollToContact2}
                        >
                            <p>O NAS</p>
                            </motion.button></motion.div>
                    </motion.div>
                </motion.div>

                <motion.div className="hero-image" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <motion.div className="img-wrapper" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <img src={heroImage} alt="hero" className="hero-img" />
                    </motion.div>
                </motion.div>
            </motion.section>

            <motion.section className="features" variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}>
                <motion.div variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}><h1>O nas</h1><motion.div className="onas" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <p>Prowadzenie własnej firmy wiąże się z wieloma obowiązkami księgowymi, podatkowymi i kadrowymi, które wymagają czasu, precyzji i aktualnej wiedzy. Właśnie dlatego warto powierzyć je profesjonalistom, którzy zadbają o pełną zgodność z przepisami i pozwolą skupić się na rozwoju biznesu. Biuro rachunkowe MC Księgowość Kraków oferuje kompleksową obsługę księgową dla firm każdej wielkości – od jednoosobowych działalności gospodarczych po większe przedsiębiorstwa. Zapewniamy prowadzenie ksiąg rachunkowych, księgi przychodów i rozchodów, rozliczenia podatkowe oraz obsługę kadrowo-płacową. Nasze podejście opiera się na indywidualnym dopasowaniu usług do potrzeb klienta, rzetelności, terminowości i bieżącym doradztwie księgowym. Dzięki współpracy z nami zyskują Państwo nie tylko bezpieczeństwo rozliczeń, ale także wsparcie w podejmowaniu decyzji finansowych i oszczędność cennego czasu. Zapraszamy do kontaktu i współpracy – z MC Księgowość Kraków prowadzenie firmy staje się prostsze, bezpieczniejsze i bardziej efektywne.</p>
                    </motion.div>
                </motion.div>

                <motion.div className="opinie-section" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <h1>Opinie</h1>

                    <motion.div className="opinia-display" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="opinia-card"
                        >
                            <p className="opinia-text">"{reviews[currentIndex].text}"</p>
                            <span className="opinia-author">- {reviews[currentIndex].author}</span>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div className="pricing-single-wrapper" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <h1 className="plan-name">Cennik</h1>
                    <motion.div className="pricing-card">
                        <span className="symbol">Najtansza oferta</span>

                        <motion.div className="price-tag" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}>
                            <span className="symbol">$</span>
                            <span className="amount">199.99</span>
                            <span className="per">/Year</span>
                        </motion.div>

                        <ul className="features-list">
                            <li><span className="check">✓</span> Detail Page</li>
                            <li><span className="check">✓</span> Ratings and Reviews</li>
                            <li><span className="check">✓</span> E-mail</li>
                            <li><span className="check">✓</span> Url</li>
                            <li><span className="check">✓</span> Phone</li>
                            <li><span className="check">✓</span> Additional Phone</li>
                        </ul>

                        <button className="start-btn">Start Today</button>
                    </motion.div>
                </motion.div>
            </motion.section>
            <motion.section className="carousel" ref={contactKak} variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}>
                <motion.div className="Scroller" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <motion.ul
                        className="scroller_inner"

                        animate={{ x: ["0%", "-33.33%"] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 25,
                                ease: "linear",
                            },
                        }}
                    >
                        {TRIPLE_TAGS.map((tag, index) => (
                            <li key={index}>{tag}</li>
                        ))}
                    </motion.ul>
                </motion.div>
            </motion.section>



            <motion.section className="contact" variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}>
                <motion.div className="Contact-div" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <h1>Film o naszej firmie</h1>
                    <motion.div className="video-minimal" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <iframe
                            src="https://www.youtube.com/embed/RjMinRa5LUc?si=lEtU42oTNYUwnF-6"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </motion.div>
                </motion.div>

                <motion.div className="Contact-div" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>  <h1>Gdzie nas mozna znalezc</h1>
                    <motion.div style={{ height: '500px', width: '100%', borderRadius: '40px', overflow: 'hidden' }} variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                            <Map
                                defaultCenter={{ lat: 52.0, lng: 19.0 }} // Środek Polski
                                defaultZoom={6}
                                mapId={'Kupa'}
                            >
                                { }
                                {locations.map((loc) => (
                                    <AdvancedMarker
                                        key={loc.id}
                                        position={loc.position}
                                        title={loc.name}
                                    >
                                        { }
                                        <Pin background={'black'} borderColor={'pink'} glyphColor={'white'} />
                                    </AdvancedMarker>
                                ))}
                            </Map>
                        </APIProvider>
                    </motion.div>
                    { }
                </motion.div>
            </motion.section>



            <motion.section className="hero-main-container" ref={contactRef} variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}>
                { }
                <motion.div className="hero register-card-v2" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <motion.div className="hero-text" variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}>
                        <h1>Pozwól nam <span>ułatwić</span><br />PROWADZENIE FIRMY</h1>


                        <motion.div className="register-form-container" variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}>
                            <form className="my-form" onSubmit={handleProbnyPlanSubmit}>
                                <p>Podaj email wyslemi ci  probny plan</p>
                                <input
                                    type="email"
                                    placeholder="Adres e-mail"
                                    className="dark-input"
                                    value={probnyEmail}
                                    onChange={(e) => setProbnyEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="start-btn">Przetestuj za darmo →</button>
                            </form>




                        </motion.div>

                    </motion.div>
                </motion.div>

                { }
                <motion.div className="PAPA contact-card" variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}>
                    <h3>Napisz do nas ✉️</h3>
                    <p>Masz pytania? Chętnie pomożemy!</p>

                    <form className="my-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Twoje imię"
                            className="dark-input"
                            value={imie}
                            onChange={(e) => setImie(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Twój e-mail"
                            className="dark-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <textarea
                            placeholder="W czym możemy pomóc?"
                            className="dark-input dark-textarea"
                            value={wiadomosc}
                            onChange={(e) => setWiadomosc(e.target.value)}
                        />

                        <button type="submit" className="start-btn small-btn">
                            Wyślij wiadomość
                        </button>
                    </form>
                </motion.div>
            </motion.section>
        </>
    );
}