import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Initialize Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Riders data - all 184 Tour de France 2025 starters
const RIDERS_2025 = [
    // UAE Team Emirates - XRG
    { id: 1, name: 'Tadej Pogačar', team: 'UAE Team Emirates' },
    { id: 2, name: 'João Almeida', team: 'UAE Team Emirates' },
    { id: 3, name: 'Jhonatan Narváez', team: 'UAE Team Emirates' },
    { id: 4, name: 'Nils Politt', team: 'UAE Team Emirates' },
    { id: 5, name: 'Pavel Sivakov', team: 'UAE Team Emirates' },
    { id: 6, name: 'Marc Soler', team: 'UAE Team Emirates' },
    { id: 7, name: 'Tim Wellens', team: 'UAE Team Emirates' },
    { id: 8, name: 'Adam Yates', team: 'UAE Team Emirates' },
    // Team Visma | Lease a Bike
    { id: 11, name: 'Jonas Vingegaard', team: 'Team Visma | Lease a Bike' },
    { id: 12, name: 'Edoardo Affini', team: 'Team Visma | Lease a Bike' },
    { id: 13, name: 'Tiesj Benoot', team: 'Team Visma | Lease a Bike' },
    { id: 14, name: 'Victor Campenaerts', team: 'Team Visma | Lease a Bike' },
    { id: 15, name: 'Matteo Jorgenson', team: 'Team Visma | Lease a Bike' },
    { id: 16, name: 'Sepp Kuss', team: 'Team Visma | Lease a Bike' },
    { id: 17, name: 'Wout van Aert', team: 'Team Visma | Lease a Bike' },
    { id: 18, name: 'Simon Yates', team: 'Team Visma | Lease a Bike' },
    // Soudal Quick-Step
    { id: 21, name: 'Remco Evenepoel', team: 'Soudal Quick-Step' },
    { id: 22, name: 'Mattia Cattaneo', team: 'Soudal Quick-Step' },
    { id: 23, name: 'Pascal Eenkhoorn', team: 'Soudal Quick-Step' },
    { id: 24, name: 'Tim Merlier', team: 'Soudal Quick-Step' },
    { id: 25, name: 'Valentin Paret-Peintre', team: 'Soudal Quick-Step' },
    { id: 26, name: 'Maximilian Schachmann', team: 'Soudal Quick-Step' },
    { id: 27, name: 'Bert Van Lerberghe', team: 'Soudal Quick-Step' },
    { id: 28, name: 'Ilan van Wilder', team: 'Soudal Quick-Step' },
    // EF Education - EasyPost
    { id: 31, name: 'Ben Healy', team: 'EF Education - EasyPost' },
    { id: 32, name: 'Vincenzo Albanese', team: 'EF Education - EasyPost' },
    { id: 33, name: 'Kasper Asgreen', team: 'EF Education - EasyPost' },
    { id: 34, name: 'Alex Baudin', team: 'EF Education - EasyPost' },
    { id: 35, name: 'Neilson Powless', team: 'EF Education - EasyPost' },
    { id: 36, name: 'Harry Sweeny', team: 'EF Education - EasyPost' },
    { id: 37, name: 'Michael Valgren', team: 'EF Education - EasyPost' },
    { id: 38, name: 'Marijn van den Berg', team: 'EF Education - EasyPost' },
    // Intermarché - Wanty
    { id: 41, name: 'Biniam Girmay', team: 'Intermarché - Wanty' },
    { id: 42, name: 'Louis Barré', team: 'Intermarché - Wanty' },
    { id: 43, name: 'Vito Braet', team: 'Intermarché - Wanty' },
    { id: 44, name: 'Hugo Page', team: 'Intermarché - Wanty' },
    { id: 45, name: 'Laurenz Rex', team: 'Intermarché - Wanty' },
    { id: 46, name: 'Jonas Rutsch', team: 'Intermarché - Wanty' },
    { id: 47, name: 'Roel van Sintmaartensdijk', team: 'Intermarché - Wanty' },
    { id: 48, name: 'Georg Zimmermann', team: 'Intermarché - Wanty' },
    // Bahrain - Victorious
    { id: 51, name: 'Santiago Buitrago', team: 'Bahrain - Victorious' },
    { id: 52, name: 'Phil Bauhaus', team: 'Bahrain - Victorious' },
    { id: 53, name: 'Kamil Gradek', team: 'Bahrain - Victorious' },
    { id: 54, name: 'Jack Haig', team: 'Bahrain - Victorious' },
    { id: 55, name: 'Lenny Martinez', team: 'Bahrain - Victorious' },
    { id: 56, name: 'Matej Mohorič', team: 'Bahrain - Victorious' },
    { id: 57, name: 'Robert Stannard', team: 'Bahrain - Victorious' },
    { id: 58, name: 'Fred Wright', team: 'Bahrain - Victorious' },
    // INEOS Grenadiers
    { id: 61, name: 'Geraint Thomas', team: 'INEOS Grenadiers' },
    { id: 62, name: 'Thymen Arensman', team: 'INEOS Grenadiers' },
    { id: 63, name: 'Tobias Foss', team: 'INEOS Grenadiers' },
    { id: 64, name: 'Egan Bernal', team: 'INEOS Grenadiers' },
    { id: 65, name: 'Axel Laurance', team: 'INEOS Grenadiers' },
    { id: 66, name: 'Carlos Rodríguez', team: 'INEOS Grenadiers' },
    { id: 67, name: 'Connor Swift', team: 'INEOS Grenadiers' },
    { id: 68, name: 'Samuel Watson', team: 'INEOS Grenadiers' },
    // Red Bull - BORA - hansgrohe
    { id: 71, name: 'Primož Roglič', team: 'Red Bull - BORA - hansgrohe' },
    { id: 72, name: 'Florian Lipowitz', team: 'Red Bull - BORA - hansgrohe' },
    { id: 73, name: 'Jordi Meeus', team: 'Red Bull - BORA - hansgrohe' },
    { id: 74, name: 'Gianni Moscon', team: 'Red Bull - BORA - hansgrohe' },
    { id: 75, name: 'Laurence Pithie', team: 'Red Bull - BORA - hansgrohe' },
    { id: 76, name: 'Mick van Dijke', team: 'Red Bull - BORA - hansgrohe' },
    { id: 77, name: 'Danny van Poppel', team: 'Red Bull - BORA - hansgrohe' },
    { id: 78, name: 'Aleksandr Vlasov', team: 'Red Bull - BORA - hansgrohe' },
    // Lidl - Trek
    { id: 81, name: 'Jonathan Milan', team: 'Lidl - Trek' },
    { id: 82, name: 'Simone Consonni', team: 'Lidl - Trek' },
    { id: 83, name: 'Thibau Nys', team: 'Lidl - Trek' },
    { id: 84, name: 'Bauke Mollema', team: 'Lidl - Trek' },
    { id: 85, name: 'Mattias Skjelmose', team: 'Lidl - Trek' },
    { id: 86, name: 'Toms Skujiņš', team: 'Lidl - Trek' },
    { id: 87, name: 'Jasper Stuyven', team: 'Lidl - Trek' },
    { id: 88, name: 'Edward Theuns', team: 'Lidl - Trek' },
    // Groupama - FDJ
    { id: 91, name: 'Guillaume Martin', team: 'Groupama - FDJ' },
    { id: 92, name: 'Lewis Askey', team: 'Groupama - FDJ' },
    { id: 93, name: 'Cyril Barthe', team: 'Groupama - FDJ' },
    { id: 94, name: 'Valentin Madouas', team: 'Groupama - FDJ' },
    { id: 95, name: 'Quentin Pacher', team: 'Groupama - FDJ' },
    { id: 96, name: 'Paul Penhoët', team: 'Groupama - FDJ' },
    { id: 97, name: 'Clément Russo', team: 'Groupama - FDJ' },
    // Alpecin - Deceuninck
    { id: 101, name: 'Jasper Philipsen', team: 'Alpecin - Deceuninck' },
    { id: 102, name: 'Silvan Dillier', team: 'Alpecin - Deceuninck' },
    { id: 103, name: 'Kaden Groves', team: 'Alpecin - Deceuninck' },
    { id: 104, name: 'Xandro Meurisse', team: 'Alpecin - Deceuninck' },
    { id: 105, name: 'Jonas Rickaert', team: 'Alpecin - Deceuninck' },
    { id: 106, name: 'Mathieu van der Poel', team: 'Alpecin - Deceuninck' },
    { id: 107, name: 'Gianni Vermeersch', team: 'Alpecin - Deceuninck' },
    { id: 108, name: 'Emiel Verstrynge', team: 'Alpecin - Deceuninck' },
    // Tudor Pro Cycling Team
    { id: 111, name: 'Julian Alaphilippe', team: 'Tudor Pro Cycling Team' },
    { id: 112, name: 'Alberto Dainese', team: 'Tudor Pro Cycling Team' },
    { id: 113, name: 'Marco Haller', team: 'Tudor Pro Cycling Team' },
    { id: 114, name: 'Marc Hirschi', team: 'Tudor Pro Cycling Team' },
    { id: 115, name: 'Fabian Lienhard', team: 'Tudor Pro Cycling Team' },
    { id: 116, name: 'Marius Mayrhofer', team: 'Tudor Pro Cycling Team' },
    { id: 117, name: 'Michael Storer', team: 'Tudor Pro Cycling Team' },
    { id: 118, name: 'Matteo Trentin', team: 'Tudor Pro Cycling Team' },
    // Team Jayco AlUla
    { id: 121, name: 'Ben O\'Connor', team: 'Team Jayco AlUla' },
    { id: 122, name: 'Eddie Dunbar', team: 'Team Jayco AlUla' },
    { id: 123, name: 'Luke Durbridge', team: 'Team Jayco AlUla' },
    { id: 124, name: 'Dylan Groenewegen', team: 'Team Jayco AlUla' },
    { id: 125, name: 'Luka Mezgec', team: 'Team Jayco AlUla' },
    { id: 126, name: 'Luke Plapp', team: 'Team Jayco AlUla' },
    { id: 127, name: 'Elmar Reinders', team: 'Team Jayco AlUla' },
    { id: 128, name: 'Mauro Schmid', team: 'Team Jayco AlUla' },
    // Arkéa - B&B Hotels
    { id: 131, name: 'Kévin Vauquelin', team: 'Arkéa - B&B Hotels' },
    { id: 132, name: 'Amaury Capiot', team: 'Arkéa - B&B Hotels' },
    { id: 133, name: 'Ewen Costiou', team: 'Arkéa - B&B Hotels' },
    { id: 134, name: 'Arnaud Démare', team: 'Arkéa - B&B Hotels' },
    { id: 135, name: 'Raúl García Pierna', team: 'Arkéa - B&B Hotels' },
    { id: 136, name: 'Mathis Le Berre', team: 'Arkéa - B&B Hotels' },
    { id: 137, name: 'Cristián Rodríguez', team: 'Arkéa - B&B Hotels' },
    { id: 138, name: 'Clément Venturini', team: 'Arkéa - B&B Hotels' },
    // Movistar Team
    { id: 141, name: 'Enric Mas', team: 'Movistar Team' },
    { id: 142, name: 'Will Barta', team: 'Movistar Team' },
    { id: 143, name: 'Pablo Castrillo', team: 'Movistar Team' },
    { id: 144, name: 'Nelson Oliveira', team: 'Movistar Team' },
    { id: 145, name: 'Iván García Cortina', team: 'Movistar Team' },
    { id: 146, name: 'Gregor Mühlberger', team: 'Movistar Team' },
    { id: 147, name: 'Iván Romeo', team: 'Movistar Team' },
    { id: 148, name: 'Einer Rubio', team: 'Movistar Team' },
    // Decathlon AG2R La Mondiale
    { id: 151, name: 'Felix Gall', team: 'Decathlon AG2R La Mondiale' },
    { id: 152, name: 'Bruno Armirail', team: 'Decathlon AG2R La Mondiale' },
    { id: 153, name: 'Clément Berthet', team: 'Decathlon AG2R La Mondiale' },
    { id: 154, name: 'Oliver Naesen', team: 'Decathlon AG2R La Mondiale' },
    { id: 155, name: 'Aurélien Paret-Peintre', team: 'Decathlon AG2R La Mondiale' },
    { id: 156, name: 'Callum Scotson', team: 'Decathlon AG2R La Mondiale' },
    { id: 157, name: 'Bastien Tronchon', team: 'Decathlon AG2R La Mondiale' },
    // Cofidis
    { id: 161, name: 'Emanuel Buchmann', team: 'Cofidis' },
    { id: 162, name: 'Alex Aranburu', team: 'Cofidis' },
    { id: 163, name: 'Bryan Coquard', team: 'Cofidis' },
    { id: 164, name: 'Ion Izagirre', team: 'Cofidis' },
    { id: 165, name: 'Alexis Renard', team: 'Cofidis' },
    { id: 166, name: 'Dylan Teuns', team: 'Cofidis' },
    { id: 167, name: 'Benjamin Thomas', team: 'Cofidis' },
    { id: 168, name: 'Damien Touzé', team: 'Cofidis' },
    // XDS Astana Team
    { id: 171, name: 'Harold Tejada', team: 'XDS Astana Team' },
    { id: 172, name: 'Davide Ballerini', team: 'XDS Astana Team' },
    { id: 173, name: 'Cees Bol', team: 'XDS Astana Team' },
    { id: 174, name: 'Clément Champoussin', team: 'XDS Astana Team' },
    { id: 175, name: 'Yevgeniy Fedorov', team: 'XDS Astana Team' },
    { id: 176, name: 'Sergio Higuita', team: 'XDS Astana Team' },
    { id: 177, name: 'Mike Teunissen', team: 'XDS Astana Team' },
    { id: 178, name: 'Simone Velasco', team: 'XDS Astana Team' },
    // TotalEnergies
    { id: 181, name: 'Steff Cras', team: 'TotalEnergies' },
    { id: 182, name: 'Mathieu Burgaudeau', team: 'TotalEnergies' },
    { id: 183, name: 'Alexandre Delettre', team: 'TotalEnergies' },
    { id: 184, name: 'Rayan Boulahoite', team: 'TotalEnergies' },
    { id: 185, name: 'Emilien Jeannière', team: 'TotalEnergies' },
    { id: 186, name: 'Jordan Jegat', team: 'TotalEnergies' },
    { id: 187, name: 'Anthony Turgis', team: 'TotalEnergies' },
    { id: 188, name: 'Mattéo Vercher', team: 'TotalEnergies' },
    // Team Picnic PostNL
    { id: 191, name: 'Oscar Onley', team: 'Team Picnic PostNL' },
    { id: 192, name: 'Warren Barguil', team: 'Team Picnic PostNL' },
    { id: 193, name: 'Pavel Bittner', team: 'Team Picnic PostNL' },
    { id: 194, name: 'Max Poole', team: 'Team Picnic PostNL' },
    { id: 195, name: 'Tobias Lund Andresen', team: 'Team Picnic PostNL' },
    { id: 196, name: 'Niklas Märkl', team: 'Team Picnic PostNL' },
    { id: 197, name: 'Tim Naberman', team: 'Team Picnic PostNL' },
    { id: 198, name: 'Frank van den Broek', team: 'Team Picnic PostNL' },
    // Israel - Premier Tech
    { id: 201, name: 'Michael Woods', team: 'Israel - Premier Tech' },
    { id: 202, name: 'Pascal Ackermann', team: 'Israel - Premier Tech' },
    { id: 203, name: 'Joseph Blackmore', team: 'Israel - Premier Tech' },
    { id: 204, name: 'Ethan Vernon', team: 'Israel - Premier Tech' },
    { id: 205, name: 'Matis Louvel', team: 'Israel - Premier Tech' },
    { id: 206, name: 'Alexey Lutsenko', team: 'Israel - Premier Tech' },
    { id: 207, name: 'Krists Neilands', team: 'Israel - Premier Tech' },
    { id: 208, name: 'Jake Stewart', team: 'Israel - Premier Tech' },
    // Lotto
    { id: 211, name: 'Arnaud de Lie', team: 'Lotto' },
    { id: 212, name: 'Jenno Berckmoes', team: 'Lotto' },
    { id: 213, name: 'Jarrad Drizners', team: 'Lotto' },
    { id: 214, name: 'Sébastien Grignard', team: 'Lotto' },
    { id: 215, name: 'Eduardo Sepúlveda', team: 'Lotto' },
    { id: 216, name: 'Lennert van Eetvelt', team: 'Lotto' },
    { id: 217, name: 'Brent van Moer', team: 'Lotto' },
    // Uno-X Mobility
    { id: 221, name: 'Tobias Halland Johannessen', team: 'Uno-X Mobility' },
    { id: 222, name: 'Jonas Abrahamsen', team: 'Uno-X Mobility' },
    { id: 223, name: 'Magnus Cort Nielsen', team: 'Uno-X Mobility' },
    { id: 224, name: 'Johannes Kulset', team: 'Uno-X Mobility' },
    { id: 225, name: 'Markus Hoelgaard', team: 'Uno-X Mobility' },
    { id: 226, name: 'Anders Halland Johannessen', team: 'Uno-X Mobility' },
    { id: 227, name: 'Andreas Leknessund', team: 'Uno-X Mobility' },
    { id: 228, name: 'Søren Wærenskjold', team: 'Uno-X Mobility' },
];

const JERSEY_TYPES = ['yellow', 'polka_dots', 'green', 'team'];
const POINTS_CONFIG = { jerseys: 20 }; // Configurable

export default function TourPoolApp() {
    const [currentView, setCurrentView] = useState('home'); // home, submit, admin, standings
    const [participants, setParticipants] = useState([]);
    const [dailyResults, setDailyResults] = useState([]);
    const [adminPassword, setAdminPassword] = useState('');
    const [isAdminAuthed, setIsAdminAuthed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        riders: Array(10).fill(''),
        yellow_jersey: '',
        polka_dots_jersey: '',
        green_jersey: '',
        team_classification: '',
    });

    const [currentStage, setCurrentStage] = useState(1);
    const [stageResults, setStageResults] = useState({
        stage: 1,
        top_10_riders: Array(10).fill(''),
        yellow_jersey: '',
        polka_dots_jersey: '',
        green_jersey: '',
        team_classification: '',
    });

    // Initialize data from Supabase
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [partsRes, resultsRes] = await Promise.all([
                supabase.from('participants').select('*'),
                supabase.from('daily_results').select('*'),
            ]);
            if (partsRes.data) setParticipants(partsRes.data);
            if (resultsRes.data) setDailyResults(resultsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleAdminLogin = (password) => {
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
            setIsAdminAuthed(true);
            setAdminPassword('');
        } else {
            alert('Incorrect password');
        }
    };

    const handleSubmitForm = async () => {
        if (!formData.name.trim()) {
            alert('Please enter your name');
            return;
        }
        if (formData.riders.filter(r => r).length !== 10) {
            alert('Please select exactly 10 riders');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('participants').insert([
                {
                    name: formData.name,
                    riders: formData.riders,
                    yellow_jersey: formData.yellow_jersey,
                    polka_dots_jersey: formData.polka_dots_jersey,
                    green_jersey: formData.green_jersey,
                    team_classification: formData.team_classification,
                    created_at: new Date(),
                },
            ]);

            if (error) throw error;
            alert('Submission successful!');
            setFormData({
                name: '',
                riders: Array(10).fill(''),
                yellow_jersey: '',
                polka_dots_jersey: '',
                green_jersey: '',
                team_classification: '',
            });
            await loadData();
        } catch (error) {
            alert('Error submitting form: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStageResult = async () => {
        if (stageResults.top_10_riders.filter(r => r).length !== 10) {
            alert('Please select exactly 10 riders for top 10');
            return;
        }

        setLoading(true);
        try {
            // Check if already exists
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

            alert('Stage results saved!');
            setStageResults({
                stage: stageResults.stage + 1,
                top_10_riders: Array(10).fill(''),
                yellow_jersey: '',
                polka_dots_jersey: '',
                green_jersey: '',
                team_classification: '',
            });
            await loadData();
        } catch (error) {
            alert('Error saving results: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateStandings = () => {
        if (participants.length === 0 || dailyResults.length === 0) return [];

        return participants.map(participant => {
            let totalPoints = 0;

            // Calculate points from stages
            dailyResults.forEach(stage => {
                // Points from top 10
                stage.top_10_riders.forEach((riderId, index) => {
                    if (participant.riders.includes(riderId)) {
                        totalPoints += 10 - index; // 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
                    }
                });

                // Points from jerseys
                if (participant.yellow_jersey === stage.yellow_jersey) totalPoints += POINTS_CONFIG.jerseys;
                if (participant.polka_dots_jersey === stage.polka_dots_jersey) totalPoints += POINTS_CONFIG.jerseys;
                if (participant.green_jersey === stage.green_jersey) totalPoints += POINTS_CONFIG.jerseys;
                if (participant.team_classification === stage.team_classification) totalPoints += POINTS_CONFIG.jerseys;
            });

            return { ...participant, totalPoints };
        }).sort((a, b) => b.totalPoints - a.totalPoints);
    };

    const exportPDF = () => {
        const standings = calculateStandings();
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Tour de France Pool - Standings', 14, 22);

        doc.setFontSize(10);
        doc.text(`Updated: ${new Date().toLocaleString()}`, 14, 30);

        const columns = ['Position', 'Name', 'Points'];
        const data = standings.map((p, i) => [i + 1, p.name, p.totalPoints]);

        doc.autoTable({
            head: [columns],
            body: data,
            startY: 40,
            headStyles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        doc.save(`tour-pool-standings-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // RiderSelect Component
    const RiderSelect = ({ value, onChange, label }) => {
        const [search, setSearch] = useState('');
        const [open, setOpen] = useState(false);

        const filtered = RIDERS_2025.filter(r =>
            r.name.toLowerCase().includes(search.toLowerCase()) &&
            !value // Don't show if already selected
        );

        return (
            <div style={{ marginBottom: '10px' }}>
                <label>{label}</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 100)}
                    placeholder="Search rider..."
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginTop: '4px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
                {open && filtered.length > 0 && (
                    <div style={{
                        border: '1px solid #ccc',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        position: 'absolute',
                        width: '100%',
                        zIndex: 10,
                        backgroundColor: '#fff',
                    }}>
                        {filtered.map(rider => (
                            <div
                                key={rider.id}
                                onClick={() => {
                                    onChange(rider.id);
                                    setSearch('');
                                    setOpen(false);
                                }}
                                style={{
                                    padding: '8px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: search && rider.name.toLowerCase().includes(search.toLowerCase()) ? '#f0f0f0' : '#fff',
                                }}
                            >
                                {rider.name} ({rider.team})
                            </div>
                        ))}
                    </div>
                )}
                {value && <div style={{ marginTop: '4px', color: '#666' }}>✓ Selected</div>}
            </div>
        );
    };

    // Home view
    if (currentView === 'home') {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%)',
                padding: '20px',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            }}>
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}>
                    <h1 style={{ fontSize: '40px', marginBottom: '10px', color: '#FFD700' }}>🚴 TOUR POULE</h1>
                    <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
                        Family Fantasy League - Tour de France 2025
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={() => setCurrentView('submit')}
                            style={{
                                padding: '16px',
                                fontSize: '16px',
                                backgroundColor: '#FFD700',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                color: '#000',
                                transition: 'all 0.3s',
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#FFC700'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
                        >
                            📝 Submit Your Top 10
                        </button>

                        <button
                            onClick={() => setCurrentView('standings')}
                            style={{
                                padding: '16px',
                                fontSize: '16px',
                                backgroundColor: '#FF6B6B',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                color: '#fff',
                            }}
                        >
                            🏆 View Standings
                        </button>

                        <button
                            onClick={() => setCurrentView('admin')}
                            style={{
                                padding: '16px',
                                fontSize: '16px',
                                backgroundColor: '#333',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                color: '#fff',
                            }}
                        >
                            ⚙️ Admin Panel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Submit form view
    if (currentView === 'submit') {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: '"Segoe UI"' }}>
                <button onClick={() => setCurrentView('home')} style={{ marginBottom: '20px', padding: '10px 20px' }}>
                    ← Back
                </button>
                <h2>Submit Your Top 10 Riders</h2>

                <div style={{ marginBottom: '20px' }}>
                    <label>Your Name:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3>Your Top 10 Riders (in order of preference)</h3>
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
                    <h3>Jersey & Team Predictions</h3>
                    <RiderSelect
                        value={formData.yellow_jersey}
                        onChange={(id) => setFormData({ ...formData, yellow_jersey: id })}
                        label="Yellow Jersey (GC)"
                    />
                    <RiderSelect
                        value={formData.polka_dots_jersey}
                        onChange={(id) => setFormData({ ...formData, polka_dots_jersey: id })}
                        label="Polka Dots Jersey (Mountains)"
                    />
                    <RiderSelect
                        value={formData.green_jersey}
                        onChange={(id) => setFormData({ ...formData, green_jersey: id })}
                        label="Green Jersey (Sprint)"
                    />
                    <div style={{ marginTop: '10px' }}>
                        <label>Team Classification:</label>
                        <input
                            type="text"
                            value={formData.team_classification}
                            onChange={(e) => setFormData({ ...formData, team_classification: e.target.value })}
                            placeholder="Enter team name"
                            style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmitForm}
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
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        );
    }

    // Standings view
    if (currentView === 'standings') {
        const standings = calculateStandings();
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: '"Segoe UI"' }}>
                <button onClick={() => setCurrentView('home')} style={{ marginBottom: '20px', padding: '10px 20px' }}>
                    ← Back
                </button>
                <h2>📊 Current Standings</h2>

                {standings.length === 0 ? (
                    <p>No data yet</p>
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
                                <th style={{ padding: '12px', textAlign: 'left' }}>Position</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {standings.map((p, i) => (
                                <tr key={i} style={{
                                    backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#fff',
                                    borderBottom: '1px solid #eee',
                                }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '18px' }}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                    </td>
                                    <td style={{ padding: '12px' }}>{p.name}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{p.totalPoints}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <button
                            onClick={exportPDF}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#FF6B6B',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            📥 Export as PDF
                        </button>
                    </>
                )}
            </div>
        );
    }

    // Admin panel
    if (currentView === 'admin') {
        if (!isAdminAuthed) {
            return (
                <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
                    <button onClick={() => setCurrentView('home')} style={{ marginBottom: '20px' }}>
                        ← Back
                    </button>
                    <h2>Admin Login</h2>
                    <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter admin password"
                        style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button
                        onClick={() => handleAdminLogin(adminPassword)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#333',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Login
                    </button>
                </div>
            );
        }

        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: '"Segoe UI"' }}>
                <button onClick={() => { setCurrentView('home'); setIsAdminAuthed(false); }} style={{ marginBottom: '20px', padding: '10px 20px' }}>
                    ← Logout
                </button>
                <h2>⚙️ Admin - Add Stage Results</h2>

                <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Stage:</label>
                        <input
                            type="number"
                            value={stageResults.stage}
                            onChange={(e) => setStageResults({ ...stageResults, stage: parseInt(e.target.value) })}
                            style={{ width: '100px', padding: '8px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <h3>Top 10 Riders</h3>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                        <RiderSelect
                            key={i}
                            value={stageResults.top_10_riders[i]}
                            onChange={(riderId) => {
                                const newTop10 = [...stageResults.top_10_riders];
                                newTop10[i] = riderId;
                                setStageResults({ ...stageResults, top_10_riders: newTop10 });
                            }}
                            label={`Position ${i + 1}`}
                        />
                    ))}

                    <h3 style={{ marginTop: '20px' }}>Daily Jersey Winners</h3>
                    <RiderSelect
                        value={stageResults.yellow_jersey}
                        onChange={(id) => setStageResults({ ...stageResults, yellow_jersey: id })}
                        label="Yellow Jersey Wearer"
                    />
                    <RiderSelect
                        value={stageResults.polka_dots_jersey}
                        onChange={(id) => setStageResults({ ...stageResults, polka_dots_jersey: id })}
                        label="Polka Dots Jersey Wearer"
                    />
                    <RiderSelect
                        value={stageResults.green_jersey}
                        onChange={(id) => setStageResults({ ...stageResults, green_jersey: id })}
                        label="Green Jersey Wearer"
                    />
                    <div style={{ marginTop: '10px' }}>
                        <label>Leading Team:</label>
                        <input
                            type="text"
                            value={stageResults.team_classification}
                            onChange={(e) => setStageResults({ ...stageResults, team_classification: e.target.value })}
                            placeholder="Enter team name"
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
                            backgroundColor: '#333',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        {loading ? 'Saving...' : 'Save Stage Results'}
                    </button>
                </div>
            </div>
        );
    }
}
