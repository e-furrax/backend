import axios, { AxiosResponse } from 'axios';

const csGoApiKey = '9c2da57a-f1cf-4e0b-be3d-6e6971b1c92a';
const riotApiKey = 'RGAPI-b0d24bde-c7c8-4e5c-b574-6edf72741ded';

function errorCheck(error: any) {
    switch (error.response.status) {
        case 401:
            throw new Error('API Key invalid');
        case 451:
            throw new Error('Invalid parameters supplied');
        case 404:
            throw new Error('Username provided is non-existent on tracker.gg');
        case 429:
            throw new Error('You have hit a rate-limit, slow down');
        case 503:
            throw new Error(
                'The request has been stopped, tracker.gg is either down for maitnance or overloaded'
            );
        case 400:
            throw new Error(
                'Bad request, you are probably not supplying a correct username or ID'
            );
    }
}

/**
 * @param {string} identifier The SteamID64 of the user you are looking up stats for
 */
export async function getCSGOPlayerStats(identifier: string) {
    if (!/(?<STEAMID64>[^/][0-9]{8,})/.test(identifier)) {
        throw new Error('Not a valid Steam64ID');
    }

    const response: AxiosResponse<any> | void = await axios
        .get(
            `https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${identifier}`,
            {
                headers: { 'TRN-Api-Key': csGoApiKey },
            }
        )
        .catch((err) => {
            return errorCheck(err);
        });

    const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: {
            data: { segments },
        },
    } = response;
    return {
        data: {
            segments,
        },
    };
    // ajustement a faire pour traiter le json ici quand les url seront en place(optimisation avec l'ajout en db
}

/**
 * @param {string} name The Summoner Name of the user you are looking up id for
 */
export async function getRiotPlayerId(name: string) {
    const summonersInfo: AxiosResponse<any> | void = await axios
        .get(
            `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`,
            {
                headers: {
                    'X-Riot-Token': riotApiKey,
                },
            }
        )
        .catch((err) => {
            return errorCheck(err);
        });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return summonersInfo.data.id;
}

/**
 * @param {string} id The RiotId of the user you are looking up stats for, got by • getRiotPlayerId()
 */
export async function getRiotPlayerStats(id: string) {
    const summonersInfo: AxiosResponse<any> | void = await axios
        .get(
            `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
            {
                headers: { 'X-Riot-Token': riotApiKey },
            }
        )
        .catch((err) => {
            return errorCheck(err);
        });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return summonersInfo.data;
}
