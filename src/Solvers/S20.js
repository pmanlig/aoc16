// import React from 'react';
import Solver from './Solver';

export class S20a extends Solver {
	solve(input) {
		let rules = input.split('\n').map(l => /^(\d+)-(\d+)$/.exec(l).slice(1).map(n => parseInt(n)))
			.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
		let ip = 0;
		let i = 0;
		let ipCount = 0;
		let lowest = -1;
		while (ip <= 4294967295) {
			while (i < rules.length && ip >= rules[i][0]) { ip = Math.max(ip, rules[i++][1] + 1); }
			if (lowest === -1) lowest = ip;
			ipCount++;
			ip++;
		}
		if (ip > (4294967295) + 1) ipCount--;
		this.setState({ solution: `Lowest allowed IP: ${lowest}\nAllowed IPs: ${ipCount}` });
	}
}

export class S20b extends Solver {
}