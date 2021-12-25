//import React from 'react';
import Solver from './Solver';
import { md5 } from '../util';

class Path {
	constructor(x, y, code, path) {
		this.x = x;
		this.y = y;
		this.code = code;
		this.path = path;
		this.score = 6 - x - y + path.length;
	}

	isGoal() {
		return this.x === 3 && this.y === 3;
	}

	md5() {
		return md5(this.code + this.path);
	}
}

export class S17a extends Solver {
	step(c, active) {
		let doors = c.md5();
		if (c.y > 0 && /^[b-f]....*$/.test(doors)) {
			active.push(new Path(c.x, c.y - 1, c.code, c.path + "U"));
		}
		if (c.y < 3 && /^.[b-f]...*$/.test(doors)) {
			active.push(new Path(c.x, c.y + 1, c.code, c.path + "D"));
		}
		if (c.x > 0 && /^..[b-f]..*$/.test(doors)) {
			active.push(new Path(c.x - 1, c.y, c.code, c.path + "L"));
		}
		if (c.x < 3 && /^...[b-f].*$/.test(doors)) {
			active.push(new Path(c.x + 1, c.y, c.code, c.path + "R"));
		}
		active.sort((a, b) => b.score - a.score);
		return active;
	}

	findPath(input) {
		let active = [new Path(0, 0, input, "")];
		let shortest = null, longest;
		while (active.length > 0) {
			let c = active.pop();
			if (c.isGoal()) {
				longest = c;
				if (null == shortest) { shortest = c; }
			} else {
				active = this.step(c, active);
			}
		}
		return { longest: longest, shortest: shortest }
	}

	solve(input) {
		let sol = this.findPath(input);
		this.setState({ solution: `Shortest path: ${sol.shortest.path}\nLongest path: ${sol.longest.path.length}` });
	}
}

export class S17b extends Solver {
}