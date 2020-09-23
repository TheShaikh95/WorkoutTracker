function createPieChart(labels, data) {
    let pieChart = document.getElementById("pieChart").getContext("2d");
    let chart = new Chart(pieChart, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
          labels: labels,
          datasets: [{
              label: 'Type of workouts done',
              backgroundColor: [
                "#A7226E", "#EC2049", "#F26B38", "#F7DB4F", "#2F9599", "#FF4E50", "#FC913A", "#45ADA8"
              ],
              borderColor: [
                "#A7226E", "#EC2049", "#F26B38", "#F7DB4F", "#2F9599", "#FF4E50", "#FC913A", "#45ADA8"
              ],
              data: data
          }]
      },
    });
  }
  
  
  function createBarChart(data) {
    let barChart = document.getElementById("barChart").getContext("2d");
    let chart = new Chart(barChart, {
      // The type of chart we want to create
      type: 'bar',
  
      // The data for our dataset
      data: {
          labels: ["Shoulders", "Triceps", "Biceps", "Chest", "Back", "Legs", "Abs", "Cardio"],
          datasets: 
          [
            {
              label: 'Time (Minutes)',
              backgroundColor: "#2F9599",
              borderColor: "#2F9599",
              data: data.time
            },
            {
              label: 'Reps',
              backgroundColor: "#FF4E50",
              borderColor: "#FF4E50",
              data: data.reps
            },
            {
              label: 'Sets',
              backgroundColor: "#FC913A",
              borderColor: "#FC913A",
              data: data.sets
            },
            {
              label: 'Weight (kilograms)',
              backgroundColor: "#F26B38",
              borderColor: "#F26B38",
              data: data.weight
            },
            {
              label: 'Distance (kilometers)',
              backgroundColor: "#EC2049",
              borderColor: "#EC2049",
              data: data.distance
            }
          ]
      },
    });
  }
  
  function pieChartInitSearch(searchType, fuse) {
    const length = fuse.search(`=${searchType}`).length;
    if (length) return { label: searchType, data: length };
    return null;
  }
  
  function pieChartInit(workouts) {
    let labels = [];
    let data = [];
    const fuse = new Fuse(workouts, {useExtendedSearch: true, keys: ['type']});
    const types = ["Shoulders", "Triceps", "Biceps", "Chest", "Back", "Legs", "Abs", "Cardio"];
    types.forEach(element => {
      const returnObj = pieChartInitSearch(element, fuse);
      if (returnObj) {
        labels.push(returnObj.label);
        data.push(returnObj.data);
      }
    });
    createPieChart(labels, data);
  }
  
  function barChartInitSearch(searchType, fuse) {
    let time = 0;
    let weight = 0;
    let sets = 0;
    let reps = 0;
    let distance = 0;
    const result = fuse.search(`=${searchType}`);
    if (result.length) {
      result.forEach(obj => {
        let element = obj.item;
        time += Number(element.time);
        if (searchType != "Cardio") {
          weight += Number(element.weight);
          reps += Number(element.reps);
          sets += Number(element.sets);
        } else {
          distance += Number(element.distance);
        }
      });
    }
    return { time, weight, sets, reps, distance };
  }
  
  function barChartInit(workouts) {
    let data = {
      time: [],
      weight: [],
      sets: [],
      reps: [],
      distance: []
    }
    const fuse = new Fuse(workouts, {useExtendedSearch: true, keys: ['type']});
    const types = ["Shoulders", "Triceps", "Biceps", "Chest", "Back", "Legs", "Abs", "Cardio"];
    types.forEach(element => {
      const returnObj = barChartInitSearch(element, fuse);
      data.time.push(returnObj.time);
      data.weight.push(returnObj.weight);
      data.sets.push(returnObj.sets);
      data.reps.push(returnObj.reps);
      data.distance.push(returnObj.distance);
    });
    createBarChart(data);
  }
  
  $("document").ready(function() {
    const cookieArr = document.cookie.split(/=|;/);
    cookieArr.forEach((element, index) => {
      if (element.trim() == "username") {
        $("#navbar-username").text(cookieArr[index + 1]);
        return; 
      }
    });
  
    const response = API.getPreviousWorkouts();
    response.then(result => {
      barChartInit(result.data.workouts);
      pieChartInit(result.data.workouts);
    }).catch(err => {
      console.log(err);
    }) 
  
  });