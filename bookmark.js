javascript:(function() {

    let multiGraphiteBaseUrl = "http://localhost:8000";

    let currentSearchParams = new URLSearchParams(location.search);
    let newSearchParams = new URLSearchParams();

    if (currentSearchParams.get("title")) {
        newSearchParams.set("title", currentSearchParams.get("title"));
    } else {
        newSearchParams.set("title", "...");
    }

    newSearchParams.set("json", "[\n  {}\n]");
    newSearchParams.set("targets", currentSearchParams.getAll("target").join("\n"));
    newSearchParams.set("url", location.origin);

    var width = currentSearchParams.get("width");
    if (width === null) {
        newSearchParams.set("width", 300);
    } else {
        newSearchParams.set("width", width);
    }

    var height = currentSearchParams.get("height");
    if (height === null) {
        newSearchParams.set("height", 250);
    } else {
        newSearchParams.set("height", height);
    }

    var from = currentSearchParams.get("from");

    if (typeof from === 'string' && from.length == 14) {
        newSearchParams.set("timeType", "range");

        newSearchParams.set("from", from);
        newSearchParams.set("until", currentSearchParams.get("until"));

        newSearchParams.set("recent", "24h");

    } else {
        if (from === null) {
            from = '-24h';
        }
        newSearchParams.set("timeType", "recent");
        newSearchParams.set("recent", from.substring(1));

        newSearchParams.set("from", "00:00_20220101");
        newSearchParams.set("until","23:59_20220101");
    }

    let url = multiGraphiteBaseUrl + "#/?" + newSearchParams.toString();

    location.replace(url);

})()
