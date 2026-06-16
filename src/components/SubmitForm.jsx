import { useState } from 'react';
import { supabase } from '../App';
import RiderSelect from './RiderSelect';
import TeamSelect from './TeamSelect';
import NavButton from './NavButton';

// === Pas deze waardes later aan ===
const TIKKIE_LINK = 'https://tikkie.me/pay/pj3l9p5astpsptq72lbi';
const INLEG_BEDRAG = '€5,00';
// Deadline: Tour start 4 juli 2026 om 12:00 (maanden zijn 0-gebaseerd, dus 6 = juli)
const DEADLINE = new Date(2026, 6, 4, 12, 0, 0);
// ===================================

export default function SubmitForm({ setCurrentView, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        riders: Array(10).fill(''),
        yellow_jersey: '',
        polka_dots_jersey: '',
        green_jersey: '',
        team_classification: '',
    });
    const [paid, setPaid] = useState(false);
    const [tikkieOpened, setTikkieOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    // Is de deadline verstreken?
    const closed = new Date() >= DEADLINE;

    // Bepaal welke onderdelen nog ontbreken
    const missing = [];
    if (!formData.name.trim()) missing.push('je naam');
    const chosenRiders = formData.riders.filter(r => r).length;
    if (chosenRiders < 10) missing.push(`${10 - chosenRiders} renner(s) in je top 10`);
    if (!formData.yellow_jersey) missing.push('Gele Trui');
    if (!formData.polka_dots_jersey) missing.push('Bolletjestrui');
    if (!formData.green_jersey) missing.push('Groene Trui');
    if (!formData.team_classification) missing.push('Teamklassement');

    const formComplete = missing.length === 0;

    const handleSubmit = async () => {
        if (closed) {
            alert('De inschrijving is gesloten. De Tour is al begonnen.');
            return;
        }
        if (!formComplete) {
            alert('Vul eerst het hele formulier in');
            return;
        }
        if (!paid) {
            alert('Bevestig eerst dat je de inleg via Tikkie hebt betaald');
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

    const canSubmit = !closed && formComplete && paid && !loading;

    // Als de inschrijving gesloten is: toon alleen een melding
    if (closed) {
        return (
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
                <NavButton onClick={() => setCurrentView('home')}>← Terug</NavButton>
                <div style={{
                    backgroundColor: '#FFFBEA',
                    border: '2px solid #FFD700',
                    borderRadius: '8px',
                    padding: '40px 30px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '16px' }}>🚴</div>
                    <h2 style={{ marginTop: 0 }}>Inschrijving gesloten</h2>
                    <p style={{ color: '#555', fontSize: '17px' }}>
                        De Tour de France is begonnen, dus je kunt geen inzending meer insturen.
                        Bekijk het klassement om te zien hoe iedereen ervoor staat!
                    </p>
                    <button
                        onClick={() => setCurrentView('standings')}
                        style={{
                            marginTop: '16px',
                            padding: '14px 28px',
                            backgroundColor: '#EF3340',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}
                    >
                        🏆 Bekijk klassement
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
            <NavButton onClick={() => setCurrentView('home')}>← Terug</NavButton>
            <h2>Vul je top 10 renners in</h2>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                    Je naam:
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Vul je naam in"
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        boxSizing: 'border-box',
                    }}
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
                        exclude={formData.riders.filter(r => r)}
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
                <TeamSelect
                    value={formData.team_classification}
                    onChange={(teamName) => setFormData({ ...formData, team_classification: teamName })}
                    label="Teamklassement"
                />
            </div>

            {/* Betaalsectie */}
            <div style={{
                marginBottom: '20px',
                backgroundColor: '#FFFBEA',
                border: '2px solid #FFD700',
                padding: '20px',
                borderRadius: '8px',
            }}>
                <h3 style={{ marginTop: 0 }}>💶 Inleg betalen</h3>
                <p style={{ color: '#555', marginTop: 0 }}>
                    Een inzending kost <strong>{INLEG_BEDRAG}</strong>. Vul eerst het hele
                    formulier in, betaal daarna via Tikkie en bevestig hieronder.
                </p>

                {!formComplete && (
                    <div style={{
                        backgroundColor: '#fff',
                        border: '1px solid #EF3340',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        marginBottom: '16px',
                    }}>
                        <strong style={{ color: '#EF3340' }}>Nog niet compleet — vul eerst in:</strong>
                        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#555' }}>
                            {missing.map((m, idx) => <li key={idx}>{m}</li>)}
                        </ul>
                    </div>
                )}

                {formComplete ? (
                    <a
                        href={TIKKIE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setTikkieOpened(true)}
                        style={{
                            display: 'inline-block',
                            padding: '14px 24px',
                            backgroundColor: '#06A4D9',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                        }}
                    >
                        🔗 Betaal {INLEG_BEDRAG} via Tikkie
                    </a>
                ) : (
                    <button
                        disabled
                        style={{
                            display: 'inline-block',
                            padding: '14px 24px',
                            backgroundColor: '#e0e0e0',
                            color: '#999',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            cursor: 'not-allowed',
                        }}
                    >
                        🔗 Betaal {INLEG_BEDRAG} via Tikkie
                    </button>
                )}

                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: tikkieOpened ? 'pointer' : 'not-allowed',
                    opacity: tikkieOpened ? 1 : 0.5,
                }}>
                    <input
                        type="checkbox"
                        checked={paid}
                        disabled={!tikkieOpened}
                        onChange={(e) => setPaid(e.target.checked)}
                        style={{ width: '20px', height: '20px' }}
                    />
                    <span>Ik heb de inleg via Tikkie betaald</span>
                </label>
                {formComplete && !tikkieOpened && (
                    <p style={{ fontSize: '13px', color: '#999', margin: '8px 0 0 0' }}>
                        Klik eerst op de Tikkie-knop hierboven.
                    </p>
                )}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '18px',
                    backgroundColor: canSubmit ? '#FFD700' : '#e0e0e0',
                    color: canSubmit ? '#000' : '#999',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                }}
            >
                {loading ? 'Bezig met verzenden...' : 'Verzenden'}
            </button>
        </div>
    );
}
