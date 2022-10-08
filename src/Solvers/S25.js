// import React from 'react';
import Solver from './Solver';
import { BunnyComputer } from '../util';

class TxComputer extends BunnyComputer {
	commands = /^(cpy|jnz|inc|dec|tgl|out) ([a-d]|[-0-9]+)\s?([a-d]|[-0-9]+)?/;
	output = [];

	out(x) {
		let val = this.eval(x);
		if ((val !== 0 && val !== 1) || (val === this.output[this.output.length - 1])) {
			this.terminate(0);
		}
		this.output.push(val);
		if (this.output.length > 100) {
			this.terminate(1);
		}
	}

	terminate(x) {
		this.registers.d = x;
		this.ip = this.prg.length;
	}
}

export class S25a extends Solver {
	solve(input) {
		let cmp = new TxComputer();
		let answer = 0;
		while (cmp.output.length < 100 && answer < 1000) {
			cmp.output = [];
			cmp.run(input, { a: answer++, b: 0, c: 0, d: 0 });
		}
		answer--;
		this.setState({ solution: `Clock initialization value: ${answer}` });
	}
}

export class S25b extends Solver {
}