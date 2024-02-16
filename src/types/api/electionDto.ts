export enum ElectionState {
    None = 0,
    Creating = 1,
    Counting = 2,
    CountingComplete = 3,
    Done = 4,
    ResultsOfficial = 5,
};

export enum ElectionType {
    None = 0,
    OrderedSingleTransferableVote = 1,
    UnorderedSingleTransferableVote = 2,
};

export interface ElectionDto {
    id: number,
    title: string,
    description: string | undefined | null,
    createUserId: number,
    dateCreated: Date,
    enforceGenderParity: boolean,
    electionType: ElectionType,
    electionState: ElectionState,
    alreadyElectedMale: number,
    alreadyElectedFemale: number,
    numberOfPositionsToElect: number,
};

export interface ElectionWithCandidatesDto extends ElectionDto {
    candidates: CandidateDto[],
};

export interface CandidateDto {
    id: number,
    ballotOrder: number,
    name: string,
    description: string | null | undefined,
    gender: Gender,
    electionId: number;
};

export enum Gender {
    None = 0,
    Female = 1,
    Male = 2,
    Other = 3,
}
