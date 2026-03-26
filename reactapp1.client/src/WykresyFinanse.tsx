import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
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

export default function WykresyFinanse({ login }: Props) {
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

                console.log("LOGIN:", login);
                console.log("STATUS:", response.status);

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

    if (loading) return <p>£adowanie wykresu...</p>;
    if (error) return <p>{error}</p>;
    if (!data.length) return <p>Brak danych do wyœwietlenia.</p>;

    return (
        <div className="wykresy-finanse">
            <div className="wykres-box">
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="miesiac" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="przychody" name="Przychody" />
                        <Bar dataKey="koszty" name="Koszty" />
                        <Line
                            type="monotone"
                            dataKey="wynik"
                            name="Wynik"
                            strokeWidth={3}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}