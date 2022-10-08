export class Computer {
	commands = /^(cpy|jnz|inc|dec|tgl) ([a-d]|[-0-9]+)\s?([a-d]|[-0-9]+)?/;

	run(prg, init) {
		this.registers = init || { a: 0, b: 0, c: 0, d: 0 };
		this.ip = 0;
		this.prg = prg.split('\n').map(l => {
			let param = l.match(this.commands);
			return {
				op: param[1],
				a: param[2],
				b: param[3]
			}
		});
		while (this.ip < this.prg.length) {
			let op = this.prg[this.ip];
			this[op.op](op.a, op.b);
			// console.log(`${this.ip}: ${op.op} ${op.a} ${op.b} [${this.registers.a}] [${this.registers.b}] [${this.registers.c}] [${this.registers.d}]`);
			this.ip++;
		}
	}

	eval(x) {
		let i = parseInt(x, 10);
		return isNaN(i) ? this.registers[x] : i;
	}

	isRegister(x) {
		return x.match(/[a-d]/);
	}

	cpy(x, y) {
		if (!this.isRegister(y)) return;
		this.registers[y] = this.eval(x);
	}

	jnz(x, y) {
		if (this.eval(x) !== 0) { this.ip += this.eval(y); this.ip--; }
	}

	inc(x) {
		if (!this.isRegister(x)) return;
		this.registers[x]++;
	}

	dec(x) {
		if (!this.isRegister(x)) return;
		this.registers[x]--;
	}

	tgl(x) {
		let ip = this.eval(x) + this.ip;
		if (ip < 0 || ip >= this.prg.length) { return; }

		switch (this.prg[ip].op) {
			case "jnz":
				this.prg[ip].op = "cpy";
				break;

			case "cpy":
				this.prg[ip].op = "jnz";
				break;

			case "inc":
				this.prg[ip].op = "dec";
				break;

			case "dec":
			case "tgl":
				this.prg[ip].op = "inc";
				break;

			default:
				throw new Error("Unknown instruction");
		}
	}
}