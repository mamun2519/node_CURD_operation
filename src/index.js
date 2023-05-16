const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const fs = require("fs");
const shortid = require("shortid");

const dbLocation = path.resolve("src", "data.json");

app.use([cors(), express.json()]);

// reUses Funcation

// create data
app.post("/", async (req, res) => {
  try {
    const player = {
      id: shortid.generate(),
      ...req.body,
    };

    fs.readFile(dbLocation, async (err, data) => {
      if (err) {
        res.status(400).send({ succes: false, message: "Something is wrong" });
      }

      const allPlayer = JSON.parse(data);
      console.log(allPlayer);
      allPlayer.push(player);
      fs.writeFile(dbLocation, JSON.stringify(allPlayer), (err) => {
        if (err) {
          res
            .status(400)
            .send({ succes: false, message: "Something is wrong" });
        }
        res.status(201).json(player);
      });
    });
  } catch (e) {
    console.log(e);
  }
});

// all data read to file
app.get("/", (req, res, next) => {
  fs.readFile(dbLocation, (err, data) => {
    if (err) {
      res.status(400).send({ succes: false, message: "Something is wrong" });
    }
    const players = JSON.parse(data);
    res.status(201).json({ success: true, players });
  });
});

// get single data to file
app.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  fs.readFile(dbLocation, (err, data) => {
    if (err) {
      res.status(400).send({ succes: false, message: "Something is wrong" });
    }
    const players = JSON.parse(data);
    const player = players.find((item) => item.id == id);

    if (!player) {
      return res
        .status(404)
        .send({ succes: false, message: "player not found" });
    }

    res.status(201).json({ success: true, player });
  });
});

// update data to file 
app.put("/:id" , (req , res , next) =>{
      fs.readFile(dbLocation, (err, data) => {
            if (err) {
              res.status(400).send({ succes: false, message: "Something is wrong" });
            }
            const players = JSON.parse(data);
            // res.status(201).json({ success: true, players });
            const player = players.find((item) => item.id == req.params.id);
            if (!player) {
              return res
                .status(404)
                .send({ succes: false, message: "player not found" });
            }
            player.name = req.body.name || player.name
            player.experts = req.body.experts || player.experts

            fs.writeFile(dbLocation, JSON.stringify(players) , (err) =>{
                  if(err){
                        res.status(400).send({ succes: false, message: "Something is wrong" });

                  }
                  res.status(202).send({success: true, message: "player update sucessfull", player})
            })
          });
})

app.delete("/:id", (req , res) =>{
      fs.readFile(dbLocation, (err, data) => {
            if (err) {
              res.status(400).send({ succes: false, message: "Something is wrong" });
            }
            const players = JSON.parse(data);
            const newUserList = players.filter((item) => item.id !== req.params.id)
            console.log(newUserList)

            fs.writeFile(dbLocation, JSON.stringify(newUserList) , (err) =>{
                  if (err) {
                        res.status(400).send({ succes: false, message: "Something is wrong" });
                      } 

                      res.status(201).json({success: true, message: "Player Delete Successfull"})
            })
           

      })

})

app.get("/health", (req, res) => {
  res.status(200).json({ succes: true, message: "Server Is runing" });
});

app.listen(port, () => console.log("Server is run port no", port));
