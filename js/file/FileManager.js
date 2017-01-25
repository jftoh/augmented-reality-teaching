function FileManager ( scene ) {
    this._scene = scene;
}

FileManager.prototype.loadConfigFile = function( fileName, success, error ) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ( xhr === XMLHttpRequest.DONE ) {
            if (xhr.status === 200 ) {
                if ( success ) {
                    success ( JSON.parse( xhr.response ), this._scene  );
                }
            } else {
                if ( error ) {
                    error ( xhr.response );
                }
            }
        }
    };

    xhr.open( 'GET', fileName, true );
    xhr.responseType = 'json';
    xhr.send();
};


FileManager.prototype.checkForFileApiSupport = function () {
    if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
        alert( ' The File APIs are not supported in this brower. ' );
    }
};

