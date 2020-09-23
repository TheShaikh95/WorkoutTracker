function loadPreviousWorkouts() {
    const spinner = $("#recently-added-spinner");
    const recently = $("#recently-added-exercise-content");
    recently.empty();
    if (spinner.hasClass("d-none")) {
      spinner.removeClass("d-none");
    }
    if (!recently.hasClass("d-none")) {
      recently.addClass("d-none");
    }
    const response = API.getPreviousWorkouts();
    response.then(result => {
      if (result.success && result.data) {
        workoutsArr = result.data.workouts;
        workoutsArr.forEach(element => {
          let li = "";
          if (element.weight != null) {
            li += (`<li>Weight: ${element.weight} kilogram</li>` + `<li>Reps: ${element.reps}</li>` + `<li>sets: ${element.sets}</li>`);
          } else {
            li += `<li>Distance: ${element.distance} kilometre</li>`;
          }
          let formatedDate = "";
          const date = new Date(element.date);
          formatedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()} (${date.toLocaleString('default', { weekday: 'short' })})`
          recently.prepend(
            `
            <div class="card bg-light mb-3" style="width: 100%;">
              <div class="card-header d-flex justify-content-between align-items-center">
                <div>${element.type}</div>
                <div>
                  <button type="button" value="${element._id}" class="recently-delete-btn btn btn-danger">Delete</button>
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title">${element.name}</h5>
                <ul class="list-unstyled">
                  ${li}
                  <li>Time: ${element.time} minute</li>
                  <li>Date: ${formatedDate}</li>
                </ul>
              </div>
            </div>
            `
          );
        });
      } else if (result.success && !result.data) {
        recently.append(
          `
          <div class="card bg-light mb-3" style="width: 100%;">
            <div class="card-body">
              <h5 class="card-title">Not Found</h5>
              <p class="card-text">You have not added any exercise yet</p>
            </div>
          </div>
          `
        );
      } else {
        let li = "";
        result.errorList.forEach(element => {
          li += `<li>${element}</li>`;
        });
        recently.append(
          `
          <div class="card bg-light mb-3" style="width: 100%;">
            <div class="card-body">
              <h5 class="card-title">Error</h5>
              <ul class="list-unstyled">
                  ${li}
              </ul>
            </div>
          </div>
          `
        );
      }
      if (!spinner.hasClass("d-none")) {
        spinner.addClass("d-none");
      }
      if (recently.hasClass("d-none")) {
        recently.removeClass("d-none");
      }
    }).catch(err => {
      console.log(err);
    })
  }
  
  function setMaxDate() {
    let today = new Date();
    let dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if(dd < 10) dd = '0' + dd;
    if(mm < 10) mm = '0' + mm;
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("exercise-form-date").setAttribute("max", today);
  }
  
  function getAndAppendExercises(value) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/exercises.json");
    xhr.responseType = "json";
    xhr.onload = function() {
      const names = this.response[value];
      if (names && Array.isArray(names)) {
        const el = $("#exerciseList");
        el.empty();
        names.forEach(name => {
          el.append(`<option value="${name}">`);
        });
      }
    }
    xhr.send();
  }
  
  $("document").ready(function() {
    const cookieArr = document.cookie.split(/=|;/);
    cookieArr.forEach((element, index) => {
      if (element.trim() == "username") {
        $("#navbar-username").text(cookieArr[index + 1]);
        return; 
      }
    });
  
    loadPreviousWorkouts();
    setMaxDate();
  
    $(document).on({
      mouseenter: function() {
        $(this).toggleClass("shadow-lg");
      },
      mouseleave: function() {
        $(this).toggleClass("shadow-lg");
      }
    }, ".card");
  
    $("#add-exercise").click(function() {
      $(this).parent().addClass("d-none");
      $("#add-exercise-form").removeClass("d-none");
    });
  
    $("#exercise-form-cancel-btn").click(function() {
      $("#exercise-main-content").removeClass("d-none");
      $("#add-exercise-form").addClass("d-none");
      document.getElementById("exercise-form-elment").reset();
    });
  
    $("#workout-type-input").focusout(function() {
      if ($(this).val()) {
        getAndAppendExercises($(this).val());
        const cardioType = $("#cardio-type");
        const otherType = $("#other-type");
        if ($(this).val() == "Cardio") {
          if (cardioType.hasClass("d-none")) cardioType.removeClass("d-none");
          if (!otherType.hasClass("d-none")) otherType.addClass("d-none");
        } else {
          if (otherType.hasClass("d-none")) otherType.removeClass("d-none");
          if (!cardioType.hasClass("d-none")) cardioType.addClass("d-none");
        }
      }
    });
  
    $("#exercise-form-save-btn").click(function(ev) {
      ev.preventDefault();
      let data = {};
      const formArr = $("#add-exercise-form form").serializeArray();
      formArr.forEach(element => {
        if (element.value != "") data[element.name] = element.value;
      });
      const response = API.addExercise(data);
      response.then(result => {
        if (result.success) {
          $("#exercise-main-content").removeClass("d-none");
          $("#add-exercise-form").addClass("d-none");
          loadPreviousWorkouts();
          document.getElementById("exercise-form-elment").reset();
        } else if (result.errorList.length) {
          const alert = $("#exercise-form-errors");
          const ul = $("#exercise-form-errors ul");
          ul.empty();
          result.errorList.forEach(element => {
            ul.append(`<li>${element}</li>`);
          });
          if (alert.hasClass("d-none")) {
            alert.removeClass("d-none");
          }
        }
      }).catch(err => {
        console.log(err);
      })
    });
  
    $(document).on("click", ".recently-delete-btn", function() { 
      const response = API.deleteExercise({ id: $(this).val() });
      response.then(result => {
        if (result.success) {
          $(this).closest(".card").remove();
        }
      }).catch(err => {
        console.log(err);
      });
    });
  
  });