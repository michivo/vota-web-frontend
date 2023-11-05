export interface Candidate {
    id: number,
    name: string,
    gender: 'male' | 'female' | 'diverse',
}

export interface CandidateList {
    id: number,
    name: string,
    items: Candidate[],
    title: string,
}
