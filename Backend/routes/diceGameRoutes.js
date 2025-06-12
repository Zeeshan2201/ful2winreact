const express = require("express");
const router = express.Router();
const DiceGame = require("../models/DiceGame");

router.get("/room/:roomId", async (req, res) => {
  try {
    const game = await DiceGame.findOne({ roomId: req.params.roomId });
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const gameData = req.body;
    // console.log("Creating game with data:", gameData);

    // Use findOneAndUpdate with upsert for atomic operation
    const game = await DiceGame.findOneAndUpdate(
      { roomId: gameData.roomId },
      gameData,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );

    // console.log("Game created/updated:", game._id);
    req.io.emit("diceGameCreated", game);
    res.status(201).json(game);
  } catch (error) {
    // console.error("Error creating/updating game:", error);
    if (error.code === 11000) {
      // If we still get a duplicate key error, try to fetch the existing game
      try {
        const existingGame = await DiceGame.findOne({ roomId: gameData.roomId });
        if (existingGame) {
          req.io.emit("diceGameCreated", existingGame);
          return res.status(200).json(existingGame);
        }
      } catch (fetchError) {
        // console.error("Error fetching existing game:", fetchError);
      }
    }
    res.status(500).json({ error: error.message });
  }
});

router.put("/move/:gameId", async (req, res) => {
  try {
    const { playerId, roll } = req.body;
    const game = await DiceGame.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    const currentRound = game.rounds.find((r) => r.roundNumber === game.currentRound);
    if (!currentRound) {
      return res.status(400).json({ error: "Invalid round" });
    }
    // Enforce strict turn order
    if (
      (game.player1.playerId === playerId && typeof currentRound.player1Roll === 'number') ||
      (game.player2.playerId === playerId && typeof currentRound.player2Roll === 'number')
    ) {
      return res.status(400).json({ error: "You have already rolled this round." });
    }
    if (game.player1.playerId === playerId) {
      currentRound.player1Roll = roll;
    } else if (game.player2.playerId === playerId) {
      currentRound.player2Roll = roll;
    } else {
      return res.status(403).json({ error: "Invalid player" });
    }

    // Check if both players have rolled
    if (typeof currentRound.player1Roll === 'number' && typeof currentRound.player2Roll === 'number') {
      currentRound.showingPoints = true;
      await game.save();
      req.io.emit("diceGameUpdated", game);

      // Add 3-second delay before updating the game state
      setTimeout(async () => {
        try {
          const updatedGame = await DiceGame.findById(req.params.gameId);
          if (!updatedGame) return;

          const updatedRound = updatedGame.rounds.find(r => r.roundNumber === updatedGame.currentRound);
          if (!updatedRound) return;

          // Update round winner and scores
          if (updatedRound.player1Roll > updatedRound.player2Roll) {
            updatedRound.winner = updatedGame.player1.playerId;
            updatedRound.status = "completed";
            if (updatedGame.player1Score < 5) updatedGame.player1Score += 1;
          } else if (updatedRound.player2Roll > updatedRound.player1Roll) {
            updatedRound.winner = updatedGame.player2.playerId;
            updatedRound.status = "completed";
            if (updatedGame.player2Score < 5) updatedGame.player2Score += 1;
          } else {
            updatedRound.winner = null; // Tie
            updatedRound.status = "completed";
          }

          // Move to next round or finish game
          if (updatedGame.currentRound < 5) {
            updatedGame.currentRound += 1;
          } else {
            updatedGame.status = "finished";
            if (updatedGame.player1Score > updatedGame.player2Score) {
              updatedGame.winner = updatedGame.player1.playerId;
            } else if (updatedGame.player2Score > updatedGame.player1Score) {
              updatedGame.winner = updatedGame.player2.playerId;
            } else {
              updatedGame.winner = null; // Tie
            }
          }

          updatedRound.showingPoints = false;
          await updatedGame.save();
          req.io.emit("diceGameUpdated", updatedGame);
        } catch (err) {
          console.error("Error in delayed game update:", err);
        }
      }, 3000);

      return res.json(game);
    }

    await game.save();
    req.io.emit("diceGameUpdated", game);
    res.json(game);
  } catch (error) {
    console.error("Error updating move:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/round/:gameId", async (req, res) => {
  try {
    const { round } = req.body;
    const game = await DiceGame.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    const roundIndex = game.rounds.findIndex((r) => r.roundNumber === round.roundNumber);
    if (roundIndex === -1) {
      return res.status(400).json({ error: "Invalid round" });
    }
    game.rounds[roundIndex] = round;
    await game.save();
    req.io.emit("diceGameUpdated", game);
    res.json(game);
  } catch (error) {
    console.error("Error updating round:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-winner/:gameId", async (req, res) => {
  try {
    const game = await DiceGame.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    game.status = "finished";
    if (game.player1Score > game.player2Score) {
      game.winner = game.player1.playerId;
    } else if (game.player2Score > game.player1Score) {
      game.winner = game.player2.playerId;
    } else {
      game.winner = null; // Tie
    }
    await game.save();
    req.io.emit("diceGameUpdated", game);
    res.json({
      player1Score: game.player1Score,
      player2Score: game.player2Score,
      winnerId: game.winner,
    });
  } catch (error) {
    console.error("Error updating winner:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;