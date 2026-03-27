import { useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

type DaneMiesieczne = {
    miesiac: string;
    przychody: number;
    koszty: number;
    wynik: number;
};

type Props = {
    login: string;
};

export default function KolowyWykresFinanse({ login }: Props) {
    const [data, setData] = useState<DaneMiesieczne[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const pobierzDane = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `https://localhost:7093/api/statystyki/miesieczne/${login}`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    const text = await response.text();
                    console.error("B³¹d backendu:", text);
                    throw new Error("Nie uda³o siê pobraæ danych");
                }

                const json = await response.json();
                setData(json);
            } catch (err) {
                console.error(err);
                setError("B³¹d podczas pobierania danych.");
            } finally {
                setLoading(false);
            }
        };

        if (login) {
            pobierzDane();
        }
    }, [login]);

    const sumaPrzychodow = useMemo(() => {
        return data.reduce((sum, item) => sum + Number(item.przychody || 0), 0);
    }, [data]);

    const sumaKosztow = useMemo(() => {
        return data.reduce((sum, item) => sum + Number(item.koszty || 0), 0);
    }, [data]);

    const daneKolowe = useMemo(
        () => [
            { name: "Przychody", value: sumaPrzychodow },
            { name: "Koszty", value: sumaKosztow },
        ],
        [sumaPrzychodow, sumaKosztow]
    );

    if (loading) return <p>Ladowanie wykresu...</p>;
    if (error) return <p>{error}</p>;
    if (!data.length) return <p>Brak danych do wyswietlenia.</p>;

    return (
        <div className="kolowy-finanse-wrapper">
            <div className="kolowy-finanse-summary">
                <div className="kolowy-summary-card">
                    <span>Koszty: caly rok</span>
                    <strong>{sumaKosztow.toFixed(2)} pln</strong>
                </div>

                <div className="kolowy-summary-card">
                    <span>Przychody: caly rok</span>
                    <strong>{sumaPrzychodow.toFixed(2)} pln</strong>
                </div>
            </div>

            <div className="kolowy-finanse-chart">
                <ResponsiveContainer width="100%" height={340}>
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                            data={daneKolowe}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            label
                        >
                            <Cell fill="#7c6cff" />
                            <Cell fill="#36a2ff" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}