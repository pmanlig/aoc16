//import React from 'react';
import Solver from './Solver';

export class S6a extends Solver {
	solve(input) {
		input = input.split('\n');
		let chars = input[0].split('').map(c => { return {}; });
		input.forEach(l => {
			for (let i = 0; i < l.length; i++) {
				if (chars[i][l[i]] === undefined) { chars[i][l[i]] = 1; } else { chars[i][l[i]]++; }
			}
		});
		let msg = chars.map(c => Object.keys(c).map(k => { return { ch: k, n: c[k] } }).sort((a, b) => b.n - a.n)[0].ch).join('');
		let msg2 = chars.map(c => Object.keys(c).map(k => { return { ch: k, n: c[k] } }).sort((a, b) => a.n - b.n)[0].ch).join('');
		this.setState({ solution: `Message(1): ${msg}\nMessage(2): ${msg2}` });
	}
}

export class S6b extends Solver {
}