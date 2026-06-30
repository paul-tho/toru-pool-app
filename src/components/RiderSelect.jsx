import { useState } from 'react';
import { RIDERS_2026 } from '../data/2026/riders.js';
import { TEAMS_2026 } from '../data/2026/teams.js';

export default function RiderSelect({ value, onChange, label, exclude = [] }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    // Find the team name for a given rider
    const getTeamName = (teamId) => {
        const team = TEAMS_2026.find(t => t.id === teamId);
        return team ? team.name : '';
    };

    // The currently selected rider (if any)
    const selectedRider = RIDERS_2026.find(r => r.id === value);

    // Filter riders by search term, en verberg al gekozen renners (behalve de eigen keuze)
    const filtered = RIDERS_2026.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) &&
        (!exclude.includes(r.id) || r.id === value)
    );

    return (
        <div style={{ marginBottom: '12px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                {label}
            </label>

            {selectedRider ? (
                // Show selected rider with team + clear button
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    border: '2px solid #FFD700',
                    borderRadius: '4px',
                    backgroundColor: '#FFFBEA',
                }}>
          <span>
            <strong>{selectedRider.name}</strong>
            <span style={{ color: '#666', marginLeft: '8px', fontSize: '13px' }}>
              {getTeamName(selectedRider.teamId)}
            </span>
          </span>
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
                // Show search input
                <>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setOpen(true)}
                        onBlur={() => setTimeout(() => setOpen(false), 150)}
                        placeholder="Zoek renner..."
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
                            {filtered.map(rider => (
                                <div
                                    key={rider.id}
                                    onMouseDown={() => {
                                        onChange(rider.id);
                                        setSearch('');
                                        setOpen(false);
                                    }}
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFBEA'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    <span>{rider.name}</span>
                                    <span style={{ color: '#888', fontSize: '13px' }}>
                    {getTeamName(rider.teamId)}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
