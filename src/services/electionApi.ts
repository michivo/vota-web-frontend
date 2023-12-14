import type { ElectionDto, ElectionWithCandidatesDto } from "../types/api/electionDto";
import { getBaseUrl } from "./settingsProvider";
import { getAuthHeader } from "./utils";

export class ElectionApi {
    public async getAll(): Promise<ElectionDto[]> {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/v1/elections`, {
            method: 'GET',
            headers: getAuthHeader(),
        });

        const responseData = await response.json();
        for (const item of responseData) {
            item.dateCreated = new Date(item.dateCreated);
        }
        return responseData as ElectionDto[];
    }

    public async createElection(election: ElectionDto): Promise<void> {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/elections`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(election),
        });
    }

    public async getElectionWithCandidates(electionId: number): Promise<ElectionWithCandidatesDto> {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/v1/elections/${electionId}`, {
            method: 'GET',
            headers: getAuthHeader(),
        });

        const responseData = await response.json();
        responseData.dateCreated = new Date(responseData.dateCreated);
        return responseData as ElectionWithCandidatesDto;
    }

    public async deleteElection(id: number) {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/elections/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });
    }

    public async updateElection(election: ElectionDto) {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/elections/${election.id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(election),
        });
    }

    public async countVotes(election: ElectionDto) {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/elections/${election.id}/countRequests`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ isTestRun: true }),
        });
    }

}
