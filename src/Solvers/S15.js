//import React from 'react';
import Solver from './Solver';

class Disc {
	constructor(id, positions, start) {
		this.id = id;
		this.positions = positions;
		this.start = start;
	}

	static fromText(txt) {
		let params = txt.match(/^Disc #(\d) has (\d+) positions; at time=0, it is at position (\d+).$/);
		return new Disc(parseInt(params[1], 10), parseInt(params[2], 10), parseInt(params[3], 10));
	}

	test(time) {
		return (this.start + time + this.id) % this.positions === 0;
	}
}

export class S15a extends Solver {
	solve(input) {
		let discs = input.split('\n').map(l => Disc.fromText(l));
		let time = 0;
		while (true) {
			let i = 0;
			while (i < discs.length) {
				if (!discs[i].test(time)) { break; }
				i++;
			}
			if (i === discs.length) { break; }
			time++;
		}
		this.setState({ solution: `Time: ${time}` });
	}
}

export class S15b extends Solver {
	solve(input) {
		let discs = input.split('\n').map(l => Disc.fromText(l));
		discs.push(new Disc(discs.length + 1, 11, 0));
		let time = 0;
		while (true) {
			let i = 0;
			while (i < discs.length) {
				if (!discs[i].test(time)) { break; }
				i++;
			}
			if (i === discs.length) { break; }
			time++;
		}
		this.setState({ solution: `Time: ${time}` });
	}
}