export function getCurrentHtmlPageName() {
    let splitUrl = window.location.href.split('/');
    let parsedPage = splitUrl[splitUrl.length - 1].split('.');
    return parsedPage[0];
}

export function getCurrentDomainHost() {
    return window.location.host;
}