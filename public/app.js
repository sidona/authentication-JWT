/**
 * Created by sdonose on 11/12/2015.
 */

(function () {
    'use strict';

  var app=angular.module('app',[], function config($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
  });
  app.constant('API_URL','http://localhost:3000');

  app.controller('MainCtrl',function MainCtrl($scope,RandomUserFactory,UserFactory,AuthTokenFactory){
    var vm=this;

    vm.getRandomUser=getRandomUser;
    vm.login=login;
    vm.logout=logout;

    //initialization

    UserFactory.getUser().then(function success(response){
      vm.user=response.data;
    })

    function getRandomUser(){

      RandomUserFactory.getUser().then(function success(response){
        vm.randomUser=response.data;
      })
    }

    function login(username,password){
        UserFactory.login(username,password).then(function success(response){
          //vm.user=response.data
          //token
          vm.user=response.data.user;
          alert(response.data.token)
        },handleError)
    }

    function logout(){
      UserFactory.logout();
      vm.user=null;
    }

    function handleError(response){
      alert('error'+ response.data)
    }

  })

  app.factory('RandomUserFactory',function RandomUserFactory(API_URL,$http){

    return{
      getUser:getUser
    }
    function getUser(){
      return $http.get(API_URL+'/random')
    }

  })

    app.factory('UserFactory',function UserFactory(API_URL,$http,AuthTokenFactory,$q){
      return{
        login:login,
        logout:logout,
        getUser:getUser

      }

      //function login(username,password){
      //  return $http.post(API_URL+'/login',{
      //    username:username,
      //    password:password
      //  })
      //}

      //token

      function login(username,password){
        return $http.post(API_URL+'/login',{
          username:username,
          password:password
        }).then(function success(response){
          AuthTokenFactory.setToken(response.data.token)
          return response;
        })
      }

      function logout(){
        AuthTokenFactory.setToken();
      }

      function getUser(){
        if(AuthTokenFactory.getToken()){
          return $http.get(API_URL+'/me')
        }else{
          return $q.reject({data:'client has no token'})
        }
      }


    })



  //save in local storage
  app.factory('AuthTokenFactory', function AuthTokenFactory($window){
    var store=$window.localStorage;
    var key='auth-token';

    return{
      getToken:getToken,
      setToken:setToken
    }

    function getToken(){
      return store.getItem(key)
    }
    function setToken(token){
        if(token){
          store.setItem(key,token)
        }else{
          store.removeItem(key)
        }
    }

  })

  app.factory('AuthInterceptor',function AuthInterceptor(AuthTokenFactory){
    return{
    request:addToken
    }
    function addToken(config){
      var token=AuthTokenFactory.getToken();
      if(token){
        config.headers=config.headers||{};
        //authorization header
        config.headers.Authorization='Bearer '+token
      }
      return config;
    }

  })

  })();
