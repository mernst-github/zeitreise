function Author(id, name) {
    this.id = id;
    this.name = name;
}

function Publication(releaseDate, id) {
    this.releaseDate = releaseDate;
    this.id = id;
}

function AuthorActivity(id, name, publications) {
    this.id = id;
    this.name = name;
    this.publications = publications;
}

AuthorActivity.prototype.startYear = function() {
    return this.publications[0].releaseDate.getFullYear();
};

AuthorActivity.prototype.endYear = function() {
    return this.publications[this.publications.length - 1].releaseDate.getFullYear();
};

AuthorActivity.prototype.spanYears = function() {
    return this.endYear() - this.startYear() + 1;
};

angular.module('zeitapi', ['ng']).config(['$httpProvider', function (http) {
        delete http.defaults.headers.common['X-Requested-With'];
    }]).factory('Author', function ($http) {
        var rootUri = 'http://api.zeit.de/author';
        return {
            query: function (params, cb) {
                $http.get(rootUri + '?limit=1000', {
                    headers:{'X-Authorization':'602c992cc45dd61c013925c253777e31447df5b2ea6e83152283'}
                }).success(function (response) {
                        cb(response.matches.map(function(json) {
                            return new Author(json.uri.substring(rootUri.length + 1), json.value);
                        }));
                    });
            },
            get:function (params, cb) {
                $http.get(rootUri + "/" + params.id + '?fields=uuid,release_date&limit=1000', {
                    headers:{'X-Authorization':'602c992cc45dd61c013925c253777e31447df5b2ea6e83152283'}
                }).success(function (response) {
                        var publications = response.matches.map(function(json) {
                            return new Publication(
                                new Date(json.release_date),
                                json.uuid
                            );
                        });
                        publications.sort(function(left, right) {
                            return left.releaseDate.getTime() - right.releaseDate.getTime();
                        });
                        cb(new AuthorActivity(
                            response.uri.substring(rootUri.length + 1),
                            response.value,
                            publications));
                    });
            }
        };
    }).factory('Client', function ($http) {
        return {
            get:function (params, cb) {
                $http.get('http://api.zeit.de/client', {
                    headers:{'X-Authorization':'602c992cc45dd61c013925c253777e31447df5b2ea6e83152283'}
                }).success(cb);
            }
        };
    });