import { useState } from 'react';
import { supabase } from '../App';
import RiderSelect from './RiderSelect';

export default function SubmitForm({ setCurrentView, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        riders: Array(10).fill(''),
        yellow_jersey: '',
        polka_dots_jersey: '',
        green_jersey: '',
        team_classification: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            alert('Vul je naam in');
            return;
        }
        if (formData.riders.filter(r => r).length !== 10) {
            alert('Selecteer precies 10 renners');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('participants').insert([formData]);
            if (error) throw error;
            alert('Inzending gelukt!');
            onSubmit();
        } catch (error) {
            alert('Fout: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => setCurrentView('home')} style={{ marginBottom: '20px' }}>
                ← Terug
            </button>
            <h2>Vul je top 10 renners in</h2>

            <div style={{ marginBottom: '20px' }}>
                <label>Je naam:</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Vul je naam in"
                    style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Je top 10 renners</h3>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                    <RiderSelect
                        key={i}
                        value={formData.riders[i]}
                        onChange={(riderId) => {
                            const newRiders = [...formData.riders];
                            newRiders[i] = riderId;
                            setFormData({ ...formData, riders: newRiders });
                        }}
                        label={`#${i + 1}`}
                    />
                ))}
            </div>

            <div style={{ marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                <h3>Trui- en teamvoorspellingen</h3>
                <RiderSelect
                    value={formData.yellow_jersey}
                    onChange={(id) => setFormData({ ...formData, yellow_jersey: id })}
                    label="Gele Trui (Algemeen klassement)"
                />
                <RiderSelect
                    value={formData.polka_dots_jersey}
                    onChange={(id) => setFormData({ ...formData, polka_dots_jersey: id })}
                    label="Bolletjestrui (Bergklassement)"
                />
                <RiderSelect
                    value={formData.green_jersey}
                    onChange={(id) => setFormData({ ...formData, green_jersey: id })}
                    label="Groene Trui (Sprintklassement)"
                />
                <div style={{ marginTop: '10px' }}>
                    <label>Teamklassement:</label>
                    <input
                        type="text"
                        value={formData.team_classification}
                        onChange={(e) => setFormData({ ...formData, team_classification: e.target.value })}
                        placeholder="Vul teamnaam in"
                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '18px',
                    backgroundColor: '#FFD700',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                }}
            >
                {loading ? 'Bezig met verzenden...' : 'Verzenden'}
            </button>
        </div>
    );
}
