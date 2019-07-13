export function searchCartoon(title: string | null = null, characters: string[] = [], start_at: string | null = null, end_at: string | null = null, limit: number | null = null, offset: number | null = null): Promise<any> {
    const url = new URL("https://zaubermaerchen.info/imas_sc/api/cartoon/search/");
    if(title != null) {
        url.searchParams.append("title", title);
    }
    for(let i = 0; i < characters.length; i++) {
        url.searchParams.append("character", characters[i]);
    }
    if(start_at != null) {
        url.searchParams.append("start_at", start_at);
    }
    if(end_at != null) {
        url.searchParams.append("end_at", end_at);
    }
    if (limit != null) {
        url.searchParams.append("limit", limit.toString());
    }
    if (offset != null) {
        url.searchParams.append("offset", offset.toString());
    }

    return fetch(url.href, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        mode: "cors",
        credentials: "omit"
    }).then((response: Response) => {
        return response.json();
    });
}

export function getCharacterNameList(): Promise<any> {
    const url = new URL("https://www.zaubermaerchen.info/imas_sc/api/character/names/");

    return fetch(url.href, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        mode: "cors",
        credentials: "omit"
    }).then((response: Response) => {
        return response.json();
    });
}