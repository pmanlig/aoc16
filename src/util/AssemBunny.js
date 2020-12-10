export class Computer {
	run(prg, init) {
		this.registers = init || { a: 0, b: 0, c: 0, d: 0 };
		this.ip = 0;
		prg = prg.split('\n').map(l => {
			let param = l.match(/^(cpy|jnz|inc|dec) ([a-d]|[-0-9]+)\s?([a-d]|[-0-9]+)?/);
			return {
				op: param[1],
				a: param[2],
				b: param[3]
			}
		});
		while (this.ip < prg.length) {
			let op = prg[this.ip];
			this[op.op](op.a, op.b);
			// console.log(`${this.ip}: ${op.op} ${op.a} ${op.b} [${this.registers.a}] [${this.registers.b}] [${this.registers.c}] [${this.registers.d}]`);
			this.ip++;
		}
	}

	eval(x) {
		let i = parseInt(x, 10);
		return isNaN(i) ? this.registers[x] : i;
	}

	cpy(x, y) {
		this.registers[y] = this.eval(x);
	}

	jnz(x, y) {
		if (this.eval(x) !== 0) { this.ip += this.eval(y); this.ip--; }
	}

	inc(x) {
		this.registers[x]++;
	}

	dec(x) {
		this.registers[x]--;
	}
}