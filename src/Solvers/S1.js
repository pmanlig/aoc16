import Solver from './Solver';

export class S1a extends Solver {
	solve(input) {
		let steps = input.split(", ");
		let face = 0;
		let pos = { x: 0, y: 0 };
		let dir = [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }];
		let twice = null;
		let grid = [[]];
		grid[0][0] = 1;
		for (let i = 0; i < steps.length; i++) {
			if (steps[i][0] === 'L') {
				face = (face + 3) % 4;
			} else {
				face = (face + 1) % 4;
			}
			let dist = parseInt(steps[i].substring(1), 10);
			while (dist > 0) {
				dist--;
				if (dir[face].x !== 0) {
					pos.x += dir[face].x;
				} else {
					pos.y += dir[face].y;
				}
				if (grid[pos.x] === undefined) { grid[pos.x] = []; }
				if (twice === null && grid[pos.x][pos.y] === 1) {
					twice = { x: pos.x, y: pos.y }
				} else {
					grid[pos.x][pos.y] = 1;
				}
			}
		}
		this.setState({ solution: `Steps: ${steps.length}\nFinal position: <${pos.x}, ${pos.y}>\nDistance: ${Math.abs(pos.x) + Math.abs(pos.y)}\nHQ location: <${twice.x}, ${twice.y}>\nDistance:  ${Math.abs(twice.x) + Math.abs(twice.y)}` });
	}
}

export class S1b extends Solver {
}