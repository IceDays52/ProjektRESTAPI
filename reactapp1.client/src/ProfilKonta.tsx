import { useEffect, useState } from "react";
import './App.css';
import { useNavigate } from "react-router-dom";
export default function ProfilKonta() {
    const [login, setLogin] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:7093/api/Auth/me", {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Nie zalogowany");
                return res.json();
            })
            .then(data => {
                setLogin(data.login);
            })
            .catch(() => {
                setLogin("Brak u¿ytkownika");
            });
    }, []);

    return (
        <div className="Layout">
            <div className="Boczny">
                <h1 onClick={() => navigate("/")}>MC</h1>
               
            </div>

            <main className="Konto">
                <div className="Profil">
                    <h1>Witaj - {login}</h1>
           
                </div>
                <div>
                <h1>Statystki</h1>
                </div>


                  <div>
                    <h1>Koszty/Przychody</h1>

                </div>
                    <div>
                        <h1>Powiadomienia</h1>
                    </div>
                    <div>
                        <h1>Zalaczniki - do pobrania</h1>
                        <h1>PDF - Do Pobrania</h1>
                    </div>

                
            </main>
        </div>
    );
}