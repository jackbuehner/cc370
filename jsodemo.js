this.jsodemo = (function() {
    var token = null;
    window.loginType = "unset";
    
    
    var request = ['campaign_data'];
    var userinfoEndpoint = "https://api.cc.email/v3/idfed";
    var opts = {
        scopes: {
            request: request
        },
        response_type: 'id_token token'
    }
        
    var client = new jso.JSO({
                providerID: "ConstantContact",
                client_id: "8bc11463-0131-41f7-8a00-86584de4f838",
                redirect_uri: "https://jackbuehner.github.io/cc370/", 
                authorization: "https://api.cc.email/v3/idfed"
            });
            

    return {
        oauthCallback : function() {
            client.callback();
        },
        getSilentOpts : function() {
            var silent_opts = JSON.parse(JSON.stringify(opts));
            silent_opts.request = {prompt: "none"};
            return silent_opts;
        },
        process: function() {
            var silent_opts = this.getSilentOpts();
            jsodemo.updateStatus("Checking token...");
            this.token = client.checkToken(silent_opts);
            if(this.token) {
                this.updateStatus("Token is valid: " + this.token.access_token);
                jsodemo.validToken();
                console.log(this.token.access_token);
            } else {
                jsodemo.clearStatus();
                this.printLoginOptions();
            }
        },
        printLogoutOptions : function() {
            var html = "<button id='logout'>Logout</button>";
            jsodemo.updateMenu(html);
            $(document).off('click', "#logout");
            $(document).on ("click", "#logout",function(e) {jsodemo.logout()});
        },
        printLoginOptions : function() {
            var html = "<button id='login'>Login</button>";
            jsodemo.updateMenu(html);
            $(document).off('click', "#login");
            $(document).on ("click", "#login",function(e) {jsodemo.login()});
        },
        validToken: function() {
            jsodemo.printLogoutOptions();
            jsodemo.getUserInfo(function(data) {
                jsodemo.updateContent(JSON.stringify(data));
            });
        },
        _get : function(url, callback) {
            var self = this;
            $.ajax({
                    url: url,
                    beforeSend: function(xhr) {
                         xhr.setRequestHeader("Authorization", "Bearer " + self.token.access_token)
                    }, success: function(data){
                        callback(data)
                    }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                        let errMsg = '_get error:' + errorThrown;
                        alert(errMsg);
                        console.log(errMsg);
                }});
        },
        _post : function(url, data, callback) {
            var self = this;
            $.ajax({
                type: "POST",
                url: url,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + self.token.access_token)
                }, 
                data: data,
                success: function(result) {
                    callback(result)
                },
                error(XMLHttpRequest, textStatus, errorThrown) {
                    let errMsg = '_post error:' + errorThrown;
                    alert(errMsg);
                    console.log(errMsg);
                }
            });
        },
        getUserInfo : function(callback) {
            let url = userinfoEndpoint;
            this._get(url, callback);
        },

        logout: function()  {
            client.wipeTokens()
            this.clearStatus();
            this.clearContent();
            jsodemo.printLoginOptions();
        },
        login : function() {
            window.loginType = "login";
            let token = client.getToken(opts);
            client.setLoader(jso.HTTPRedirect)
            client.getToken(opts)
                .then((token) => {
                    dashboard.dataporten.valideToken();
                    console.log("I got the token: ", token)
                })
        },
        updateMenu : function(s) {
            $("#menu").html(s);
        },
        updateStatus : function(s) {
            $("#status").html(s);
        },
        clearStatus : function() {
            $("#status").html("");
        },
        updateContent : function(s) {
            $("#content").html(s);
        },
        appendContent : function(s){
            $("#content").append(s);
        },
        clearContent : function() {
            $("#content").html("");
        }
    }
})();