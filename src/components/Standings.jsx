import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { calculateStandings } from '../utils/scoring';

export default function Standings({ setCurrentView, participants, dailyResults }) {
    const standings = calculateStandings(participants, dailyResults);

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Tour Poule - Klassement', 14, 22);

        doc.setFontSize(10);
        doc.text(`Bijgewerkt: ${new Date().toLocaleString('nl-NL')}`, 14, 30);

        const columns = ['Positie', 'Naam', 'Top 10 pnt', 'Trui pnt', 'Totaal'];
        const data = standings.map((p, i) => [
            i + 1,
            p.name,
            p.topTenPoints,
            p.jerseyPoints,
            p.totalPoints
        ]);

        doc.autoTable({
            head: [columns],
            body: data,
            startY: 40,
            headStyles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] },
        });

        doc.save(`tour-poule-klassement-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => setCurrentView('home')} style={{ marginBottom: '20px' }}>
                ← Terug
            </button>
            <h2>📊 Huidig klassement</h2>

            {standings.length === 0 ? (
                <p>Nog geen gegevens</p>
            ) : (
                <>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginBottom: '20px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}>
                        <thead>
                        <tr style={{ backgroundColor: '#FFD700' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Positie</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Naam</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Top 10</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Truien</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Totaal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {standings.map((p, i) => (
                            <tr key={i} style={{
                                backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#fff',
                                borderBottom: '1px solid #eee',
                            }}>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                </td>
                                <td style={{ padding: '12px' }}>{p.name}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>{p.topTenPoints}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>{p.jerseyPoints}</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                    {p.totalPoints}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <button
                        onClick={exportPDF}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#EF3340',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        📥 Exporteer als PDF
                    </button>
                </>
            )}
        </div>
    );
}
