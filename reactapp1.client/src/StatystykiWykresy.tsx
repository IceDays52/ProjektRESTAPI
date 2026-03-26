import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
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

export default function StatystykiWykresy({ login }: Props) {
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
                setError("B³¹d podczas pobierania danych statystycznych.");
            } finally {
                setLoading(false);
            }
        };

        if (login) {
            pobierzDane();
        }
    }, [login]);

    if (loading) return <p>£adowanie statystyk...</p>;
    if (error) return <p>{error}</p>;
    if (!data.length) return <p>Brak danych do wyœwietlenia.</p>;

    return (
        <div className="statystyki-wykresy">
            <div className="wykres-box">
                <h3>Przychody i koszty miesieczne</h3>
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="miesiac" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="przychody" name="Przychody" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="koszty" name="Koszty" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="wykres-box">
                <h3>Wynik miesieczny</h3>
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="miesiac" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="wynik" name="Wynik" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}