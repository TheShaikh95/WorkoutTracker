const API = {
    async getPreviousWorkouts() {
      let res;
      try {
        res = await fetch("/api/workouts/getPrevious");
      } catch (err) {
        console.log(err)
      }
      const json = await res.json();
      return json;
    },
    async addExercise(data) {
      const res = await fetch("/api/workout/add", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
  
      const json = await res.json();
  
      return json;
    },
    
    async deleteExercise(data) {
      const res = await fetch("/api/workouts/delete", {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
  
      const json = await res.json();
  
      return json;
    }
  };