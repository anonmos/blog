export function performGet(url: string) {
    let request = new XMLHttpRequest();
    request.open('GET', url);
}