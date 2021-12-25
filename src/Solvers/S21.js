// import React from 'react';
import Solver from './Solver';

class Scrambler {
	constructor(rules) {
		this.rules = rules;
	}

	static string2List(plain) {
		let head = { letter: plain[0] }
		head.next = head;
		head.prev = head;
		let start = head;
		let i = 1;
		while (i < plain.length) {
			head.next = { letter: plain[i++], next: head.next, prev: head }
			head = head.next;
		}
		start.prev = head;
		return start;
	}

	static list2String(list) {
		let s = list.next;
		let res = list.letter;
		for (s = list.next; s !== list; s = s.next) { res += s.letter; }
		return res;
	}

	static swapLetters(list, a, b) {
		// console.log(`Swap letters ${a} and ${b}`);
		let i = list;
		do {
			if (i.letter === a) { i.letter = b; }
			else if (i.letter === b) { i.letter = a; }
			i = i.next;
		} while (i !== list);
		return list;
	}

	static swapPositions(list, a, b) {
		// console.log(`Swap positions ${a} and ${b}`);
		let x = list;
		while (a-- > 0) { x = x.next; }
		let y = list;
		while (b-- > 0) { y = y.next; }
		let z = x.letter;
		x.letter = y.letter;
		y.letter = z;
		return list;
	}

	static reversePositions(list, a, b) {
		// console.log(`Reverse positions from ${a} to ${b}`);
		let x = list;
		for (let c = a; c > 0; c--) { x = x.next; }
		let y = x;
		for (let c = b - a; c > 0; c--) { y = y.next; }
		while (x !== y) {
			x = x.next;
			let i = x.prev;
			x.prev = i.prev;
			i.prev.next = x;
			i.next = y.next;
			i.prev = y;
			y.next.prev = i;
			y.next = i;
		}
		return a === 0 ? y : list;
	}

	static rotateOnLetter(list, a) {
		// console.log(`Rotate based on letter ${a}`);
		let steps = 1;
		let i = list;
		while (i.letter !== a) {
			steps++;
			i = i.next;
		}
		if (steps > 4) { steps++; }
		while (steps-- > 0) { list = list.prev; }
		return list;
	}

	static reverseRotate(list, a) {
		let pos = 0, len = 1;
		for (let x = list; x.letter !== a; x = x.next) { pos++; }
		for (let x = list.next; x !== list; x = x.next) { len++; }
		for (let x = 0; x < len; x++) {
			let left = (x + 1 + (x > 3 ? 1 : 0));
			if ((x + left) % len === pos) {
				return Scrambler.rotate(list, false, left);
			}
		}
		throw new Error("Cannot determine reverse operation!");
	}

	static rotate(list, right, steps) {
		// console.log(`Rotate ${steps} positions ${dir}`);
		while (steps-- > 0) { list = right ? list.prev : list.next; }
		return list;
	}

	static moveToPosition(list, a, b) {
		// console.log(`Move position ${a} to position ${b}`);
		let x = list;
		if (a === 0) { list = list.next; }
		else { for (let c = a; c > 0; c--) { x = x.next; } }
		x.prev.next = x.next;
		x.next.prev = x.prev;
		let y = list;
		for (let c = b; c > 0; c--) { y = y.next; }
		x.prev = y.prev;
		x.next = y;
		y.prev.next = x;
		y.prev = x;
		return (b === 0) ? x : list;
	}

	apply(rule, list, reverse) {
		let m = rule.match(/^swap position (\d+) with position (\d+)$/);
		if (null !== m) { return Scrambler.swapPositions(list, parseInt(m[1]), parseInt(m[2])) }

		m = rule.match(/^swap letter (\w) with letter (\w)$/);
		if (null !== m) { return Scrambler.swapLetters(list, m[1], m[2]) }

		m = rule.match(/^rotate (left|right) (\d+) steps?$/);
		if (null !== m) { return Scrambler.rotate(list, reverse ? (m[1] === "left") : (m[1] === "right"), parseInt(m[2])); }

		m = rule.match(/^rotate based on position of letter (\w)$/);
		if (null !== m) {
			return reverse ?
				Scrambler.reverseRotate(list, m[1]) :
				Scrambler.rotateOnLetter(list, m[1]);
		}

		m = rule.match(/^reverse positions (\d+) through (\d+)$/);
		if (null !== m) { return Scrambler.reversePositions(list, parseInt(m[1]), parseInt(m[2])) }

		m = rule.match(/^move position (\d+) to position (\d+)$/);
		if (null !== m) {
			return reverse ?
				Scrambler.moveToPosition(list, parseInt(m[2]), parseInt(m[1])) :
				Scrambler.moveToPosition(list, parseInt(m[1]), parseInt(m[2]))
		}

		throw new Error(`Couldn't identify rule: ${rule}`);
	}

	scramble(plain) {
		let s = Scrambler.string2List(plain);
		this.rules.forEach(r => s = this.apply(r, s));
		return Scrambler.list2String(s);
	}

	unscramble(pwd) {
		let s = Scrambler.string2List(pwd);
		[...this.rules].reverse().forEach(r => s = this.apply(r, s, true));
		return Scrambler.list2String(s);
	}
}

export class S21a extends Solver {
	runTests() {
		/*
		let test = Scrambler.string2List("abcde");
		test = Scrambler.reversePositions(test, 2, 4);
		this.tests.push(`Reverse to end: ${Scrambler.list2String(test) === "abedc"}`);
		test = Scrambler.reversePositions(test, 0, 2);
		this.tests.push(`Reverse from start: ${Scrambler.list2String(test) === "ebadc"}`);
		test = Scrambler.reversePositions(test, 0, 4);
		this.tests.push(`Reverse whole: ${Scrambler.list2String(test) === "cdabe"}`);
		test = Scrambler.moveToPosition(test, 0, 4);
		this.tests.push(`Moving from position 0: ${Scrambler.list2String(test) === "dabec"}`);
		test = Scrambler.moveToPosition(test, 3, 0);
		this.tests.push(`Moving to position 0: ${Scrambler.list2String(test) === "edabc"}`);
		test = Scrambler.moveToPosition(test, 3, 2);
		this.tests.push(`Moving position: ${Scrambler.list2String(test) === "edbac"}`);
		test = Scrambler.swapPositions(test, 3, 2);
		this.tests.push(`Swap position: ${Scrambler.list2String(test) === "edabc"}`);
		test = Scrambler.swapPositions(test, 0, 2);
		this.tests.push(`Swap position from position 0: ${Scrambler.list2String(test) === "adebc"}`);
		test = Scrambler.swapPositions(test, 3, 0);
		this.tests.push(`Swap position to position 0: ${Scrambler.list2String(test) === "bdeac"}`);
		test = Scrambler.swapLetters(test, 'a', 'e');
		this.tests.push(`Swap letters: ${Scrambler.list2String(test) === "bdaec"}`);
		test = Scrambler.rotate(test, "right", 2);
		this.tests.push(`Rotate right: ${Scrambler.list2String(test) === "ecbda"}`);
		test = Scrambler.rotate(test, "left", 2);
		this.tests.push(`Rotate left: ${Scrambler.list2String(test) === "bdaec"}`);
		test = Scrambler.rotateOnLetter(test, 'e');
		this.tests.push(`Rotate on letter with index = 3: ${Scrambler.list2String(test) === "daecb"}`);
		test = Scrambler.rotateOnLetter(test, 'b');
		this.tests.push(`Rotate on letter with index = 4: ${Scrambler.list2String(test) === "bdaec"}`);
		test = Scrambler.string2List("abcde");
		test = Scrambler.swapPositions(test, 4, 0);
		this.tests.push(`Swap positions 4 and 0: ${Scrambler.list2String(test) === "ebcda"}`);
		test = Scrambler.swapLetters(test, 'd', 'b');
		this.tests.push(`Swap letters d and b: ${Scrambler.list2String(test) === "edcba"}`);
		test = Scrambler.reversePositions(test, 0, 4);
		this.tests.push(`Reverse from 0 to 4: ${Scrambler.list2String(test) === "abcde"}`);
		test = Scrambler.rotate(test, "left", 1);
		this.tests.push(`Rotate 1 step left: ${Scrambler.list2String(test) === "bcdea"}`);
		test = Scrambler.moveToPosition(test, 1, 4);
		this.tests.push(`Move from position 1 to 4: ${Scrambler.list2String(test) === "bdeac"}`);
		test = Scrambler.moveToPosition(test, 3, 0);
		this.tests.push(`Move from position 3 to 0: ${Scrambler.list2String(test) === "abdec"}`);
		test = Scrambler.rotateOnLetter(test, 'b');
		this.tests.push(`Rotate based on b: ${Scrambler.list2String(test) === "ecabd"}`);
		test = Scrambler.rotateOnLetter(test, 'd');
		this.tests.push(`Rotate based on d: ${Scrambler.list2String(test) === "decab"}`);
		//*/
		let scrambler = new Scrambler([
			"swap position 4 with position 0",
			"swap letter d with letter b",
			"reverse positions 0 through 4",
			"rotate left 1 step",
			"move position 1 to position 4",
			"move position 3 to position 0",
			"rotate based on position of letter b",
			"rotate based on position of letter d"
		]);
		let s = scrambler.scramble("abcde");
		this.tests.push(`Scrambling "abcde": ${s === "decab"}`);
		s = Scrambler.string2List("abcdefghi");
		s = Scrambler.moveToPosition(s, 4, 7);
		s = Scrambler.moveToPosition(s, 7, 4);
		this.tests.push(`Move and then reverse: ${Scrambler.list2String(s) === "abcdefghi"}`);
		// this.tests.push(`Was: "${Scrambler.list2String(test)}" expected "bdaec"`);
	}

	solve(input) {
		this.tests = [];
		this.runTests();
		let scrambler = new Scrambler(input.split('\n'));
		let pwd1 = scrambler.scramble("abcdefgh");
		let pwd2 = scrambler.unscramble("fbgdceah");
		this.setState({ solution: `${this.tests.join('\n')}\nScrambled password: ${pwd1}\nUnscrambled password: ${pwd2}` });
	}
}

export class S21b extends Solver {
}