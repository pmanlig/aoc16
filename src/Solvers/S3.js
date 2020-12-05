// import React from 'react';
import Solver from './Solver';

export class S3a extends Solver {
	possible(t) {
		if (t[0] + t[1] <= t[2]) return false;
		if (t[0] + t[2] <= t[1]) return false;
		if (t[2] + t[1] <= t[0]) return false;
		return true;
	}

	solve(input) {
		input = input.split('\n').map(t => t.split("  ").map(i => parseInt(i, 10)).filter(x => !isNaN(x)));
		let decoded = [];
		for (let i = 0; i < input.length; i += 3) {
			for (let j = 0; j < 3; j++) {
				decoded.push([input[i][j], input[i + 1][j], input[i + 2][j]]);
			}
		}
		this.setState({ solution: `Lines: ${input.length}\nPossible(1): ${input.filter(t => this.possible(t)).length}\nPossible(2): ${decoded.filter(t => this.possible(t)).length}` });
	}
}

export class S3b extends Solver {
}