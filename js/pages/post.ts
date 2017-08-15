import {getQueryStringParams} from '../lib/URLHelper';
import {getBlogPost} from '../lib/BlogSeeker';
import * as Showdown from 'showdown';

export default async function init() {
    let postContainer = <HTMLDivElement> document.getElementById('post-container');
    let markdownConverter = new Showdown.Converter();

    let queryStringParams = getQueryStringParams();

    if (!queryStringParams.has('post')) {
        setErrorMessage("Oops!  There was a problem getting your post.  Please refresh the page and try, try again.", postContainer)
        return;
    }

    let rawPostContent = await getBlogPost(<string> queryStringParams.get('post'));

    if (!rawPostContent || rawPostContent.length === 0) {
        setErrorMessage("Oops!  There was a problem getting your post.  Please refresh the page and try, try again.", postContainer)
        return;
    }

    let content = markdownConverter.makeHtml(rawPostContent);
    postContainer.innerHTML = content;
}

function setErrorMessage(message: string, errorElement: HTMLDivElement) {
    errorElement.innerHTML = message;
}