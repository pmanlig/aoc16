// import React from 'react';
import Solver from './Solver';

class Map {
	constructor(tiles) {
		this.data = [tiles];
	}

	isTrap(left, center, right) {
		return (left && center && !right) ||
			(!left && center && right) ||
			(left && !center && !right) ||
			(!left && !center && right);
	}

	generateRow() {
		let p = this.data[this.data.length - 1];
		let row = [];
		let i;
		let left = false;
		for (i = 0; i < p.length - 1; i++) {
			row[i] = this.isTrap(left, p[i] === '^', p[i + 1] === '^') ? '^' : '.';
			left = p[i] === '^';
		}
		row[i] = this.isTrap(left, p[i] === '^', false) ? '^' : '.';
		this.data.push(row);
	}

	countSafe() {
		return this.data.map(l => l.filter(c => c === '.').length).reduce((a, b) => a + b, 0);
	}

	toString() {
		return this.data.map(l => l.join('')).join('\n');
	}
}

export class S18a extends Solver {
	solve(input) {
		/*
		let test = new Map(".^^.^.^^^^".split(''));
		console.log(test.isTrap(false, false, true));
		for (let n = 1; n < 10; n++) { test.generateRow(); }
		console.log(test.toString() + "\n\n", test.countSafe());
		//*/
		let start = Date.now();
		let map = new Map(input.split(''));
		while (map.data.length < 40) { map.generateRow(); }
		let smallSafe = map.countSafe();
		while (map.data.length < 400000) { map.generateRow(); }
		let largeSafe = map.countSafe();
		// console.log(map.toString() + "\n\n");
		this.setState({ solution: `Safe tiles (small): ${smallSafe}\nSafe tiles (large): ${largeSafe}\nTime: ${(Date.now() - start)/1000} s` });
	}
}

export class S18b extends Solver {
}
