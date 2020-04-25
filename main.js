jQuery(function($) {
    if (document.location.href.includes('#access_token')) {
        if(window.opener) {
            
        } else {
            console.log("oauth callback");
            jsodemo.oauthCallback();
            jsodemo.process();
        }

    } 
    else if (document.location.href.includes('#error')) {
        alert(document.location.href);
    }
    else {
        console.log("No #access_token.");
        jsodemo.process();
    }
});