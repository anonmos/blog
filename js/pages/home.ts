//import {BlogPostMeta, BlogSeeker} from "../lib/BlogSeeker";

export default async function init() {
    /*let seeker = new BlogSeeker();
    let blogList = <HTMLDivElement> document.getElementById('blog-list');
    let posts = await seeker.getBlogPosts(1);
    posts.forEach((post) => {
        blogList.appendChild(createBlogMarkup(post));
    })*/
}

/*function createBlogMarkup(post: BlogPostMeta): HTMLDivElement {

    let container = document.createElement('div');
    container.classList.add('blog-post');

    let blogTitle = document.createElement('div');
    blogTitle.classList.add('blog-post-title');

    let blogDate = document.createElement('div');
    blogDate.classList.add('blog-post-meta');

    let blogSubject = document.createElement('p');

    blogSubject.innerHTML = post.short;
    blogDate.innerHTML = post.date;
    blogTitle.innerHTML = post.title;

    container.appendChild(blogTitle);
    container.appendChild(blogDate);
    container.appendChild(blogSubject);

    return container;
}*/