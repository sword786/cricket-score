const apiKey = "01ed9a12-dd02-4e7a-ba69-fedf4e26d13c"; // Replace with your actual CricAPI key

// Fetch live matches and display them
function fetchLiveMatches() {
    fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let scoreboard = document.getElementById('scoreboard');
            scoreboard.innerHTML = ''; // Clear previous content

            if (data && data.data) {
                data.data.forEach(match => {
                    let matchElement = document.createElement('div');
                    matchElement.innerHTML = `
                        <h3>${match.name}</h3>
                        <p><strong>Status:</strong> ${match.status}</p>
                        <p><strong>Teams:</strong> ${match.teams[0]} vs ${match.teams[1]}</p>
                        <button onclick="fetchMatchDetails('${match.id}')">View Scorecard</button>
                        <hr>
                    `;
                    scoreboard.appendChild(matchElement);
                });
            } else {
                scoreboard.innerHTML = "No live matches found.";
            }
        })
        .catch(error => {
            console.error("Error fetching live scores:", error);
            document.getElementById('scoreboard').innerHTML = "Failed to load scores.";
        });
}

// Fetch match details including scorecard, player stats, and commentary
function fetchMatchDetails(matchId) {
    fetch(`https://api.cricapi.com/v1/match_scorecard?apikey=${apiKey}&id=${matchId}`)
        .then(response => response.json())
        .then(data => {
            let detailsSection = document.getElementById('matchDetails');
            detailsSection.innerHTML = ''; // Clear previous details

            if (data && data.data) {
                let match = data.data;
                let scorecardHTML = `
                    <h2>${match.name}</h2>
                    <p><strong>Status:</strong> ${match.status}</p>
                `;

                // Show score for both innings
                match.score.forEach(score => {
                    scorecardHTML += `
                        <h3>${score.inning}</h3>
                        <p><strong>Runs:</strong> ${score.r} / ${score.w} (${score.o} overs)</p>
                    `;
                });

                // Show player stats (batsmen & bowlers)
                if (match.batsmen && match.batsmen.length > 0) {
                    scorecardHTML += `<h3>Batting:</h3><ul>`;
                    match.batsmen.forEach(player => {
                        scorecardHTML += `
                            <li>${player.name} - ${player.runs} Runs (${player.balls} Balls) - SR: ${player.strikeRate}</li>
                        `;
                    });
                    scorecardHTML += `</ul>`;
                }

                if (match.bowlers && match.bowlers.length > 0) {
                    scorecardHTML += `<h3>Bowling:</h3><ul>`;
                    match.bowlers.forEach(player => {
                        scorecardHTML += `
                            <li>${player.name} - ${player.overs} Overs - ${player.wickets} Wickets - Econ: ${player.economy}</li>
                        `;
                    });
                    scorecardHTML += `</ul>`;
                }

                // Show commentary
                if (match.commentary) {
                    scorecardHTML += `<h3>Latest Commentary:</h3><p>${match.commentary}</p>`;
                } else {
                    scorecardHTML += `<h3>Latest Commentary:</h3><p>No commentary available.</p>`;
                }

                scorecardHTML += `<button onclick="fetchLiveMatches()">Back to Matches</button><hr>`;
                detailsSection.innerHTML = scorecardHTML;
            } else {
                detailsSection.innerHTML = "Match details not available.";
            }
        })
        .catch(error => {
            console.error("Error fetching match details:", error);
            document.getElementById('matchDetails').innerHTML = "Failed to load match details.";
        });
}

// Load matches on page load
fetchLiveMatches();
