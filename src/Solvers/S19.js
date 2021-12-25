// import React from 'react';
import Solver from './Solver';

class Elf {
	constructor(num, next) {
		this.num = num;
		this.next = next || null;
	}
}

export class S19a extends Solver {
	calc(num) {
		let head = new Elf(1);
		head.next = head;
		let end = head;
		for (let i = 1; i++ < num; end = end.next) { end.next = new Elf(i, end.next); }
		while (head.next !== head) { head.next = head.next.next; head = head.next; }
		return head.num;
	}

	calc2(num) {
		let head = new Elf(1);
		head.next = head;
		let end = head;
		for (let i = 1; i++ < num; end = end.next) { end.next = new Elf(i, end.next); }
		let elim = head;
		let steps = Math.floor(num / 2) - 1;
		while (steps-- > 0) { elim = elim.next; }
		let odd = (num % 2) === 1;
		while (elim.next !== elim) {
			elim.next = elim.next.next;
			if (odd) { elim = elim.next; }
			odd = !odd;
		}
		return elim.num;
	}

	solve(input) {
		console.log(this.calc(5));
		console.log(this.calc2(5));
		let winnerSimple = this.calc(parseInt(input));
		let winnerAdvanced = this.calc2(parseInt(input));
		this.setState({ solution: `Winning elf (simple): ${winnerSimple}\nWinning elf (advanced): ${winnerAdvanced}` });
	}
}

export class S19b extends Solver {
}