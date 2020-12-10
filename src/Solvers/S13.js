//import React from 'react';
import Solver from './Solver';

function countBits(x) {
	let bits = 0;
	while (x > 0) {
		bits += x&1;
		x = x >> 1;
	}
	return bits;
}

class Map {
	static fromMagic(w, h, m) {
	}
}

export class S13a extends Solver {
	generateMap(w, h, magic) {
	}

	solve(input) {
		let magic = parseInt(input, 10);
		console.log(new Map());
		this.setState({ solution: `Magic number: ${countBits(magic)}` });
	}
}

export class S13b extends Solver {
}