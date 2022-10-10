import React from 'react';
import Solver from './Solver';
import { PixelMap } from '../util';

class State {
	constructor(x, y, steps) {
		this.x = x;
		this.y = y;
		this.steps = steps;
	}

	generateMove(x, y, map) {
		if (x < 0 || y < 0 || y >= map.length || x >= map[y].length) { return null; }
		if (this.steps.some(s => s.x === x && s.y === y)) { return null; }
		if (map[y][x].used > 100) { return null; }
		return new State(x, y, this.steps.concat([this]));
	}

	moves(map) {
		return [
			this.generateMove(this.x - 1, this.y, map),
			this.generateMove(this.x + 1, this.y, map),
			this.generateMove(this.x, this.y - 1, map),
			this.generateMove(this.x, this.y + 1, map)
		].filter(m => m !== null);
	}
}

class Search {
	constructor(initial, map) {
		this.queue = [initial];
		this.map = map;
		this.distMap = map.map(l => l.map(c => null));
	}

	find() {
		let distMap = this.map.map(l => l.map(c => null));
		let test = (p, map) => {
			if (p.steps.length === 0) { return false; }
			let cell = map[p.y][p.x];
			let last = p.steps[p.steps.length - 1];
			last = map[last.y][last.x];
			return last.used + cell.used <= cell.size;
		}
		let sorter = (a, b) => {
			return b.steps.length - a.steps.length
		}
		let distFilter = m => (distMap[m.y][m.x] === null) || m.steps.length < distMap[m.y][m.x];
		let pot = this.queue.pop();
		while (!test(pot, this.map)) {
			let mv = pot.moves(this.map);
			mv = mv.filter(distFilter);
			mv.forEach(m => distMap[m.y][m.x] = m.steps.length);
			this.queue = this.queue.concat(mv);
			this.queue.sort(sorter);
			pot = this.queue.pop();
		}
		return pot;
	}
}

export class S22a extends Solver {
	constructor(props) {
		super(props);
		this.canvas = React.createRef();
		this.state = { viablePairs: 0, shortestPath: 0 };
	}

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
		let count = 0, potentials = [];
		for (let i = 0; i < nodes.length; i++) {
			for (let j = 0; j < nodes.length; j++) {
				if (i !== j && nodes[i].used > 0 && nodes[i].used <= nodes[j].avail) {
					count++;
					let from = nodes[i];
					let to = nodes[j];
					if ((Math.abs(from.x - to.x) === 1 && from.y === to.y) || (from.x === to.x && Math.abs(from.y - to.y) === 1)) {
						potentials.push({ from: from, to: to });
					}
				}
			}
		}
		let grid = [];
		nodes.forEach(n => {
			if (grid[n.y] === undefined) { grid[n.y] = [] }
			grid[n.y][n.x] = n;
		});
		let pixelMap = new PixelMap(this.canvas.current.getContext('2d'), 10);
		let usefulData = grid[0][grid[0].length - 1];
		let features = grid.map(l => l.map(c => c.size < usefulData.used ? 2 : (c.used > 100 ? 1 : 0)));
		pixelMap.drawMap(features, ["#CCCCCC", "#770000", "#000000", "#FFFFFF"]);
		potentials.forEach(p => {
			pixelMap.drawPixel(p.from.x, p.from.y, "#7777FF");
			pixelMap.drawPixel(p.to.x, p.to.y, "#77FF77");
		});
		pixelMap.drawPixel(usefulData.x, usefulData.y, "#FF7777");
		let search = new Search(new State(usefulData.x, usefulData.y, []), grid);
		let path = search.find();
		this.setState({ viablePairs: count, shortestPath: path.steps.length + 5 * (usefulData.x - 1) });
	}

	customRender() {
		return <div>
			<p>Viable pairs: {this.state.viablePairs}</p>
			<p>Shortest path: {this.state.shortestPath}</p>
			<canvas id="canvas" ref={this.canvas} width="1000" height="500" />
		</div>
	}
}

export class S22b extends Solver {
}