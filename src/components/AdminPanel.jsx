import { useState } from 'react';
import { supabase } from '../App';
import RiderSelect from './RiderSelect';

export default function AdminPanel({ setCurrentView, onSubmit }) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [stageResults, setStageResults] = useState({
        stage: 1,
        top_10_riders: Array(10).fill(''),
        yellow_jersey: '',
        polka_dots_jersey: '',
        green_jersey: '',
        team_classification: '',
    });

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
            setStageResults({
                stage: stageResults.stage + 1,
                top_10_riders: Array(10).fill(''),
                yellow_jersey: '',
                polka_dots_jersey: '',
                green_jersey: '',
                team_classification: '',
            });
            onSubmit();
        } catch (error) {
            alert('Fout: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthed) {
        return (
            <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
                <button onClick={() => setCurrentView('home')} style={{ marginBottom: '20px' }}>
                    ← Terug
                </button>
                <h2>Beheerder inloggen</h2>
                <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Vul beheerderswachtwoord in"
                    style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                    onClick={() => handleLogin(adminPassword)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    Inloggen
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => { setCurrentView('home'); setIsAuthed(false); }} style={{ marginBottom: '20px' }}>
                ← Uitloggen
            </button>
            <h2>⚙️ Beheer - Etappe-uitslag toevoegen</h2>

            <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label>Etappe:</label>
                    <input
                        type="number"
                        value={stageResults.stage}
                        onChange={(e) => setStageResults({ ...stageResults, stage: parseInt(e.target.value) })}
                        style={{ width: '100px', padding: '8px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <h3>Top 10 renners</h3>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
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

                <h3 style={{ marginTop: '20px' }}>Truidragers van de dag</h3>
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
                <div style={{ marginTop: '10px' }}>
                    <label>Leidend team:</label>
                    <input
                        type="text"
                        value={stageResults.team_classification}
                        onChange={(e) => setStageResults({ ...stageResults, team_classification: e.target.value })}
                        placeholder="Vul teamnaam in"
                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <button
                    onClick={handleAddStageResult}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '16px',
                        marginTop: '20px',
                        fontSize: '18px',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    {loading ? 'Bezig met opslaan...' : 'Etappe-uitslag opslaan'}
                </button>
            </div>
        </div>
    );
}
