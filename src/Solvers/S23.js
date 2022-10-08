// import React from 'react';
import Solver from './Solver';
import { BunnyComputer } from '../util';

class MultiplyComputer extends BunnyComputer {
	load(prg, init) {
		this.registers = init || { a: 0, b: 0, c: 0, d: 0 };
		this.ip = 0;
		this.prg = prg.split('\n').map(l => {
			let param = l.match(/^(cpy|jnz|inc|dec|tgl) ([a-d]|[-0-9]+)\s?([a-d]|[-0-9]+)?/);
			return {
				op: param[1],
				a: param[2],
				b: param[3]
			}
		});
	}

	runLimit(lim) {
		while (this.ip < this.prg.length && lim-- > 0) {
			let op = this.prg[this.ip];
			this[op.op](op.a, op.b);
			// console.log(`${this.ip}: ${op.op} ${op.a} ${op.b} [${this.registers.a}] [${this.registers.b}] [${this.registers.c}] [${this.registers.d}]`);
			this.ip++;
		}
	}
}

export class S23a extends Solver {
	calcA(input) {
		let cmp = new BunnyComputer();
		cmp.run(input, { a: 7, b: 0, c: 0, d: 0 });
		this.A = cmp.registers.a;
		this.setState({ solution: `Keypad code: ${this.A}\nCorrect keypad code: ${this.B}` });
		return;
	}

	calcB = () => {
		this.cmpB.runLimit(1000);
		this.B = this.cmpB.registers.a;
		this.setState({ solution: `Keypad code: ${this.A}\nCorrect keypad code: ${this.B}` });
		if (this.cmpB.ip < this.cmpB.prg.length) {
			this.runBackground(this.calcB);
		}
	}

	optimize() {
		let prg = this.cmpB.prg;
		for (let i=2; i<prg.length; i++) {
			if (prg[i].op === "jnz" && prg[i].b === "-2") {
				if (prg[i-1].op === "dec" && prg[i-2].op === "inc" && prg[i-1].a === prg[i].a) {
					console.log("Found inefficient loop");
				}
				if (prg[i-2].op === "dec" && prg[i-1].op === "inc" && prg[i-2].a === prg[i].a) {
					console.log("Found inefficient loop");
				}
			}
		}
	}

	solve(input) {
		this.A = 0;
		this.B = 0;
		this.setState({ solution: `Keypad code: ${this.A}\nCorrect keypad code: ${this.B}` });
		this.calcA(input);
		this.cmpB = new MultiplyComputer();
		this.cmpB.load(input, { a: 12, b: 0, c: 0, d: 0 });
		this.optimize();
		this.runBackground(this.calcB);
	}
}

export class S23b extends Solver {
}