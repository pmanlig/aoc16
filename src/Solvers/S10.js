//import React from 'react';
import Solver from './Solver';

class Destination {
	constructor(type, id) {
		this.type = type;
		this.id = id;
	}
}

class Bot {
	constructor(low, high) {
		this.low = low;
		this.high = high;
		this.chips = [];
	}
}

export class S10a extends Solver {
	findBot() {
		return 0;
	}

	createBot(rule) {
		let params = rule.match(/^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/);
		let d1 = new Destination(params[2], parseInt(params[3], 10)), d2 = new Destination(params[4], parseInt(params[5], 10));
		this.bots[parseInt(params[1], 10)] = new Bot(d1, d2);
	}

	assignValue(val, dest) {
		if (dest.type === "bot") {
			let bot = this.bots[dest.id];
			bot.chips.push(val);
			if (bot.chips.length === 2) {
				this.assignValue(Math.min(...bot.chips), bot.low);
				this.assignValue(Math.max(...bot.chips), bot.high);
				if (Math.min(...bot.chips) === 17 && Math.max(...bot.chips) === 61) { this.botID = dest.id; }
				bot.chips = [];
			}
		} else {
			this.output[dest.id] = val;
		}
	}

	assign(rule) {
		let params = rule.match(/^value (\d+) goes to (bot|output) (\d+)/);
		let val = parseInt(params[1], 10);
		let d = new Destination(params[2], parseInt(params[3], 10));
		this.assignValue(val, d);
	}

	solve(input) {
		input = input.split('\n');
		this.botID = -1;
		this.bots = [];
		this.output = [];
		input.filter(s => s.startsWith("bot ")).forEach(r => this.createBot(r));
		input.filter(s => s.startsWith("value ")).forEach(r => this.assign(r));
		this.setState({ solution: `Bot #: ${this.botID}\nResult: ${this.output[0]*this.output[1]*this.output[2]}` });
	}
}

export class S10b extends Solver {
}