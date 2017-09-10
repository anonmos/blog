import {getQueryStringParams} from '../lib/URLHelper';
import {getBlogPost} from '../lib/BlogSeeker';
import * as Showdown from 'showdown';

export default async function init() {
    let postContainer = <HTMLDivElement> document.getElementById('post-container');
    let title = <HTMLTitleElement> document.getElementsByTagName('title')[0];
    let markdownConverter = new Showdown.Converter({'parseImgDimensions': true});

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

    title.text = parseTitle(<string> queryStringParams.get('post'));
    postContainer.innerHTML = markdownConverter.makeHtml(rawPostContent);
}

function setErrorMessage(message: string, errorElement: HTMLDivElement) {
    errorElement.innerHTML = message;
}

function parseTitle(postFileName: string): string {
    const SKIP_DATE_INDEX = 1;
    let parsedFileName = postFileName.split('-');
    let lastWord = parsedFileName[parsedFileName.length - 1].split('.')[0];

    let returnString = "";

    for (let i = SKIP_DATE_INDEX; i < parsedFileName.length - 1; i++) {
        returnString += `${capitalizeFirstLetter(parsedFileName[i])} `;
    }

    returnString += `${capitalizeFirstLetter(lastWord)}`;

    return returnString;
}

function capitalizeFirstLetter(word: string): string {
    let capitalizedFirstLetter = word.charAt(0).toUpperCase();
    let restOfTheString = word.slice(1);

    return `${capitalizedFirstLetter}${restOfTheString}`
}