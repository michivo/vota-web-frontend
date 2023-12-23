import { buildApiError } from '../types/api/apiError';
import type { BallotWithVotesDto } from '../types/api/ballotDto';
import { getBaseUrl } from './settingsProvider';
import { getAuthHeader } from './utils';

export class BallotApi {
    public async addBallot(ballot: BallotWithVotesDto): Promise<void> {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/v1/ballots`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(ballot),
        });

        if(!response.ok) {
            const error = await buildApiError(response, 'beim Hinzufügen der Stimme');
            throw error;
        }
    }

    public async getAllBallots(electionId: number): Promise<BallotWithVotesDto[]> {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/v1/ballots/${electionId}`, {
            method: 'GET',
            headers: getAuthHeader(),
        });

        const responseData = (await response.json()) as BallotWithVotesDto[];
        for(const info of responseData) {
            if(info.dateCreated) {
                info.dateCreated = new Date(info.dateCreated);
            }
            if(info.dateDeleted) {
                info.dateDeleted = new Date(info.dateDeleted);
            }
        }
        return responseData;
    }

    public async deleteBallot(ballotId: number, electionId: number, reason: string): Promise<void> {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/v1/ballots/deleteRequests`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({
                ballotId,
                electionId,
                deleteReason: reason,
            }),
        });

        if(!response.ok) {
            const error = await buildApiError(response, 'beim Löschen der Stimme');
            throw error;
        }
    }
}