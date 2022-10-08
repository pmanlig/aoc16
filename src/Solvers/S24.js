// import React from 'react';
import React from 'react';
import Solver from './Solver';
import { drawFilledRect } from '../util';

class AsciiMap {
	static pixel_size = 6;
	static styles = {
		'#': "#000000",
		'.': "#FFFFFF",
		'0': "#FFAAAA",
		'1': "#AAFFAA",
		'2': "#AAAAFF",
		'3': "#999999",
		'4': "#990000",
		'5': "#009900",
		'6': "#000099",
		'7': "#FF0000",
		'8': "#00FF00",
		'9': "#0000FF",
	}

	data = [];

	constructor(input) {
		this.data = input.split('\n').map(s => s.split(''));
	}

	valid(x, y) {
		return (y >= 0 && y < this.data.length && x >= 0 && x < this.data[y].length);
	}

	at(x, y) {
		return this.data[y][x];
	}

	forEach(op) {
		let map = this.data;
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				op(x, y, map[y][x])
			}
		}
	}

	draw(ctx) {
		this.forEach((x, y, d) =>
			drawFilledRect(ctx,
				AsciiMap.pixel_size * x, AsciiMap.pixel_size * y,
				AsciiMap.pixel_size * (x + 1), AsciiMap.pixel_size * (y + 1),
				AsciiMap.styles[d]));
	}

	drawPath(ctx, path) {
		path.forEach(s =>
			drawFilledRect(ctx,
				AsciiMap.pixel_size * s.x, AsciiMap.pixel_size * s.y,
				AsciiMap.pixel_size * (s.x + 1), AsciiMap.pixel_size * (s.y + 1),
				"#7777FF"));
	}
}

class DistanceMap {
	data = [];

	constructor(map) {
		this.data = map.data.map(l => l.map(x => null));
	}

	at(x, y) {
		return this.data[y][x];
	}

	set(x, y, d) {
		this.data[y][x] = d;
	}
}

class State {
	constructor(x, y, steps) {
		this.x = x;
		this.y = y;
		this.steps = steps;
	}

	tryAddMove(x, y, map, mv) {
		if (map.valid(x, y) && map.at(x, y) !== '#') {
			if (!this.steps.some(s => s.x === x && s.y === y)) {
				mv.push(new State(x, y, this.steps.concat([this])));
			}
		}
	}

	moves(map) {
		let mv = [];
		this.tryAddMove(this.x - 1, this.y, map, mv);
		this.tryAddMove(this.x + 1, this.y, map, mv);
		this.tryAddMove(this.x, this.y - 1, map, mv);
		this.tryAddMove(this.x, this.y + 1, map, mv);
		return mv;
	}

	weight(tgt) {
		return this.steps.length + Math.abs(tgt.x - this.x) + Math.abs(tgt.y - this.y);
	}
}

class Search {
	queue = [];

	constructor(initial, target, map) {
		this.queue.push(new State(initial.x, initial.y, []));
		this.target = target;
		this.map = map;
	}

	find() {
		let dist = new DistanceMap(this.map);
		let pot = this.queue.pop();
		let shorter = (d, m) => d === null || d > m;
		while (pot.x !== this.target.x || pot.y !== this.target.y) {
			let newMoves = pot.moves(this.map);
			newMoves = newMoves.filter(m => shorter(dist.at(m.x, m.y), m.steps.length));
			newMoves.forEach(m => dist.set(m.x, m.y, m.steps.length));
			this.queue = this.queue.concat(newMoves);
			this.queue.sort((a, b) => b.weight(this.target) - a.weight(this.target));
			pot = this.queue.pop();
		}
		return pot;
	}
}

export class S24a extends Solver {
	constructor(props) {
		super(props);
		this.canvas = React.createRef();
		this.state = { shortest: 0, roundtrip: 0 }
	}

	findPositions(map) {
		let pos = [];
		map.forEach((x, y, d) => {
			if (d !== '#' && d !== '.') { pos.push({ num: parseInt(d, 10), x: x, y: y }) }
		});
		return pos.sort((a, b) => a.num - b.num);
	}

	findPaths(start, dests, map) {
		start.paths = [];
		dests.forEach(destination => {
			let search = new Search(start, destination, map);
			start.paths[destination.num] = search.find();
		});
	}

	visit(from, to) {
		if (to.length === 0) { return 0; }
		let shortest = null;
		to.forEach(n => {
			let dist = this.visit(n, to.filter(d => d !== n)) + from.paths[n.num].steps.length;
			if (shortest === null || dist < shortest) {
				shortest = dist;
			}
		});
		return shortest;
	}

	visitAndReturn(from, to) {
		if (to.length === 0) { return from.paths[0].steps.length; }
		let shortest = null;
		to.forEach(n => {
			let dist = this.visitAndReturn(n, to.filter(d => d !== n)) + from.paths[n.num].steps.length;
			if (shortest === null || dist < shortest) {
				shortest = dist;
			}
		});
		return shortest;
	}

	solve(input) {
		let map = new AsciiMap(input);
		let ctx = this.canvas.current.getContext('2d');
		map.draw(ctx);
		let pos = this.findPositions(map);
		pos.forEach(p => {
			this.findPaths(p, pos, map);
			p.paths.forEach(p => map.drawPath(ctx, p.steps))
		});
		this.setState({ shortest: this.visit(pos[0], pos.slice(1)), roundtrip: this.visitAndReturn(pos[0], pos.slice(1)) });
	}

	customRender() {
		return <div>
			<p>Shortest path to visit all: {this.state.shortest}</p>
			<p>Shortest roundtrip: {this.state.roundtrip}</p>
			<p>Map:</p>
			<canvas id="solution" ref={this.canvas} width="1500" height="280" />
		</div>
	}
}

export class S24b extends Solver {
}