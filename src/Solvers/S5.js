//import React from 'react';
import Solver from './Solver';
import { md5 } from '../util/md5';

export class S5a extends Solver {
	replace(s, pos, c) {
		var r = "";
		for (let i = 0; i < s.length; i++) {
			r += i === pos && s[i] === '_' ? c : s[i];
		}
		return r;
	}

	calc(i, input, pwd, pwd2) {
		for (let j = 0; j < 100000; j++) {
			let hash = md5(input + i++);
			if (hash.startsWith("00000")) {
				if (pwd.length < 8) { pwd += hash[5]; }
				pwd2 = this.replace(pwd2, parseInt(hash[5], 10), hash[6]);
			}
			if (!pwd2.includes('_')) {
				this.setState({ solution: `Index: ${i - 1}\nPwd(1): ${pwd}\nPwd(2): ${pwd2}` });
				return;
			}
		}
		this.setState({ solution: `Index: ${i}\nPwd(1): ${pwd}\nPwd(2): ${pwd2}` });
		setTimeout(() => this.calc(i, input, pwd, pwd2), 1);
	}

	solve(input) {
		setTimeout(() => this.calc(0, input, "", "________"), 1);
		this.setState({ solution: `Index: 0` });
	}
}

export class S5b extends Solver {
}