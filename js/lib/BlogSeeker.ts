import {getCurrentDomainHost} from "./URLHelper";

export interface BlogPostMeta {
    filename: string,
    title: string,
    short: string
}

export function getBlogMetaJson(): Promise<BlogPostMeta[]> {
    let domainHost = getCurrentDomainHost();

    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();

        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    resolve(JSON.parse(request.responseText).posts);
                } else {
                    reject(new Error(`Error: response status was: ${request.status}`))
                }
            }
        };

        request.open('GET', `${domainHost}/meta.json`);
        request.send();
    });
}



