const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const serverPort = process.env.SERVER_PORT || 3001
const app = express();
app.use(cors());

const DBSOURCE = "shipping-tracking.sqlite"
const TABLE = "shipping";
const MAX_LABEL_ID_LENGTH = 11;
const RECORD_LIMIT = 100;

const db = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
	  // Cannot open database
	  console.error(err.message);
	  throw err;
	}
});

app.get("/shipping-code/:label_id", (req, res) => {
  // allow only numbers and hyphens
  const cleanedLabelId =
    req.params.label_id.slice(0, MAX_LABEL_ID_LENGTH).replace(/[^0-9-]/g, '');
  // starts with
  const sql = `SELECT * FROM ${TABLE} \
    WHERE label_id LIKE "${cleanedLabelId}%" \
    LIMIT ${RECORD_LIMIT};`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
        "message": "Query successful",
        "data": rows
    });
  });
});

const startServer = () => {
  app.listen(serverPort, () => {
    console.log(`App listening on serverPort ${serverPort}`);
  });
};

startServer();