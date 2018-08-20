/* 	This script contain the codes of connecting to a
	Mongo db database named 'studentInformation' and a collection
	named 'studentInfo'. 
	The program connects, post and edit an information added.
*/

//we need to import a module called 'mongodb' which is already installed using
//'npm install mongodb' command. The module allow us to connect to the mongodb
//database.
//To use this file, we say
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; //MongoClient attribute allow us to connect to the Mongodb database
const url = 'mongodb://localhost:27017/studentInformation'; //connection url

//we use .connect method to connect to the server (database);
MongoClient.connect(url, (err, db) => {
	//handle error first
	if(err) {
		console.log('Ooops! Error connecting to database ' + err.message);
		return process.exit(1) //to exit process
	}
		//then handle success
		console.log('Congratulations. You have successfully connected to the server!');
		//callback that insert records
			insertInfo(db, () =>{ 
				readAllRecords(db, () => {  
					readSpecificRecords(db, () => {
						updateRecord(db, () => {
							removeRecord(db, () => {
								db.close();
								});

							});
						});
					});
				});
		//callback that find all records
})
	
/* (1) Insertion
	Here we are going to post into the database. To do this, we must have create a database
	using use <database_name>. e.g. use studentInformation. This database is automatically created if it is not there before.
	We will then create a collection (table) using db.createCollection(collectionName) e.g. db.createCollection(studentResult).
	Hence, we can the post into the collection using a object like syntax.
*/
	//declare the name as constant since I would be using all through the program
		const name = 'Suleiman Ozigis'
//insertion is done using insert() method with a callback which is processed asychronously.
//here we go
	const insertInfo = (db, callback) => {
		//get collection in which we will like to post the info
		const dbCollection = db.collection('studentRecordUsingCRUD');
		
		dbCollection.insert([
				{ 
				  name: name,
				  age: 22,
				  address: 'Lokoja, Kogi State',
				  school: 'Bayero University Kano',
				  department: 'Computer Science',
				  faculty: 'Faculty of Computer Science and Information Technology',
				  "next of kin": {
				  	name: 'Faiza Ozigis',
				  	address: 'Same as above',
				  	relationship: 'Sister'
				  }
				}
			], (error, result) => {
				if(error) {
					return console.log('Error encountered during insertion ' + error.message);
					process.exit(1);
				}
				console.log('\n**Insertion Result**');
				console.log('Your record were added successfully to ' + url.substring(26) + ' database');
				console.log('Number of documents inserted: ' + result.result.n);
				console.log('Number of operations performed: ' + result.ops.length);
				//console.log(result);
				
				dbCollection.find({"_id":{"$in":result.insertedIds}}).toArray((error, docs) => {
	
				//dbCollection.find({"_id":result.insertedId}).toArray((error, docs) => {
					//handle error first
					if(error) {
						return console.log('Error ' + error.message);
						process.exit(1);
					} console.log(docs);
					callback(docs);
				});
			
			})
	}

/* (2){i} READ  -- read all records in the collection
	Here we are going to read the object we created, using find() method. 
	We will find all items and also read based on a certain criteria.
	*/
	//Here we go
		const readAllRecords = (db, callback) => {
			//get the collection which we would like to read from
			const dbCollection = db.collection('studentRecordUsingCRUD');
			//
			dbCollection.find().toArray((error, result) => {
				if(error) {
					return console.log('Error retrieving records ' + error.message);
					process.exit(1);
				} 
					console.log("\n***Reading All Entries Result***")
					console.log(result.length + ' records found!');
					console.log(result);
					callback(result);
					
			})
		}

/* (2){ii} READ -- read base on a specific
	Here we are going to read the object based on a certain criteria
*/
	const readSpecificRecords = (db, callback) => {
		//get the collection which we would like to read from
		const dbCollection = db.collection('studentRecordUsingCRUD');
		dbCollection.find({name: name}).toArray((error, doc) => {
			if(error) {
				return console.log('Error retrieving ' + error.message);
				process.exit(1);
			} 
				console.log('\n***Read Specific Entry Result***')
				console.log(doc.length + ' related record(s) found');
				console.dir(doc);
				callback(doc);
		})
	}

/* (3) UPDATE: Update an existing doc based on a certain criteria
		Here we are going to update the department to 'Computer Science with Economics'
*/
	const updateRecord = (db, callback) => {
		//get the collection from which we would like to update
		const dbCollection = db.collection('studentRecordUsingCRUD');
		dbCollection.update({name: name}, {$set: {department: 'Computer Science with Economics'}}, (error, result) => {
			if(error) {
				return console.log('Error updating record ' +  error.message);
				process.exit(1);
			} 
				console.log('\n**Update Record Result**');
				console.log('Record updated succesfully');
				console.log('Number of matched result: ' + result.result.n);
				console.log('Number of modified item: ' + result.result.nModified);
				console.log('Updated ' + name + ' department \'s' + ' to Computer Science with Economics');
				dbCollection.find({department:'Computer Science with Economics'}).toArray((error, docs) => {
					if(error) {
						return console.log('Ooops error encountered during retrieval ' + error.message);
						process.exit(1);
					}
						console.log(docs);
				callback(result);
		})
	})
}

/* (4) DELETE: Delete an existing doc. The deletion which is the "D" part of CRUD. 
	Here, we are going to delete the record, we inserted initially. 
	This is going to be done using .remove() method of MongoDB
*/
const removeRecord = (db, callback) => {
		//get the collection from which we would like to delete from.
		const dbCollection = db.collection('studentRecordUsingCRUD');
		dbCollection.remove({name:name},(error, result) => {
			if(error) {
				return console.log('Error removing item: ' + error.message);
				process.exit(1);
			}
				console.log('\n***Delete Record Result***')
				console.log('Number of records removed ' + result.result.n);
				console.log(name + ' records was successfully removed');
				callback(result);
		})
}