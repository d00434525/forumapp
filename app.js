const URL = "https://forum2022.codeschool.cloud";

// Minimum Vue Instance
var app = new Vue({
    el: "#app",

    data: {
        homePage: true,
        loginPage: false,
        registerPage: false,

        emailInput: "",
        passwordInput: "",

        newEmailInput: "",
        newPasswordInput: "",
        newFullNameInput: ""

    },
    methods: {
        getSession: function () {
            fetch(URL + "/session", {
              method: "GET",
              credentials: "include"  
            }).then((response) => {
                // are we logged in?
                if (response.status == 200){
                    // logged in :)
                    console.log("logged in.");

                    // not logged in :(
                } else if (response.status == 401){
                    console.log("not logged in.");
                } else {
                    console.log("Some sort of error when GETTING /session", response.status, response);
                }
            });
        },
        // POST /session = Attempt to login
        postSession: function () {
            let loginCredentials = {
                username: this.loginEmailInput, 
                password: this.loginPasswordInput
            };

            let response = await fetch(URL + "/session", {
                method: "POST",
                body: JSON.stringify(loginCredentials),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            // 1. parse response body
            let body;
            try {
                body = response.json();
                // console.log(body);
            } catch (error) {
                console.log("Response body was not json.")
            }

            // 2. check - was the login successful?
            if (response.status == 201) {
                // successful login

                // clear inputs
                this.loginEmailInput = "";
                this.loginPasswordInput = "";

                // take the user to the home page
                this.loadHomePage();

            } else if (response.status == 401) {
                // unsuccessful login

                // let the user know it was unsuccessful
                alert("Unsuccessful login");

                // clear password input
                this.loginPasswordInput = "";
            } else {
                console.log("Some sort of error when POSTING /session:", response.status, response);
            }
        },

        // POST /user - create new user
        postUser: function () {
            let newUser = { username: this.newEmailInput, password: this.newPasswordInput, fullname: this.newFullNameInput };
            fetch(URL + "/user", {
                method: "POST",
                body: JSON.stringify(newUser),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }).then((response) => {
                console.log(response);
            });
                  // parse the response body
                  let body = response.JSON();
                  console.log(body);
      
                  // was the login successful?
                  if (response.status == 201){
                      console.log("Succesfull login attempt");
      
                      // cleat inputs
                      this.emailInput = "";
                      this.passwordInput = "";
      
                      // take the user to a home page
                  } else if (response.status == 401){
                      console.log("Unsuccesfull login attempt.");
      
                      // let the user know it was unsuccesfull
                      alert("Unsuccesfull login attempt.");
      
                      // clear password input
                      this.passwordInput = "";
                  } else {
                      console.log("Some sort of error when GETTING /session", response.status, response);
                  }
        }
    },
    created: function () {
        this.getSession();
    }
});