// import React from 'react';
import Solver from './Solver';

class State {
	constructor(x, y, steps, remaining) {
		this.x = x;
		this.y = y;
		this.steps = steps;
	}

	static findOrigin(map) {
		let targets = [];
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				if (map[y][x] !== '#' && map[y][x] !== '.') {
					let num = parseInt(map[y][x], 10);
					targets[num] = [x, y];
				}
			}
		}
	}
}

export class S24a extends Solver {
	solve(input) {
		let map = input.split('\n').map(s => s.split(''));
		let queue = [State.findOrigin(map)];
		console.log(map, queue);
		this.setState({ solution: "No solution yet" });
	}
}

export class S24b extends Solver {
}