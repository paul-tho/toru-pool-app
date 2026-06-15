import { RIDERS_2025 } from '../data/riders';
import { TEAMS_2025 } from '../data/teams';

// Configuration - easy to change
export const POINTS_CONFIG = {
    top10: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], // Points per position
    yellowJersey: 20,
    polkaDotsJersey: 20,
    greenJersey: 20,
    teamClassification: 20,
};

/**
 * Calculate points for a rider in daily top 10
 */
export const calculateRiderDailyPoints = (riderId, stageRiders) => {
    const position = stageRiders.indexOf(riderId);
    if (position === -1) return 0; // Not in top 10
    return POINTS_CONFIG.top10[position];
};

/**
 * Calculate total points from all top 10 finishes
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
 * Calculate jersey prediction points
 */
export const calculateJerseyPoints = (predictions, dailyResults) => {
    let points = 0;

    dailyResults.forEach(stage => {
        if (predictions.yellow_jersey === stage.yellow_jersey) {
            points += POINTS_CONFIG.yellowJersey;
        }
        if (predictions.polka_dots_jersey === stage.polka_dots_jersey) {
            points += POINTS_CONFIG.polkaDotsJersey;
        }
        if (predictions.green_jersey === stage.green_jersey) {
            points += POINTS_CONFIG.greenJersey;
        }
        if (predictions.team_classification === stage.team_classification) {
            points += POINTS_CONFIG.teamClassification;
        }
    });

    return points;
};

/**
 * Calculate total points for one participant
 */
export const calculateParticipantPoints = (participant, dailyResults) => {
    if (!dailyResults || dailyResults.length === 0) return 0;

    const topTenPoints = calculateRiderTopTenPoints(
        participant.riders || [],
        dailyResults
    );

    const jerseyPoints = calculateJerseyPoints(participant, dailyResults);

    return topTenPoints + jerseyPoints;
};

/**
 * Calculate all standings (sorted by points)
 */
export const calculateStandings = (participants, dailyResults) => {
    if (!participants || participants.length === 0) return [];

    return participants
        .map(participant => ({
            ...participant,
            topTenPoints: calculateRiderTopTenPoints(
                participant.riders || [],
                dailyResults
            ),
            jerseyPoints: calculateJerseyPoints(participant, dailyResults),
            totalPoints: calculateParticipantPoints(participant, dailyResults),
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);
};

/**
 * Get rider info (name + team)
 */
export const getRiderInfo = (riderId) => {
    const rider = RIDERS_2025.find(r => r.id === riderId);
    if (!rider) return null;
    const team = TEAMS_2025.find(t => t.id === rider.teamId);
    return { rider, team };
};

/**
 * Get team info by ID
 */
export const getTeamInfo = (teamId) => {
    return TEAMS_2025.find(t => t.id === teamId);
};

/**
 * Update scoring configuration
 */
export const updatePointsConfig = (newConfig) => {
    Object.assign(POINTS_CONFIG, newConfig);
};