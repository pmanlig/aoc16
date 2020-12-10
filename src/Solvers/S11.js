import "./S11.css";
import React from 'react';
import Solver from './Solver';

const direction = {
	up: -1,
	dn: 1
}

const abbreviations = {
	polonium: "Po",
	thulium: "Th",
	promethium: "Pr",
	ruthenium: "Ru",
	cobalt: "Co"
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
	constructor(s, t) {
		this.substance = s;
		this.type = t;
	}

	column() {
		return 2 + this.substance.id * 2 + (this.type === "microchip" ? 1 : 0);
	}
}

class Move {
	constructor(dir, cargo) {
		this.direction = dir;
		this.cargo = cargo;
	}
}

class State {
	constructor(i, prev) {
		this.data = i;
		this.prev = prev;
	}

	toList() {
		let i = this.data;
		let list = [];
		while (list.length < 11) {
			list.push(i & 3);
			i = i >> 2;
		}
		return list;
	}

	distance() {
		let i = this.data;
		let r = 0;
		while (i > 0) {
			r += i & 3;
			i = i >> 2;
		}
		return r;
	}

	static fromList(list, prev) {
		let i = 0;
		while (list.length > 0) {
			i = (i << 2) + list.pop();
		}
		return new State(i, prev);
	}

	static fromContents(contents, elevator, prev) {
		for (let f = 0; f < contents.length; f++) {
			for (let i = 0; i < contents[f].length; i++) {
				let item = contents[f][i];
				let sh = (4 * item.substance.id + (item.type === "microchip" ? -2 : 0));
				// console.log(`f: ${f}, id: ${item.substance.id}, shift: ${sh}, f << sh: ${f << sh}`);
				elevator += f << sh;
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
				let item = new Item(subst, p[2]);
				contents[floor].push(item);
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

	move(moves, contents, substances) {
		if (moves.length === 0) { return; }
		let m = moves.shift();
		let p = m.match(/^(up|dn) (\d)(\w)\s?(\d)?(\w)?$/);
		let elev = this.state.elevator;
		let cargo = [];
		cargo.push(contents[elev].find(i => i.substance.id === parseInt(p[2], 10) && i.type === (p[3] === "g" ? "generator" : "microchip")));
		if (p[4]) {
			cargo.push(contents[elev].find(i => i.substance.id === parseInt(p[4], 10) && i.type === (p[5] === "g" ? "generator" : "microchip")));
		}
		contents[elev] = contents[elev].filter(x => !cargo.includes(x));
		elev += p[1] === "up" ? -1 : 1;
		contents[elev] = contents[elev].concat(cargo);
		if (!this.validate(contents)) { this.setState({ error: true }); }
		this.setState({ contents: contents, moves: this.state.moves + 1, elevator: elev });
		setTimeout(() => this.move(moves, contents, substances), 500);
	}

	generateMoves(contents, elevator) {
		let moves = [];
		let floor = contents[elevator];
		if (elevator < 3) {
			// generate down moves
			for (let i = 0; i < floor.length; i++) {
				moves.push(new Move(direction.dn, [floor[i]]));
			}
		}
		if (elevator > 0) {
			// generator up moves
		}
		return moves;
	}

	solve(input) {
		let contents = [];
		let substances = [];
		let moves = [];
		input = input.split('\n').forEach(s => this.parse(s, contents, substances));
		console.log(State.fromContents(contents, 3));
		this.setState({ contents: contents, substances: substances, moves: 0, elevator: 3 });
		setTimeout(() => this.move(moves, contents, substances), 500);
	}

	renderContents() {
		if (!this.state.contents) { return null; }
		let contents = this.state.contents;
		let items = [];
		for (let y = 0; y < contents.length; y++) {
			contents[y].forEach(i => {
				items.push(<div key={i.substance.name + i.type} className="cell item" style={{ gridColumn: i.column(), gridRow: y + 1, backgroundColor: i.type === "microchip" ? "white" : i.substance.color }}>{i.substance.abbreviation}</div>);
			});
		}
		return items;
	}

	render() {
		return <div>
			<div className="grid">
				<div className="cell" style={{ gridColumn: 1, gridRow: 4 }}>1:</div>
				<div className="cell" style={{ gridColumn: 1, gridRow: 3 }}>2:</div>
				<div className="cell" style={{ gridColumn: 1, gridRow: 2 }}>3:</div>
				<div className="cell" style={{ gridColumn: 1, gridRow: 1 }}>4:</div>
				{this.renderContents()}
				{this.state.elevator && <div className="cell item" style={{ gridColumn: 2, gridRow: 1 + this.state.elevator }}>E</div>}
			</div>
			<p>Moves: {this.state.moves}</p>
			{this.state.error && <p>Error! Invalid state!</p>}
		</div>;
	}
}

export class S11b extends Solver {
}