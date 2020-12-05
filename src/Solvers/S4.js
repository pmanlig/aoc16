// import React from 'react';
import Solver from './Solver';

class Room {
	constructor(c) {
		c = c.split(/[-[\]]/).filter(x => x !== "");
		this.checksum = c.pop();
		this.id = parseInt(c.pop(), 10);
		this.chars = {};
		c.reduce((a, b) => a + b, "").split('').sort().forEach(l => {
			if (this.chars[l] === undefined) this.chars[l] = 1; else this.chars[l]++;
		});
		this.real = true;
		let ch = Object.keys(this.chars).map(k => { return { char: k, num: this.chars[k] }; }).sort((a, b) => a.num === b.num ? a.char - b.char : b.num - a.num);
		for (let i = 0; i < this.checksum.length; i++) {
			if (this.checksum[i] !== ch[i].char) this.real = false;
		}
		this.text = c.map(w => this.rot(w, this.id)).join(" ");
	}

	rot(s, n) {
		let r = "";
		const base = 'a'.charCodeAt(0);
		for (let i = 0; i < s.length; i++) {
			r += String.fromCharCode(((s.charCodeAt(i) - base + n) % 26) + base);
		}
		return r;
	}

	valid() {
		let i = 0, j = 0;
		while (i < this.checksum.length) {
			if (this.checksum[i] !== this.chars[j]) return false;
			while (this.checksum[i] === this.chars[j]) { j++; }
			i++;
		}
		return true;
	}
}

export class S4a extends Solver {
	solve(input) {
		let data = input.split('\n').map(c => new Room(c)).filter(r => r.real);
		this.setState({ solution: `Valid: ${data.length}\nIDs: ${data.reduce((a, b) => a + b.id, 0)}\nNorth pole objects room ID: ${data.find(a => a.text.includes("northpole")).id}` });
	}
}

export class S4b extends Solver {
}