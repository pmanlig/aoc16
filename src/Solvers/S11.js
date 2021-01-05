import "./S11.css";
import React from 'react';
import Solver from './Solver';
import * as Util from '../util';

let num_substances = 5;

const abbreviations = {
	polonium: "Po",
	thulium: "Th",
	promethium: "Pr",
	ruthenium: "Ru",
	cobalt: "Co",
	elerium: "El",
	dilithium: "Di"
}

function HMS(time) {
	let pad = (n, l) => { n = n.toString(); while (n.length < l) { n = '0' + n; } return n; }
	let hrs = Math.floor(time / (1000 * 60 * 60));
	let mins = Math.floor(time / (1000 * 60)) % 60;
	let sec = Math.floor(time / 1000) % 60;
	let ms = time % 1000;
	return `${pad(hrs, 2)}:${pad(mins, 2)}:${pad(sec, 2)}.${pad(ms, 3)}`;
}

const floors = {
	first: 3,
	second: 2,
	third: 1,
	fourth: 0
}

class Substance {
	constructor(name, color, id) {
		this.name = name;
		this.color = color;
		this.id = id;
		this.abbreviation = abbreviations[name] ? abbreviations[name] : name.substring(0, 2);
	}
}

class Item {
	constructor(substance, type) {
		this.substance = substance;
		this.type = type;
	}

	column() {
		return 2 + this.substance.id * 2 + (this.type === "microchip" ? 1 : 0);
	}
}

class State {
	constructor(data, prev) {
		this.data = data;
		this.prev = prev === undefined ? null : prev;
		this.moves = this.prev === null ? 0 : prev.moves + 1;
		this.wt = this.moves + this.distance();
	}

	getItem(id) {
		return (this.data / (4 ** id)) & 3;
	}

	distance() {
		let d = 0, x = this.data;
		while (x > 0) {
			d += x & 3;
			x /= 4;
		}
		return d;
	}

	move(dir, items) {
		let n = this.data;
		n += dir; // elevator
		items.forEach(i => n += dir * (4 ** i));
		return new State(n, this);
	}

	key() {
		let elevator = this.data & 3, items = [], x = Math.floor(this.data / 4);
		for (let i = 0; i < num_substances * 2; i++) {
			items.push(x & 3);
			x = Math.floor(x / 4);
		}
		let chips = items.slice(0, num_substances);
		let gens = items.slice(num_substances);
		let pairs = [];
		while (chips.length > 0) { pairs.push(gens.shift() * 4 + chips.shift()); }
		pairs.sort(Util.numericSortAsc);
		for (let m = 4; pairs.length > 0; m *= 16) {
			elevator += pairs.shift() * m;
		}
		return elevator;
	}

	valid() {
		let items = [], x = Math.floor(this.data / 4); // remove elevator
		for (let i = 0; i < num_substances * 2; i++) {
			items.push(x & 3);
			x = Math.floor(x / 4);
		}
		let chips = items.slice(0, num_substances);
		let gens = items.slice(num_substances);
		for (let c = 0; c < num_substances; c++) {
			if (chips[c] !== gens[c] && gens.some(g => g === chips[c])) {
				return false;
			}
		}
		return true;
	}

	static fromContents(contents, elevator, prev) {
		for (let f = 0; f < contents.length; f++) {
			for (let i = 0; i < contents[f].length; i++) {
				let item = contents[f][i];
				elevator += f * (4 ** (item.substance.id + (item.type === "microchip" ? 0 : num_substances)));
			}
		}
		return new State(elevator, prev);
	}
}

export class S11a extends Solver {
	colors = [
		"#FFAFAF",
		"#AFFFAF",
		"#AFAFFF",
		"#AFAFAF",
		"#FFFF9F",
		"#FF9FFF",
		"#9FFFFF"
	]

	parse(l, contents, substances) {
		let floor = floors[l.match(/^The (first|second|third|fourth) floor contains /)[1]];
		contents[floor] = [];
		let c = l.match(/ a [-\w]+ (generator|microchip)/g);
		if (null !== c) {
			c.forEach(i => {
				let p = i.match(/ a (\w+)(?: |-compatible )(generator|microchip)/);
				let subst = substances.find(s => s.name === p[1]);
				if (subst === undefined) {
					subst = new Substance(p[1], this.colors.shift(), substances.length + 1);
					substances.push(subst);
				}
				contents[floor].push(new Item(subst, p[2]));
			});
		}
	}

	validate(contents) {
		for (let f = 0; f < contents.length; f++) {
			for (let i = 0; i < contents[f].length; i++) {
				let item = contents[f][i];
				if (item.type === "microchip") {
					if (!contents[f].find(g => g.substance === item.substance && g.type === "generator") && contents[f].find(g => g.type === "generator")) {
						return false;
					}
				}
			}
		}
		return true;
	}

	adjustContents(move, contents, elevator) {
		contents[elevator] = contents[elevator].filter(x => !move.cargo.includes(x));
		contents[elevator + move.direction] = contents[elevator + move.direction].concat(move.cargo);
	}

	select1to2(items) {
		let p = [];
		for (let i = 0; i < items.length - 1; i++) {
			for (let j = i + 1; j < items.length; j++) {
				p.push([items[i], items[j]]);
			}
		}
		return items.map(i => [i]).concat(p);
	}

	generateMoves(state, seen) {
		let e = state.getItem(0), moves = [];
		let items = [];
		for (let i = 1; i <= num_substances * 2; i++) { if (state.getItem(i) === e) { items.push(i); } }
		let permutations = this.select1to2(items);
		if (e > 0) { moves = moves.concat(permutations.map(p => state.move(-1, p)).filter(s => s.valid())); } // move up
		if (e < 3 && items.some(i => i > e)) { moves = moves.concat(permutations.map(p => state.move(1, p)).filter(s => s.valid())); } // move down
		moves = moves.filter(m => !seen.has(m.key()));
		moves.forEach(m => { seen.add(m.key()); });
		return moves;
	}

	findCandidate(moves) {
		for (let i = 0; true; i++) {
			if (moves[i] !== undefined && moves[i].length > 0) {
				return moves[i].pop();
			}
		}
	}

	merge(moves, newMoves) {
		while (newMoves.length > 0) {
			let n = newMoves[0];
			if (moves[n.wt] === undefined) { moves[n.wt] = []; }
			moves[n.wt] = moves[n.wt].concat(newMoves.filter(m => m.wt === n.wt));
			newMoves = newMoves.filter(m => m.wt !== n.wt);
		}
	}

	explore2(moves, seen, n, start) {
		let s;
		for (let i = 0; i++ < 1000; n++) {
			s = this.findCandidate(moves);
			if (s.data === 0) {
				this.setState({ state: s, steps: n, time: Date.now() - start, seen: seen });
				return;
			}
			this.merge(moves, this.generateMoves(s, seen));
		}
		this.setState({ state: s, steps: n });
		setTimeout(() => this.explore2(moves, seen, n, start), 1);
	}

	explore(initial) {
		let moves = [], seen = new Set([initial.key()]);
		moves[initial.wt] = [initial];
		setTimeout(() => this.explore2(moves, seen, 0, Date.now()), 1);
	}

	solve(input) {
		let contents = [], substances = [], part2 = true;
		input.split('\n').forEach(s => this.parse(s, contents, substances));
		if (part2) {
			let elerium = new Substance("elerium", this.colors.shift(), 6);
			let dilithium = new Substance("dilithium", this.colors.shift(), 7);
			substances.push(elerium);
			substances.push(dilithium);
			contents[3].push(new Item(elerium, "microchip"));
			contents[3].push(new Item(elerium, "generator"));
			contents[3].push(new Item(dilithium, "microchip"));
			contents[3].push(new Item(dilithium, "generator"));
		}
		num_substances = substances.length;
		let initial = State.fromContents(contents, 3);
		this.setState({ substances: substances, state: initial });
		this.explore(initial);
	}

	customRender() {
		let { state, substances, steps, time, seen } = this.state;
		return <div style={{ padding: "5px" }}>
			<div className="grid">
				<div className="cell" style={{ gridColumn: 1, gridRow: 4 }}>1:</div>
				<div className="cell" style={{ gridColumn: 1, gridRow: 3 }}>2:</div>
				<div className="cell" style={{ gridColumn: 1, gridRow: 2 }}>3:</div>
				<div className="cell" style={{ gridColumn: 1, gridRow: 1 }}>4:</div>
				<div className="cell item" style={{ gridColumn: 2, gridRow: 1 + state.getItem(0) }}>E</div>
				{substances && substances.map(s => <div key={s.name + "chip"} className="cell item" style={{ gridColumn: s.id * 2 + 1, gridRow: 1 + state.getItem(s.id), backgroundColor: "white" }}>{s.abbreviation}</div>)}
				{substances && substances.map(s => <div key={s.name + "gen"} className="cell item" style={{ gridColumn: s.id * 2 + 2, gridRow: 1 + state.getItem(s.id + num_substances), backgroundColor: s.color }}>{s.abbreviation}</div>)}
			</div>
			<p>Moves: {state.moves}</p>
			<p>Moves considered: {steps}</p>
			{time && <p>Time: {HMS(time)}</p>}
			{seen && <p># of seen states: {seen.size}</p>}
		</div>;
	}
}

export class S11b extends Solver {
}