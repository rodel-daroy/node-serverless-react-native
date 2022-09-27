import { searchUsers } from '../../actions/peopleActions';
import { getSearchPosts } from '../../actions/postActions';

export const searchAction = (
    tab,
    text,
    setPeople,
    setIsLoading,
    setNoResults,
    setPosts,
    accessToken,
    defaultError
) => {
    if (text == '') return;
    if (tab === 'people') {
        setPeople([]);
        setIsLoading(true);
        searchUsers(accessToken, text, 0, 20, res => {
            setIsLoading(false);
            setPeople(res.data.data.users);
            setNoResults(res.data.data.users.length === 0 ? true : false);
        }, (err) => defaultError);
    }

    setIsLoading(true);
    setPosts([]);
    getSearchPosts(
        accessToken,
        props.user.subscribeToAdultContent,
        props.user.over18,
        text,
        0,
        20,
        null,
        null,
        null,
        'TIMELINE',
        res => {
            setPosts(res.data.data.posts);
            setIsLoading(false);
            setNoResults(res.data.data.posts.length === 0 ? true : false);
        },
        err => {
            setIsLoading(false);
            setPosts([]);
        },
    );
}

export const loadData = (
    text,
    posts,
    people,
    tabSelected,
    setPeople,
    setIsLoading,
    setPosts,
    accessToken,
    defaultError
) => {
    if (text == '') return;
    if (tabSelected == 'people' && people.length >= 20) {
        setIsLoading(true);
        searchUsers(accessToken, text, 0, 20, res => {
            setIsLoading(false);
            setPeople(people.concat(res.data.data.users));
        }, (err) => defaultError(err));
    }
    setIsLoading(true);
    getSearchPosts(
        accessToken,
        props.user.subscribeToAdultContent,
        props.user.over18,
        text,
        posts.length,
        20,
        null,
        null,
        null,
        'TIMELINE',
        res => {
            setPosts(posts.concat(res.data.data.posts));
            setIsLoading(false);
        },
        err => {
            setIsLoading(false);
            setPosts([]);
        },
    );
}