const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const datebasePath = path.join(__dirname, "circketTeam.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: datebasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDBObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jersyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//get all players details
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      * 
    FROM 
      cricket_team;`;
  const playerArray = await datab.all(getPlayersQuery);
  response.send(
    playerArray.map((eachPlayer) => {
      convertDBObjectToResponseObject(eachPlayer);
    })
  );
});

//get single player with id
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT * FROM 
      cricket_team
    WHERE 
      player_id = ${playerId}`;
  const player = await database.get(getPlayerQuery);
  response.send(convertDBObjectToResponseObject(player));
});

//create new player
app.post("/players/", async (request, response) => {
  const { player_name, jersey_number, role } = request.body;
  const playerQuery = `
    INSERT INTO cricket_team (player_name, jersey_number, role)
    VALUES
    ${player_name},
    ${jersey_number},
    ${role}`;
  const player = await db.run(playerQuery);
  response.send("Player Added to Team");
});

//update players details
app.put("/player/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { player_name, jersey_number, role } = request.body;
  const updatePlayerQuery = `
    UPDATE 
        cricket_team
    SET
        player_name = ${player_name},
        jersey_number = ${jersey_number},
        role = ${role}
    WHERE 
        player_id = ${playerId}`;
  await database.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//Delete a player from list
app.delete("/player/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
        cricket_team
    WHERE
        player_id = ${playerId}`;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
