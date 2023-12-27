import type { ElectionState } from "./electionDto";

export interface VotingResultsDto {
    electionTitle: string,
    electionState: ElectionState,
    results: VotingResultDto[],
}

export enum VotingResultStatus {
    Valid = 0,
    TestRun = 1,
    Overridden = 2,
}

export interface VotingResultDto {
    id: number,
    electionId: number,
    userId: number,
    resultStatus: VotingResultStatus,
    dateCreatedUtc: Date,
    success: boolean,
    errorLog: string,
    detailedLog: string,
    protocol: VotaProtocol,
    protocolFormatVersion: number,
    voterListCsv: string,
    votesCsv: string,
    statsData: string,
    username: string,
    overrideReason: string | undefined,
    overrideUser: string | undefined,
    overrideDateUtc: Date,
}

export interface VotaProtocol {
    Title: string,
    Messages: Array<string | VotaProtocol>,
    Result: Array<string>,
}