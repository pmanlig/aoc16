// import React from 'react';
import Solver from './Solver';

export class S7a extends Solver {
	abbaSupported(ip) {
		let bracket = 0;
		let abba = false;
		for (let i = 0; i < ip.length - 3; i++) {
			if (ip[i] === '[') { bracket++; }
			else if (ip[i] === ']') { bracket--; }
			else if (ip[i] === ip[i + 3] && ip[i + 1] === ip[i + 2] && ip[i] !== ip[i + 1] && ip[i + 1] !== '[' && ip[i + 1] !== ']') {
				if (bracket > 0) { return false; }
				abba = true;
			}
		}
		return abba;
	}

	hasBab(ip, bab) {
		let bracket = 0;
		for (let i = 0; i < ip.length - 3; i++) {
			if (ip[i] === '[') { bracket++; }
			else if (ip[i] === ']') { bracket--; }
			else if (ip[i] === bab[0] && ip[i + 1] === bab[1] && ip[i + 2] === bab[2]) {
				if (bracket > 0) { return true; }
			}
		}
		return false;
	}

	sslSupported(ip) {
		let bracket = 0;
		for (let i = 0; i < ip.length - 2; i++) {
			if (ip[i] === '[') { bracket++; }
			else if (ip[i] === ']') { bracket--; }
			else if (ip[i] === ip[i + 2] && ip[i] !== ip[i + 1] && ip[i + 1] !== '[' && ip[i + 1] !== ']') {
				if (bracket === 0 && this.hasBab(ip, ip[i + 1] + ip[i] + ip[i + 1])) { return true; }
			}
		}
		return false;
	}

	solve(input) {
		input = input.split('\n');
		this.setState({ solution: `ABBA support: ${input.filter(ip => this.abbaSupported(ip)).length}\nSSL support: ${input.filter(ip => this.sslSupported(ip)).length}` });
	}
}

export class S7b extends Solver {
}