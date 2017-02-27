self.onmessage = function ( e ) {
    var filePath = e.data;

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE ) {
            if ( xhr.status === 200 ) {
                self.postMessage( xhr.response );
            } else {
                self.postMessage( 'error' );
            }

            //self.close();
        }

    };

    xhr.open( 'GET', filePath, true );
    xhr.responseType = 'json';
    xhr.send();
};