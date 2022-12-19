const sqlite3 = require('sqlite3').verbose();
const data = require('./data/KITS_SHIPPING_DATA.json');
const DBSOURCE = "shipping-tracking.sqlite"
const TABLE = "shipping";

const db = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
	  // Cannot open database
	  console.error(err.message);
	  throw err;
	}
	else {
    console.log('Connected to the SQLite database.');
		dropTable()
		.then(() => createTable())
		.then(() => seedTable())
		.then(() => db.close())
		.catch((err) => {console.log(err)});
	}
});

const dropTable = () => {
	return new Promise((resolve, reject) => {
		db.run(`DROP TABLE if exists ${TABLE}`, (err) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				console.log(`Table ${TABLE} dropped.`);
				resolve();
			}
		});
	});
};

const createTable = () => {
	return new Promise((resolve, reject) => {
			const sql = `CREATE TABLE ${TABLE} (
      id INTEGER PRIMARY KEY,
      label_id text UNIQUE,
      shipping_tracking_code text UNIQUE
      )`;
		db.run(sql, [], (err) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				console.log(`Table ${TABLE} created.`);
				resolve();
			}
		});
	});
};

const insert = (sql) => {
	return new Promise((resolve, reject) => {
		db.run(sql, [], (err) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve();
			}
		});
	});
};

const seedTable = () => {
  const promises = [];
	data.forEach((record) => {
		const sql = `INSERT INTO ${TABLE} (id, label_id, shipping_tracking_code) VALUES (${record.id}, "${record.label_id}", "${record.shipping_tracking_code}")`;
		promises.push(insert(sql));
	});
	Promise.all(promises)
	 .then(() => {
	     console.log(`Success. ${promises.length} records added.`);
	 });
};
