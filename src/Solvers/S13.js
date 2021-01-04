//import React from 'react';
import Solver from './Solver';

class Coord2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equal(other) {
		return this.x === other.x && this.y === other.y;
	}
}

class Path2D extends Coord2D {
	constructor(x, y, wt, back) {
		super(x, y);
		this.wt = wt;
		this.back = back;
	}
}

class Map {
	data = [];

	constructor(magic) {
		this.magic = magic;
	}

	generate(x, y) {
		let s = (x + y + 1) * (x + y) + 2 * x + this.magic;
		let b = 0;
		for (let i = 1; i <= s; i *= 2) {
			if ((i & s) > 0) { b++; }
		}
		return b % 2 === 0 ? '.' : '#';
	}

	get(x, y) {
		if (this.data[y] === undefined) { this.data[y] = []; }
		if (this.data[y][x] === undefined) { this.data[y][x] = this.generate(x, y); }
		return this.data[y][x];
	}

	set(x, y, c) {
		if (this.data[y] === undefined) { this.data[y] = []; }
		this.data[y][x] = c;
	}
}

export class S13a extends Solver {
	findPath(from, to, map) {
		let sort = function (a, b) { return a.wt - b.wt; }
		map.set(from.x, from.y, 0);
		from.wt = 0;
		from.back = null;
		let paths = [from];
		let n = paths.shift();
		while (!n.equal(to)) {
			map.set(n.x, n.y, n.wt);
			if (n.y > 0 && map.get(n.x, n.y - 1) === '.') { paths.push(new Path2D(n.x, n.y - 1, n.wt + 1, n)); }
			if (n.x > 0 && map.get(n.x - 1, n.y) === '.') { paths.push(new Path2D(n.x - 1, n.y, n.wt + 1, n)); }
			if (map.get(n.x, n.y + 1) === '.') { paths.push(new Path2D(n.x, n.y + 1, n.wt + 1, n)); }
			if (map.get(n.x + 1, n.y) === '.') { paths.push(new Path2D(n.x + 1, n.y, n.wt + 1, n)); }
			paths.sort(sort);
			n = paths.shift();
		}
		return n;
	}

	fill(from, map, dist) {
		let sort = function (a, b) { return a.wt - b.wt; }
		map.set(from.x, from.y, '+');
		from.wt = 0;
		from.back = null;
		let paths = [from];
		let n = paths.shift();
		while (n.wt <= dist) {
			map.set(n.x, n.y, '+');
			if (n.y > 0 && map.get(n.x, n.y - 1) === '.') { paths.push(new Path2D(n.x, n.y - 1, n.wt + 1, n)); }
			if (n.x > 0 && map.get(n.x - 1, n.y) === '.') { paths.push(new Path2D(n.x - 1, n.y, n.wt + 1, n)); }
			if (map.get(n.x, n.y + 1) === '.') { paths.push(new Path2D(n.x, n.y + 1, n.wt + 1, n)); }
			if (map.get(n.x + 1, n.y) === '.') { paths.push(new Path2D(n.x + 1, n.y, n.wt + 1, n)); }
			paths.sort(sort);
			n = paths.shift();
		}
		return map.data.map(l => l.filter(c => c === '+').length).reduce((a, b) => a + b, 0);
	}

	solve(input) {
		let magic = parseInt(input, 10);
		// magic = 10;
		let map = new Map(magic);
		let path = this.findPath(new Coord2D(1, 1), new Coord2D(31, 39), map);
		// path = this.findPath(new Coord2D(1, 1), new Coord2D(7, 4), map);
		map = new Map(magic);
		let cells = this.fill(new Coord2D(1, 1), map, 50);
		let dim = map.data.length;
		for (let i = 0; i < map.data.length; i++) {
			if (map.data[i].length > dim) { dim = map.data[i].length; }
		}
		for (let y = 0; y < dim; y++) {
			for (let x = 0; x < dim; x++) {
				map.get(x, y);
			}
		}
		this.setState({ map: map, path: path, cells: cells });
	}

	customRender() {
		let { map, path, cells } = this.state;
		return <div>
			{path && <p>Path length: {path.wt}</p>}
			{cells && <p>Reachable cells: {cells}</p>}
			{map && <pre>{map.data.map(l => l.join('')).join('\n')}</pre>}
		</div>;
	}
}

export class S13b extends Solver {
}