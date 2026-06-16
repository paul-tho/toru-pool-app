import { useState, Fragment } from 'react';
import { calculateStandings, isTourFinished, calculateStageBreakdown } from '../utils/scoring';

export default function Standings({ setCurrentView, participants, dailyResults }) {
    const standings = calculateStandings(participants, dailyResults);
    const tourDone = isTourFinished(dailyResults);
    // Set met uitgeklapte deelnemers (meerdere tegelijk mogelijk)
    const [expanded, setExpanded] = useState(() => new Set());

    const toggle = (id) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Aantal kolommen (voor de colspan van de detailrij)
    const colSpan = tourDone ? 5 : 3;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => setCurrentView('home')} style={{ marginBottom: '20px' }}>
                ← Terug
            </button>
            <h2>📊 Huidig klassement</h2>

            {!tourDone && (
                <div style={{
                    backgroundColor: '#FFFBEA',
                    border: '1px solid #FFD700',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    color: '#555',
                    fontSize: '14px',
                }}>
                    ℹ️ De truipunten (geel, bolletjes, groen en team) tellen pas mee na de
                    laatste etappe, op basis van het eindklassement. Klik op namen om de
                    punten per etappe te zien en deelnemers te vergelijken.
                </div>
            )}

            {standings.length === 0 ? (
                <p>Nog geen gegevens</p>
            ) : (
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
                        {tourDone && (
                            <>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Top 10</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Truien</th>
                            </>
                        )}
                        <th style={{ padding: '12px', textAlign: 'right' }}>Totaal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {standings.map((p, i) => {
                        const breakdown = calculateStageBreakdown(p.riders, dailyResults);
                        const isOpen = expanded.has(p.id);
                        return (
                            <Fragment key={p.id}>
                                <tr
                                    onClick={() => toggle(p.id)}
                                    style={{
                                        backgroundColor: isOpen ? '#FFFBEA' : (i % 2 === 0 ? '#f9f9f9' : '#fff'),
                                        borderBottom: '1px solid #eee',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                      <span style={{ marginRight: '8px', color: '#999' }}>
                        {isOpen ? '▼' : '▶'}
                      </span>
                                        {p.name}
                                    </td>
                                    {tourDone && (
                                        <>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>{p.topTenPoints}</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>{p.jerseyPoints}</td>
                                        </>
                                    )}
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                        {p.totalPoints}
                                    </td>
                                </tr>

                                {isOpen && (
                                    <tr>
                                        <td colSpan={colSpan} style={{ padding: '0 12px 16px 12px', backgroundColor: '#FFFBEA' }}>
                                            <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eee' }}>
                                                <strong style={{ display: 'block', marginBottom: '8px' }}>
                                                    Punten per etappe — {p.name}
                                                </strong>
                                                {breakdown.length === 0 ? (
                                                    <span style={{ color: '#999' }}>Nog geen etappes ingevoerd.</span>
                                                ) : (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {breakdown.map(b => (
                                                            <div key={b.stage} style={{
                                                                minWidth: '64px',
                                                                textAlign: 'center',
                                                                padding: '8px',
                                                                borderRadius: '6px',
                                                                backgroundColor: b.points > 0 ? '#FFD700' : '#f0f0f0',
                                                                color: b.points > 0 ? '#000' : '#999',
                                                            }}>
                                                                <div style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                                                                    Et. {b.stage}
                                                                </div>
                                                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                                                    {b.points}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {tourDone && (
                                                    <div style={{ marginTop: '12px', fontSize: '14px', color: '#555' }}>
                                                        + Truipunten (eindklassement): <strong>{p.jerseyPoints}</strong>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
