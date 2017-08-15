export interface BlogPostMeta {
    filename: string,
    title: string,
    short: string
}

export function getBlogMetaJson(): Promise<BlogPostMeta[]> {
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
        
        request.open('GET', `/meta.json`);
        request.send();
    });
}

export function getBlogPost(post: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    resolve(request.responseText);
                } else {
                    reject(new Error(`Error: response status was: ${request.status}`))
                }
            }
        };
        
        request.open('GET', `/posts/${post}`);
        request.send();
    });
}

export function parseDate(date: string): string {
    let year = date.substr(0, 2);
    let month = date.substr(2, 2);
    let day = date.substr(4, 2);
    
    let dateMap = getDateMap();
    
    return `${dateMap.get(month)} ${day}, 20${year}`;
}

function getDateMap(): Map<string, string> {
    let rval = new Map<string, string>();
    
    rval.set(`01`, `January`);
    rval.set(`02`, `February`);
    rval.set(`03`, `March`);
    rval.set(`04`, `April`);
    rval.set(`05`, `May`);
    rval.set(`06`, `June`);
    rval.set(`07`, `July`);
    rval.set(`08`, `August`);
    rval.set(`09`, `September`);
    rval.set(`10`, `October`);
    rval.set(`11`, `November`);
    rval.set(`12`, `December`);
    
    return rval;
}



