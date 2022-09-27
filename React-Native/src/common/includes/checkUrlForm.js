export default checkUrlForm = (strUrl) => {
    if (strUrl) {
        let expUrl = /^http[s]?\:\/\//i;
        return expUrl.test(strUrl);
    }
}