export function getCurrentHtmlPageName() {
    let splitUrl = window.location.href.split('/');
    let parsedPage = splitUrl[splitUrl.length - 1].split('.');
    return parsedPage[0];
}

export function getCurrentDomainHost() {
    return window.location.host;
}

export function getQueryStringParams(): Map<string, string> {
    let rawString: string = window.location.href.split('?')[1];
    let queryStringParams: string[] = rawString.split('&');

    let queryStringMap = new Map<string, string>();

    queryStringParams.forEach((queryString) => {
        let splitKeyValue = queryString.split('=');
        queryStringMap.set(splitKeyValue[0], splitKeyValue[1]);
    })

    return queryStringMap;
}