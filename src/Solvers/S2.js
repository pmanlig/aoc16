// import React from 'react';
import Solver from './Solver';

class Keypad {
	code = "";

	press() {
		this.code += this.layout[this.pos.y][this.pos.x];
	}
}

class SimpleKeypad extends Keypad {
	layout = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
	pos = { x: 1, y: 1 };

	move(c) {
		if (c === 'U' && this.pos.y > 0) { this.pos.y--; }
		if (c === 'D' && this.pos.y < 2) { this.pos.y++; }
		if (c === 'L' && this.pos.x > 0) { this.pos.x--; }
		if (c === 'R' && this.pos.x < 2) { this.pos.x++; }
	}
}

class WeirdKeypad extends Keypad {
	layout = [
		[null, null, 1, null, null],
		[null, 2, 3, 4, null],
		[5, 6, 7, 8, 9],
		[null, 'A', 'B', 'C', null],
		[null, null, 'D', null, null]];
	pos = { x: 0, y: 2 };

	move(c) {
		if (c === 'U' && this.pos.y > 0 && null !== this.layout[this.pos.y - 1][this.pos.x]) { this.pos.y--; }
		if (c === 'D' && this.pos.y < 4 && null !== this.layout[this.pos.y + 1][this.pos.x]) { this.pos.y++; }
		if (c === 'L' && this.pos.x > 0 && null !== this.layout[this.pos.y][this.pos.x - 1]) { this.pos.x--; }
		if (c === 'R' && this.pos.x < 4 && null !== this.layout[this.pos.y][this.pos.x + 1]) { this.pos.x++; }
	}
}

export class S2a extends Solver {
	solve(input) {
		input = input.split('\n');
		let k1 = new SimpleKeypad(), k2 = new WeirdKeypad();
		for (let r = 0; r < input.length; r++) {
			for (let c = 0; c < input[r].length; c++) {
				k1.move(input[r][c]);
				k2.move(input[r][c]);
			}
			k1.press();
			k2.press();
		}
		this.setState({ solution: `Lines: ${input.length}\nCode(1): ${k1.code}\nCode(2): ${k2.code}` });
	}
}

export class S2b extends Solver {
}