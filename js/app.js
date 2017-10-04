var myApp = angular.module('twitterApp', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider, $transition$) {

    $urlRouterProvider.otherwise('/signIn');

    var signInState = {
        name: 'signIn',
        url: '/signIn',
        component: 'signInComponent'
    }

    var mainPageState = {
        name: 'main',
        url: '/main',
        component: 'mainPageComponent',
        resolve: {
            resolvedFollowers: ['usernameListService', function (usernameListService) {
                return usernameListService.getFollowers();
            }],

            resolvedFollowing: ['usernameListService', function (usernameListService) {
                return usernameListService.getFollowing();
            }]
        }


    }

    var authenticationState = {
        name: 'authentication',
        url: '/authentication',
        redirectTo: (transition) => {
            let svc = transition.injector().get('signInService');
            return svc.authenticateUser().then((result) => {
                return result;
            });
        }
    }

    var registerState = {
        name: 'register',
        url: '/register',
        component: 'registerComponent'
    }

    var createNewUserState = {
        name: 'userCreation',
        url: '/userCreation',
        redirectTo: (transition) => {
            let svc = transition.injector().get('registerService');

            return svc.registerNewUser().then((result) => {
                return 'allTweets';
            });
        }
    }


    //Created and Modified By Artem
    var feedState = {
        name: 'main.feed',
        url: '/feed',//'users/@{username}/feed',
        component: 'tweetListComponent',
        resolve: {
            resolvedTweetsList: ['tweetListService', function (tweetListService) {

                return tweetListService.getFeed(/*$transition$.params().username*/);
            }]
        }
    }
    // Modified by Chris
    var contextState = {
        name: 'main.context',
        // url: 'context/',
        url: '/context/{tweetId}',
        component: 'contextComponent',
        resolve: {
            resolvedContext: ['contextService', '$transition$', function (contextService, $transition$) {
                // return contextService.getContext($transition$.params().id)
                let result = contextService.getContext($transition$.params().tweetId)

                return result
            }]
        }
    }

    // Added by Chris. Needs to be converted to a nested state
    var searchState = {
        name: 'search',
        url: '/search'//,
        // redirectTo: (transition) => {
        //     let svc = transition.injector().get('searchService');

        //     // return svc.getSearchType()
        //     let temp = svc.getSearchType()
        //     // console.log(temp)
        //     return temp
        // }
    }

    // Added by Chris. Needs to be converted to a nested state
    var hashtagSearchState = {
        name: 'main.hashtagSearch',
        url: '/hashtagSearch/{label}',
        component: 'tweetListComponent',
        resolve: {
            resolvedTweetsList: ['hashtagSearchService', 'searchService', '$transition$', '$state', '$stateParams',
                function (hashtagSearchService, searchService, $transition$, $state, $stateParams) {
                    console.log("made it to hashtag search resolve")
                    console.log("transtions = " + $transition$.params().label)
                    console.log("stateparams = " + $stateParams.label)
                    let label = $stateParams.label
                    if (!label) {
                        label = $transition$.params().label
                    }
                    return hashtagSearchService.search(label)
                    // return hashtagSearchService.search(searchService.searchString)
                }]
        }
    }

    //Artem
    var allTweetsState = {
        name: 'main.allTweets',
        url: '/allTweets',
        component: 'tweetListComponent',
        resolve: {
            resolvedTweetsList: ['tweetListService', function (tweetListService) {
                return tweetListService.getAllTweets();
            }]
        }
    }

    //Artem
    var myTweetsState = {
        name: 'main.myTweets',
        url: '/myTweets',
        component: 'tweetListComponent',
        resolve: {
            resolvedTweetsList: ['tweetListService', function (tweetListService) {
                return tweetListService.getMyTweets();
            }]
        }
    }
    //Artem
    var postNewTweetState = {

        name: 'postNewTweet',
        url: '/postNewTweet',
        redirectTo: (transition) => {
            let svc = transition.injector().get('newTweetService');
            return svc.postNewTweet().then((result) => {
                return 'main.allTweets';
            });

        }
    }


    $stateProvider.state(mainPageState);
    $stateProvider.state(postNewTweetState);
    $stateProvider.state(myTweetsState);
    $stateProvider.state(allTweetsState);

    // Added by Chris. Old code
    // var usernameSearchState = {
    //     name: 'main.usernameSearch',
    //     url: '/usernameSearch/{username}',
    //     component: 'usernameSearchComponent',
    //     resolve: {
    //         resolvedUser: ['usernameSearchService', 'searchService', '$transition$', '$state', '$stateParams',
    //             function (usernameSearchService, searchService, $transition$, $state, $stateParams) {
    //                 let username = $stateParams.username
    //                 if (!username) {
    //                     username = $transition$.params().username
    //                 }
    //                 let res = usernameSearchService.search(username)
    //                 return res
    //             }]
    //     }
    // }
    // $stateProvider.state(usernameSearchState);

    // Added by Chris. Needs to be converted to a nested state
    var publicProfileState = {
        name: 'main.publicProfile',
        url: '/publicProfile/{username}',
        // url: '/publicProfile',
        component: 'publicProfileComponent',
        resolve: {
            resolvedUser: ['usernameSearchService', 'searchService', '$transition$', function (usernameSearchService, searchService, $transition$) {
                console.log("about to call user name search ")
                let result = usernameSearchService.search($transition$.params().username)
                console.log('found user 2= ' + result)
                return result
            }]
        }
    }

    // Added by Chris. Needs to be converted to a nested state
    var mentionsState = {
        name: 'mentions',
        url: '/mentions',
        component: 'mentionsComponent',
        resolve: {
            resolvedTweetsList: [function (mentionsService) {
                let result = mentionsService.getMentions()
                return result
            }]
        }
    }


    $stateProvider.state(createNewUserState);
    $stateProvider.state(signInState);
    $stateProvider.state(registerState);
    $stateProvider.state(authenticationState);
    $stateProvider.state(feedState);
    $stateProvider.state(contextState);

    // Added by Chris. Needs testing. Needs to be converted to a nested state
    $stateProvider.state(searchState);
    $stateProvider.state(hashtagSearchState);
    $stateProvider.state(publicProfileState);
    $stateProvider.state(mentionsState);

}]);
