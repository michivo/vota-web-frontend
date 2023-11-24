import type { CandidateDto } from "./api/electionDto";

export interface CandidateList {
    id: number,
    name: string,
    items: CandidateDto[],
    title: string,
}
