import type { ElectionDto } from "../types/api/electionDto";
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
        for(const item of responseData) {
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
}
