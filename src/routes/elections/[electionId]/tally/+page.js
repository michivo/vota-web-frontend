/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        electionId: parseInt(params.electionId),
    };
}