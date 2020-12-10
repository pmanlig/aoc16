//import React from 'react';
import Solver from './Solver';

export class S16a extends Solver {
	b(input) {
		return input.split('').reverse().map(c => c === '0' ? '1' : '0').join('');
	}

	checksum(input) {
		let res = "";
		for (let i = 0; i < input.length; i += 2) {
			res += input[i] === input[i + 1] ? '1' : '0';
		}
		return res;
	}

	solve(input) {
		while (input.length < 272) { input = input + '0' + this.b(input); }
		let checksum1 = this.checksum(input.substring(0, 272));
		while (checksum1.length % 2 === 0) { checksum1 = this.checksum(checksum1); }
		while (input.length < 35651584) { input = input + '0' + this.b(input); }
		let checksum2 = this.checksum(input.substring(0, 35651584));
		while (checksum2.length % 2 === 0) { checksum2 = this.checksum(checksum2); }
		this.setState({ solution: `Checksum(1): ${checksum1}\nChecksum(2): ${checksum2}` });
	}
}

export class S16b extends Solver {
}