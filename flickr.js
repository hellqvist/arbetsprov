var client = new XMLHttpRequest();
var url = "https://api.flickr.com/services/rest/?";
var flickr_data = {
    methods: {
        photo_search: "flickr.photos.search"
    },
    api_key: "df0e03e8798366d1c9c7d5c49ea88f2f",
    format: "json",
    nojsoncallback: '1'
};

function search(text) {
    document.getElementById("spinner").className+= " visible";

    client.open("GET",
        url +
        'method=' + flickr_data.methods.photo_search +
        '&&api_key=' + flickr_data.api_key +
        '&&format=' + flickr_data.format +
        '&&nojsoncallback=' + flickr_data.nojsoncallback +
        '&&text=' + text,
        true);
    client.send();

    return false;
};

var client = new XMLHttpRequest();
client.onreadystatechange = function() {
    if (client.readyState === 4) {
        if (client.status === 200) {
            var jsonResponse = JSON.parse(client.responseText);
            if (jsonResponse.stat === "ok") {
                if (jsonResponse.photos && jsonResponse.photos.photo) {
                    setSearchResult(jsonResponse.photos.photo);
                }
            } else if (jsonResponse.stat === "fail") {
                showErrorMessage(jsonResponse.message);
            }
        }
        document.getElementById("spinner").className = "spinner";
    }
}

function showErrorMessage(message) {
    document.getElementById("imagebox-title").innerHTML = "Ett fel inträffade";
    document.getElementById("imagebox-content").innerHTML = message;

    document.getElementById("imagebox").className += " visible";
}

function getPhotoTag(photo, className, onclick) {
    return '<div id="photo' +
            photo.id +
            '" class="' + className + '" onclick="' + onclick + '(' +
            photo.id +
            ')"><img src="https://farm' +
            photo.farm +
            '.staticflickr.com/' +
            photo.server +
            '/' +
            photo.id +
            '_' +
            photo.secret +
            '_q.jpg" /></div>';
}

var searchResult;
function setSearchResult(photos) {
    searchResult = new Array();
    var out = "";
    photos.forEach(function(photo) {
        searchResult[photo.id] = photo;
        var className = "result-image";
        var onclick = "addToGallery";
        if (selectedImages.hasOwnProperty(parseInt(photo.id))) {
            className+= " result-image--selected";
            onclick = "removeFromGallery";
        }
        out += getPhotoTag(photo, className, onclick);
    });
    document.getElementById("search_result").innerHTML = out;
}

/***    GALLERY     ***/

function showGallery() {
    var out = "";
    for (var propertyName in selectedImages) {
        var photo = selectedImages[propertyName];
        out += getPhotoTag(photo, "result-image result-image--gallery", "showOriginalImage");
    }
    document.getElementById("search_result").innerHTML = out;
}

var selectedImages = new Array();
var selectedImagesCount = 0;

function addToGallery(id) {
    if (!selectedImages.hasOwnProperty(id)) {
        selectedImages[id] = searchResult[id];
        selectedImagesCount++;
        updateShowGalleryText();
    }
    
    var photo = document.getElementById("photo" + id);
    photo.className = "result-image result-image--selected";
    photo.onclick = function() { removeFromGallery(id); }
}

function removeFromGallery(id) {
    if (selectedImages.hasOwnProperty(id)) {
        delete selectedImages[id];
        selectedImagesCount--;
        updateShowGalleryText();
    }

    var photo = document.getElementById("photo" + id);
    photo.className = "result-image";
    photo.onclick = function() { addToGallery(id); }
}

function updateShowGalleryText() {
    var text = "Visa galleri (" + selectedImagesCount + " bild";
    if (selectedImagesCount !== 1) {
        text+= "er";
    }
    text+=")";
    document.getElementById("showGalleryButton").value = text;
}

function hideOriginalImage() {
    document.getElementById("imagebox").className = "imagebox";
}

function showOriginalImage(id) {
    var photo = selectedImages[id];
    document.getElementById("imagebox-title").innerHTML = photo.title;
    document.getElementById("imagebox-content").innerHTML = 
        '<img src="https://farm' +
        photo.farm +
        '.staticflickr.com/' +
        photo.server +
        '/' +
        photo.id +
        '_' +
        photo.secret +
        '_z.jpg' +
        '" alt="' +
        photo.title + 
        '"/>';

    document.getElementById("imagebox").className += " visible";
}