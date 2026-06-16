import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../App';
import RiderSelect from './RiderSelect';
import TeamSelect from './TeamSelect';
import { RIDERS_2025 } from '../data/2026/riders';
import { STAGES_2025 } from '../data/2026/stages';
import { calculateStandings, isTourFinished, calculateStagePoints } from '../utils/scoring';

const emptyStage = (stage) => ({
    stage,
    top_10_riders: Array(10).fill(''),
    yellow_jersey: '',
    polka_dots_jersey: '',
    green_jersey: '',
    team_classification: '',
});

const riderName = (id) => {
    const r = RIDERS_2025.find(x => x.id === id);
    return r ? r.name : '—';
};

const stageInfo = (num) => STAGES_2025.find(s => s.stage === num);

export default function AdminPanel({ setCurrentView, onSubmit }) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [stageResults, setStageResults] = useState(emptyStage(1));
    const [allStages, setAllStages] = useState([]);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (isAuthed) loadStages();
    }, [isAuthed]);

    const loadStages = async () => {
        const { data } = await supabase
            .from('daily_results')
            .select('*')
            .order('stage', { ascending: true });
        if (data) setAllStages(data);
    };

    // PDF-export: haalt deelnemers op, berekent de stand en maakt een PDF
    const exportPDF = async () => {
        setExporting(true);
        try {
            const { data: participants, error } = await supabase
                .from('participants')
                .select('*');
            if (error) throw error;

            const standings = calculateStandings(participants || [], allStages);
            const tourDone = isTourFinished(allStages);

            // Etappes in oplopende volgorde voor de kolommen
            const stagesSorted = [...allStages].sort((a, b) => a.stage - b.stage);

            // Liggend formaat als er veel etappe-kolommen zijn (meer ruimte)
            const doc = new jsPDF({
                orientation: stagesSorted.length > 6 ? 'landscape' : 'portrait',
            });
            doc.setFontSize(20);
            doc.text('Tour Poule - Klassement', 14, 22);
            doc.setFontSize(10);
            doc.text(`Bijgewerkt: ${new Date().toLocaleString('nl-NL')}`, 14, 30);

            // Kolomkoppen: positie, naam, één kolom per etappe, dan de totalen
            const stageHeaders = stagesSorted.map(s => `Et.${s.stage}`);
            const columns = tourDone
                ? ['Pos', 'Naam', ...stageHeaders, 'Top 10', 'Truien', 'Totaal']
                : ['Pos', 'Naam', ...stageHeaders, 'Totaal'];

            const body = standings.map((p, i) => {
                const stageCells = stagesSorted.map(s => calculateStagePoints(p.riders, s));
                return tourDone
                    ? [i + 1, p.name, ...stageCells, p.topTenPoints, p.jerseyPoints, p.totalPoints]
                    : [i + 1, p.name, ...stageCells, p.totalPoints];
            });

            autoTable(doc, {
                head: [columns],
                body,
                startY: 40,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] },
                columnStyles: { 1: { halign: 'left' } },
            });

            doc.save(`tour-poule-klassement-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (e) {
            alert('Fout bij PDF maken: ' + e.message);
        } finally {
            setExporting(false);
        }
    };

    const handleLogin = (password) => {
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
            setIsAuthed(true);
            setAdminPassword('');
        } else {
            alert('Onjuist wachtwoord');
        }
    };

    const handleAddStageResult = async () => {
        if (stageResults.top_10_riders.filter(r => r).length !== 10) {
            alert('Selecteer precies 10 renners voor de top 10');
            return;
        }

        setLoading(true);
        try {
            const { data: existing } = await supabase
                .from('daily_results')
                .select('*')
                .eq('stage', stageResults.stage);

            if (existing && existing.length > 0) {
                const { error } = await supabase
                    .from('daily_results')
                    .update(stageResults)
                    .eq('stage', stageResults.stage);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('daily_results').insert([stageResults]);
                if (error) throw error;
            }

            alert('Etappe-uitslag opgeslagen!');
            // Spring naar de volgende etappe die nog bestaat in de lijst
            const next = STAGES_2025.find(s => s.stage === stageResults.stage + 1);
            setStageResults(emptyStage(next ? next.stage : stageResults.stage));
            await loadStages();
            onSubmit();
        } catch (error) {
            alert('Fout: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const editStage = (s) => {
        setStageResults({
            stage: s.stage,
            top_10_riders: [...(s.top_10_riders || []), ...Array(10).fill('')].slice(0, 10),
            yellow_jersey: s.yellow_jersey || '',
            polka_dots_jersey: s.polka_dots_jersey || '',
            green_jersey: s.green_jersey || '',
            team_classification: s.team_classification || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ---- Styling helpers ----
    const card = {
        backgroundColor: '#fff',
        border: '4px solid #FFD700',
        borderRadius: '0px',
        padding: '24px',
        marginBottom: '24px',
    };
    const heading = {
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '900',
    };
    const darkBtn = {
        padding: '14px 24px',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        border: 'none',
        borderRadius: '0px',
        cursor: 'pointer',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    };

    // ---- Login scherm ----
    if (!isAuthed) {
        return (
            <div style={{ maxWidth: '420px', margin: '80px auto', padding: '20px' }}>
                <button onClick={() => setCurrentView('home')} style={{ marginBottom: '20px' }}>
                    ← Terug
                </button>
                <div style={card}>
                    <h2 style={{ ...heading, marginTop: 0, color: '#1a1a1a' }}>Beheerder inloggen</h2>
                    <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(adminPassword); }}
                        placeholder="Vul beheerderswachtwoord in"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box',
                        }}
                    />
                    <button onClick={() => handleLogin(adminPassword)} style={{ ...darkBtn, width: '100%' }}>
                        Inloggen
                    </button>
                </div>
            </div>
        );
    }

    const current = stageInfo(stageResults.stage);

    // ---- Admin scherm ----
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => { setCurrentView('home'); setIsAuthed(false); }} style={{ marginBottom: '20px' }}>
                ← Uitloggen
            </button>

            <h2 style={{ ...heading, color: '#1a1a1a' }}>
                ⚙️ Beheer — Etappe-uitslag
            </h2>

            <div style={card}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                        Kies etappe:
                    </label>
                    <select
                        value={stageResults.stage}
                        onChange={(e) => {
                            const num = parseInt(e.target.value);
                            const existing = allStages.find(s => s.stage === num);
                            if (existing) {
                                editStage(existing);
                            } else {
                                setStageResults(emptyStage(num));
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            fontSize: '15px',
                        }}
                    >
                        {STAGES_2025.map(s => {
                            const done = allStages.some(a => a.stage === s.stage);
                            return (
                                <option key={s.stage} value={s.stage}>
                                    {done ? '✓ ' : ''}Etappe {s.stage} ({s.date}) — {s.route}
                                </option>
                            );
                        })}
                    </select>
                    {current && (
                        <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '14px' }}>
                            📍 <strong>{current.route}</strong> · {current.date}
                        </p>
                    )}
                </div>

                <h3 style={heading}>Top 10 renners</h3>
                {[0,1,2,3,4,5,6,7,8,9].map(i => (
                    <RiderSelect
                        key={i}
                        value={stageResults.top_10_riders[i]}
                        onChange={(riderId) => {
                            const newTop10 = [...stageResults.top_10_riders];
                            newTop10[i] = riderId;
                            setStageResults({ ...stageResults, top_10_riders: newTop10 });
                        }}
                        label={`Positie ${i + 1}`}
                    />
                ))}

                <h3 style={{ ...heading, marginTop: '20px' }}>Truidragers van de dag</h3>
                <RiderSelect
                    value={stageResults.yellow_jersey}
                    onChange={(id) => setStageResults({ ...stageResults, yellow_jersey: id })}
                    label="Drager Gele Trui"
                />
                <RiderSelect
                    value={stageResults.polka_dots_jersey}
                    onChange={(id) => setStageResults({ ...stageResults, polka_dots_jersey: id })}
                    label="Drager Bolletjestrui"
                />
                <RiderSelect
                    value={stageResults.green_jersey}
                    onChange={(id) => setStageResults({ ...stageResults, green_jersey: id })}
                    label="Drager Groene Trui"
                />
                <TeamSelect
                    value={stageResults.team_classification}
                    onChange={(teamName) => setStageResults({ ...stageResults, team_classification: teamName })}
                    label="Leidend team"
                />

                <button
                    onClick={handleAddStageResult}
                    disabled={loading}
                    style={{
                        ...darkBtn,
                        width: '100%',
                        marginTop: '20px',
                        fontSize: '18px',
                        padding: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Bezig met opslaan...' : 'Etappe-uitslag opslaan'}
                </button>
            </div>

            {/* Overzicht ingevoerde etappes */}
            <div style={card}>
                <h3 style={{ ...heading, marginTop: 0 }}>Ingevoerde etappes</h3>
                {allStages.length === 0 ? (
                    <p style={{ color: '#666' }}>Nog geen etappes ingevoerd.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#FFD700' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Etappe</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Parcours</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Winnaar</th>
                            <th style={{ padding: '10px' }}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {allStages.map((s) => {
                            const info = stageInfo(s.stage);
                            return (
                                <tr key={s.stage} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.stage}</td>
                                    <td style={{ padding: '10px', fontSize: '14px' }}>{info ? info.route : '—'}</td>
                                    <td style={{ padding: '10px' }}>{riderName(s.top_10_riders?.[0])}</td>
                                    <td style={{ padding: '10px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => editStage(s)}
                                            style={{
                                                padding: '6px 14px',
                                                backgroundColor: '#EF3340',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Bewerken
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* PDF exporteren */}
            <div style={card}>
                <h3 style={{ ...heading, marginTop: 0 }}>Klassement exporteren</h3>
                <p style={{ color: '#666', marginTop: 0 }}>
                    Maak een PDF van het volledige klassement met de score per etappe.
                </p>
                <button
                    onClick={exportPDF}
                    disabled={exporting}
                    style={{
                        marginTop: '16px',
                        padding: '14px 24px',
                        backgroundColor: '#EF3340',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0px',
                        cursor: exporting ? 'not-allowed' : 'pointer',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}
                >
                    {exporting ? 'Bezig met maken...' : '📥 Klassement als PDF exporteren'}
                </button>
            </div>
        </div>
    );
}
