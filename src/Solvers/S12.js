//import React from 'react';
import Solver from './Solver';
import { Computer } from '../util/AssemBunny';

export class S12a extends Solver {
	solve(input) {
		let c = new Computer(), d = new Computer();
		c.run(input);
		d.run(input, { a: 0, b: 0, c: 1, d: 0 });
		this.setState({ solution: `Register A: ${c.registers.a}\nRegister A after initializing C: ${d.registers.a}` });
	}
}

export class S12b extends Solver {
}