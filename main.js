// Description: Project 6 for CIS 104
// Author: Arkadiusz Bregula (bregulaa@student.ncmich.edu)
// Version: 1.0.0

'use strict';

const PROMPT = require('readline-sync');
const fs = require('fs');
const path = require('path');

const DATA_DIRECTORY = "./data/";
const MASTER_FILE = path.join(__dirname, DATA_DIRECTORY, 'master.csv');

let masterList = [];
let transactionList = [];

/**
 * The main dispatcher function for the program.
 */
function main() {
	setMasterList();

	setTransactionList();
	processTransactionList();
	outputEmployeeDetails();
}

/**
 * Reads the master file and sets the masterList variable.
 */
function setMasterList() {
	var csvData = readCsv(MASTER_FILE);
	for(let i = 0; i < csvData.length; i++) {
		var client = {
			'id': csvData[i][0],
			'firstName': csvData[i][1],
			'lastName': csvData[i][2],
			'address': csvData[i][3],
			'hourlyWage': Number(csvData[i][4]),
			'weeklyEarnings': 0
		};
		masterList.push(client);
	}
}

/**
 * Reads a csv file located at filepath and returns an array of the rows and columns.
 * @param  {String} filepath The path to the csv file.
 * @return {Array}           The csv file stored as a two dimensional array.
 */
function readCsv(filepath) {
	let fileContent = fs.readFileSync(filepath, 'utf-8');
	let lines = fileContent.split('\n');
	let colCount = 0;

	let csvData = [];

	for(let i = 0; i < lines.length; i++) {
		let line = lines[i].trim();

		if(line == '') { continue; }

		let columns = line.split(',');

		if(colCount == 0) { colCount = columns.length; }

		if(columns.length == colCount) {
			csvData.push(columns);
		}
	}

	return csvData;
}

/**
 * Finds and reads all the transaction files in the program's data directory and sets the transactionList variable.
 */
function setTransactionList() {
	let files = fs.readdirSync('./data/');
	for(let i = 0; i < files.length; i++) {
		if(files[i].startsWith('trans_')) {
			let filename = files[i].split('_');

			let transactionData = readCsv(`./data/${files[i]}`);

			for(let i = 0; i < transactionData.length; i++) {
				let jobNumber = transactionData[i][0];
				let address = transactionData[i][1];
				let employerName = transactionData[i][2];
				let employeeId = transactionData[i][3];
				let hoursWorked = Number(transactionData[i][4]);

				transactionList.push({
					jobNumber,
					address,
					employerName,
					employeeId,
					hoursWorked,
				});
			}
		}
	}
}

/**
 * Outputs details about every transaction, and adds the gross pay to every employee's weekly earnings.
 */
function processTransactionList() {
	console.log("This Week's Transactions: ");
	for(let i = 0; i < transactionList.length; i++) {
		let employee = masterList.find(employee => employee.id == transactionList[i].employeeId);
		if(employee != undefined) {
			let grossPay = Number(transactionList[i].hoursWorked) * Number(employee.hourlyWage);
			masterList[masterList.indexOf(employee)].weeklyEarnings += grossPay;
			console.log(` - [Job #${transactionList[i].jobNumber}] ${transactionList[i].hoursWorked} hours worked by ${employee.id} for $${employee.hourlyWage}/hr. Pay: $${grossPay}`);
		}
	}
}

/**
 * Output every employee's weekly earnings.
 */
function outputEmployeeDetails() {
	console.log('\n--------------------------------------------------');
	console.log('Employee Earnings: ');
	for(let i = 0; i < masterList.length; i++) {
		let employee = masterList[i];
		console.log(` - [#${employee.id}, ${employee.firstName} ${employee.lastName}] Weekly Earnings: $${employee.weeklyEarnings.toFixed(2)}`);
	}
}

main();