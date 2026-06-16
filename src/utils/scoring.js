import { RIDERS_2025 } from '../data/2026/riders';
import { TEAMS_2025 } from '../data/2026/teams';

// Configuratie - eenvoudig aan te passen
export const POINTS_CONFIG = {
    top10: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], // Punten per positie in de etappe-top 10
    yellowJersey: 20,
    polkaDotsJersey: 20,
    greenJersey: 20,
    teamClassification: 20,
};

// De laatste etappe waarop het eindklassement (en dus de truien) telt
export const FINAL_STAGE = 21;

/**
 * Punten voor één renner in de etappe-top 10
 */
export const calculateRiderDailyPoints = (riderId, stageRiders) => {
    const position = stageRiders.indexOf(riderId);
    if (position === -1) return 0;
    return POINTS_CONFIG.top10[position];
};

/**
 * Totaal aantal punten uit alle top 10-noteringen (per etappe, dagelijks)
 */
export const calculateRiderTopTenPoints = (participantRiders, dailyResults) => {
    let points = 0;
    dailyResults.forEach(stage => {
        participantRiders.forEach(riderId => {
            points += calculateRiderDailyPoints(riderId, stage.top_10_riders || []);
        });
    });
    return points;
};

/**
 * Punten die één deelnemer in één specifieke etappe scoorde
 * (alleen top 10-punten; truien tellen pas bij de einduitslag).
 */
export const calculateStagePoints = (participantRiders, stage) => {
    let points = 0;
    (participantRiders || []).forEach(riderId => {
        points += calculateRiderDailyPoints(riderId, stage.top_10_riders || []);
    });
    return points;
};

/**
 * Lijst met punten per etappe voor één deelnemer, gesorteerd op etappenummer.
 * Geeft terug: [{ stage, points }, ...]
 */
export const calculateStageBreakdown = (participantRiders, dailyResults) => {
    return [...dailyResults]
        .sort((a, b) => a.stage - b.stage)
        .map(stage => ({
            stage: stage.stage,
            points: calculateStagePoints(participantRiders, stage),
        }));
};

/**
 * Trui- en teampunten: tellen ALLEEN mee als de laatste etappe is ingevoerd,
 * en dan op basis van de truidragers/leidend team van die laatste etappe
 * (= het eindklassement).
 */
export const calculateJerseyPoints = (predictions, dailyResults) => {
    const finalStage = dailyResults.find(s => s.stage === FINAL_STAGE);
    if (!finalStage) return 0; // Tour nog niet afgelopen → nog geen truipunten

    let points = 0;
    if (predictions.yellow_jersey === finalStage.yellow_jersey) {
        points += POINTS_CONFIG.yellowJersey;
    }
    if (predictions.polka_dots_jersey === finalStage.polka_dots_jersey) {
        points += POINTS_CONFIG.polkaDotsJersey;
    }
    if (predictions.green_jersey === finalStage.green_jersey) {
        points += POINTS_CONFIG.greenJersey;
    }
    if (predictions.team_classification === finalStage.team_classification) {
        points += POINTS_CONFIG.teamClassification;
    }
    return points;
};

/**
 * Totaal aantal punten voor één deelnemer
 */
export const calculateParticipantPoints = (participant, dailyResults) => {
    if (!dailyResults || dailyResults.length === 0) return 0;
    const topTenPoints = calculateRiderTopTenPoints(participant.riders || [], dailyResults);
    const jerseyPoints = calculateJerseyPoints(participant, dailyResults);
    return topTenPoints + jerseyPoints;
};

/**
 * Alle standen berekenen (gesorteerd op punten)
 */
export const calculateStandings = (participants, dailyResults) => {
    if (!participants || participants.length === 0) return [];

    return participants
        .map(participant => ({
            ...participant,
            topTenPoints: calculateRiderTopTenPoints(participant.riders || [], dailyResults),
            jerseyPoints: calculateJerseyPoints(participant, dailyResults),
            totalPoints: calculateParticipantPoints(participant, dailyResults),
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);
};

/**
 * Is de Tour afgelopen (laatste etappe ingevoerd)?
 */
export const isTourFinished = (dailyResults) =>
    dailyResults.some(s => s.stage === FINAL_STAGE);

/**
 * Renner-info ophalen (naam + team)
 */
export const getRiderInfo = (riderId) => {
    const rider = RIDERS_2025.find(r => r.id === riderId);
    if (!rider) return null;
    const team = TEAMS_2025.find(t => t.id === rider.teamId);
    return { rider, team };
};

/**
 * Team-info ophalen op id
 */
export const getTeamInfo = (teamId) => {
    return TEAMS_2025.find(t => t.id === teamId);
};

/**
 * Scoringsconfiguratie aanpassen
 */
export const updatePointsConfig = (newConfig) => {
    Object.assign(POINTS_CONFIG, newConfig);
};