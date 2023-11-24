import type { BallotWithVotesDto } from '../types/api/ballotDto';
import { getBaseUrl } from './settingsProvider';
import { getAuthHeader } from './utils';

export class BallotApi {
    public async addBallot(ballot: BallotWithVotesDto): Promise<void> {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/ballots`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(ballot),
        });
    }
}