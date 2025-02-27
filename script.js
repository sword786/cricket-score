fetch('https://api.cricapi.com/v1/currentMatches?apikey=01ed9a12-dd02-4e7a-ba69-fedf4e26d13c')
  .then(response => response.json())
  .then(data => {
      let scoreboard = document.getElementById('scoreboard');
      if (data && data.data) {
          let matches = data.data.map(match => `
              <p><strong>${match.name}</strong> - ${match.status}</p>
          `).join('');
          scoreboard.innerHTML = matches;
      } else {
          scoreboard.innerHTML = "No live matches found.";
      }
  })
  .catch(error => {
      console.error("Error fetching live scores:", error);
      document.getElementById('scoreboard').innerHTML = "Failed to load scores.";
  });
