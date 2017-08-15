import home from './pages/home';
import post from './pages/post';
import {getCurrentHtmlPageName} from './lib/URLHelper';

switch(getCurrentHtmlPageName()) {
    case `post`: 
        post();
        break;
    default:
        home();
}