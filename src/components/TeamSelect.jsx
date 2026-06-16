import { useState } from 'react';
import { TEAMS_2025 } from '../data/2026/teams.js';

export default function TeamSelect({ value, onChange, label }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    // value is the team name (string) stored in team_classification
    const selectedTeam = TEAMS_2025.find(t => t.name === value);

    const filtered = TEAMS_2025.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ marginBottom: '12px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                {label}
            </label>

            {selectedTeam ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    border: '2px solid #FFD700',
                    borderRadius: '4px',
                    backgroundColor: '#FFFBEA',
                }}>
                    <strong>{selectedTeam.name}</strong>
                    <button
                        onClick={() => {
                            onChange('');
                            setSearch('');
                        }}
                        style={{
                            border: 'none',
                            background: '#EF3340',
                            color: '#fff',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setOpen(true)}
                        onBlur={() => setTimeout(() => setOpen(false), 150)}
                        placeholder="Zoek team..."
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {open && filtered.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            border: '1px solid #ccc',
                            borderTop: 'none',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            backgroundColor: '#fff',
                            zIndex: 20,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}>
                            {filtered.map(team => (
                                <div
                                    key={team.id}
                                    onMouseDown={() => {
                                        onChange(team.name);
                                        setSearch('');
                                        setOpen(false);
                                    }}
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFBEA'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    {team.name}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
