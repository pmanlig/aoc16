// import React from 'react';
import Solver from './Solver';

export class S22a extends Solver {
	solve(input) {
		let globalRegex = /node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/g;
		let localRegex = /node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/;
		let nodes = input.match(globalRegex);
		nodes = nodes.map(l => localRegex.exec(l).slice(1).map(x => parseInt(x, 10))).map(a => ({
			x: a[0],
			y: a[1],
			size: a[2],
			used: a[3],
			avail: a[4],
			usePct: a[5]
		}));
		let count = 0;
		for (let i = 0; i < nodes.length; i++) {
			for (let j = 0; j < nodes.length; j++) {
				if (i !== j && nodes[i].used > 0 && nodes[i].used <= nodes[j].avail) count++;
			}
		}
		let grid = [];
		nodes.forEach(n => {
			if (grid[n.x] === undefined) {grid[n.x] = []}
			grid[n.x][n.y] = n;
		});
		console.log(grid);
		this.setState({ solution: `Viable pairs: ${count}` });
	}
}

export class S22b extends Solver {
}