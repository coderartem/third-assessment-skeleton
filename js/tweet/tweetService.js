angular.module('twitterApp').service('tweetService', ['$http', '$state', function ($http, $state) {


    this.getLikes = (id) => {
        return $http.get('http://localhost:8090/tweets/' + id + '/likes')
    }

    this.like = (id) => {
        let credentials = {
            password: sessionStorage.getItem('password'),
            userLogin: sessionStorage.getItem('userLogin')
        }
        $http.post('http://localhost:8090/tweets/' + id + '/like', credentials);
    }

    this.repost = (id) => {
        let credentials = {
            password: sessionStorage.getItem('password'),
            userLogin: sessionStorage.getItem('userLogin')
        }
        $http.post('http://localhost:8090/tweets/' + id + '/repost', credentials).then((result) => {
            if ($state.is('main.allTweets')) {
                $state.reload();
            } else {
                $state.go('main.allTweets');
            }
        })
    }

    this.deleteTweet = (id) => {
        let credentials = {
            password: sessionStorage.getItem('password'),
            userLogin: sessionStorage.getItem('userLogin')
        }
        $http.post('http://localhost:8090/tweets/' + id + '/delete', credentials).then((result) => {
            $state.reload();
        })
    }



}])