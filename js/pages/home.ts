import {BlogPostMeta, getBlogMetaJson, parseDate} from "../lib/BlogSeeker";

export default async function init() {

    let posts = await getBlogMetaJson();
    let blogList = <HTMLDivElement> document.getElementById('blog-list');
    posts.forEach((post) => {
        blogList.appendChild(createBlogMarkup(post));
    })
}

function createBlogMarkup(post: BlogPostMeta): HTMLDivElement {

    let container = document.createElement('div');
    container.classList.add('blog-post');

    let blogTitle = document.createElement('div');
    blogTitle.classList.add('blog-post-title');

    let blogDate = document.createElement('div');
    blogDate.classList.add('blog-post-meta');

    let blogSubject = document.createElement('p');

    let postLink = document.createElement('a');
    postLink.setAttribute(`href`, `post.html?post=${post.filename}`);
    postLink.innerHTML = ` ... Read More`;

    blogSubject.innerHTML = `${post.short}`;
    blogSubject.appendChild(postLink);
    blogDate.innerHTML = parseDate(post.filename);
    blogTitle.innerHTML = post.title;


    container.appendChild(blogTitle);
    container.appendChild(blogDate);
    container.appendChild(blogSubject);

    return container;
}