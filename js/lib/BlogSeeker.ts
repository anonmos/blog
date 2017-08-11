import {listBlogPosts} from './AWSHelper'
import {getCurrentDomainHost} from './URLHelper'

export interface BlogPost {
    title: string,
    date: string,
    short: string
}

export class BlogSeeker {

    months: Map<string, string>;

    constructor() {
        this.months = this.populateMonths();
    }

    async getBlogPosts(page: number): Promise<Array<BlogPost>> {
        let domainHost = getCurrentDomainHost();
        let rawBlogList = await listBlogPosts(`${domainHost}/posts/`);

        let blogPosts: Array<BlogPost> = [];
        let blogPostRequests: Promise<BlogPost>[] = [];

        rawBlogList.forEach((blog) => {
            if (blog.Key) {
                let blogDate = <string> blog.Key.split('-')[0];
                blogPostRequests.push(this.getBlogPost(`https://${domainHost}/posts/${blog}`, blogDate))
            }
        });

        return Promise.all(blogPostRequests).then((value) => {
            value.forEach((blog) => {
                blogPosts.push(blog);
            });

            return Promise.resolve(blogPosts);
        });
    }

    private parseBlogPost(post: string, date: string): BlogPost {
        //Post is expected to be in markdown with the first two lines being the title and tl;dr
        //Date is expected to be yymmdd
        let postParts = post.split('\n');
        let year = date.substr(0, 1);
        let month = date.substr(2, 3);
        let day = date.substr(4, 5);

        return {
            title: postParts[0],
            date: `${this.months.get(month)} ${day}, 20${year}`,
            short: postParts[1]
        }
    }

    private populateMonths() {
        let months = new Map<string, string>();
        months.set(`01`, `January`);
        months.set(`02`, `February`);
        months.set(`03`, `March`);
        months.set(`04`, `April`);
        months.set(`05`, `May`);
        months.set(`06`, `June`);
        months.set(`07`, `July`);
        months.set(`08`, `August`);
        months.set(`09`, `September`);
        months.set(`10`, `October`);
        months.set(`11`, `November`);
        months.set(`12`, `December`);

        return months;
    }

    private getBlogPost(url: string, date: string): Promise<BlogPost> {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();

            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        let result = this.parseBlogPost(request.responseText, date);
                        resolve(result);
                    } else {
                        reject(new Error(`Error: response status was: ${request.status}`))
                    }
                }
            };

            request.open('GET', url);
            request.send();
        })
    }


}

