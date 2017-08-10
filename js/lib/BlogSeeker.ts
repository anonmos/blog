import {performGet} from './Request'

export interface BlogPost {
    title: string,
    date: string,
    short: string
}

export function getPaginatedBlogPosts(page: number): Array<BlogPost> {

}