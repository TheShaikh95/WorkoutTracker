async function userSignIn(data) {
    const res = await fetch("/api/signin", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    return json; 
  }
  
  async function userSignUp(data) {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    return json; 
  }
  
  
  $(document).on("click", "#show-signup", function() {
    const alert = $("#user-sign-errors");
    if (!alert.hasClass("d-none")) {
      alert.addClass("d-none");
    }
    const btn = $("#signin-button");
    btn.attr("id", "signup-button");
    btn.text("Sign Up");
    $("#login-header").text("Sign Up");
    $(this).attr("id", "show-signin");
    $(this).parent().html("Already a user? <span id=\"show-signin\">Sign In</span>");
  });
  
  $(document).on("click", "#show-signin", function() {
    const alert = $("#user-sign-errors");
    if (!alert.hasClass("d-none")) {
      alert.addClass("d-none");
    }
    const btn = $("#signup-button");
    btn.attr("id", "signin-button");
    btn.text("Sign In");
    $("#login-header").text("Sign In");
    $(this).attr("id", "show-signup");
    $(this).parent().html("Not a user? <span id=\"show-signup\">Sign Up</span>");
  });
  
  
  function signUser(action) {
    let data = {};
    const form = $("#login-form").serializeArray();
    form.forEach(element => {
      data[element.name] = element.value;
    });
    const response = (action == "signin") ? userSignIn(data) : userSignUp(data);
    response.then(result => {
      if (result.success) {
        location = "/exercise";
      } else if (result.errorList.length) {
        const ul = $("#user-sign-errors ul");
        ul.empty();
        const alert = $("#user-sign-errors");
        result.errorList.forEach(element => {
          ul.append(`<li>${element}</li>`);
        });
        if (alert.hasClass("d-none")) {
          alert.removeClass("d-none");
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }
  
  $(document).on("click", "#signin-button", function (ev) {
    ev.preventDefault();
    signUser("signin");
  });
  
  $(document).on("click", "#signup-button", function (ev) {
    ev.preventDefault();
    signUser("signup");
  });