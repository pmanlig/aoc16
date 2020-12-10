//import React from 'react';
import Solver from './Solver';
import { md5 } from '../util/md5';

export class S14a extends Solver {
	valid(hashes, index) {
		let hash = hashes[index]
		for (let i = 0; i < hash.length - 3; i++) {
			if (hash[i] === hash[i + 1] && hash[i] === hash[i + 2]) {
				for (let j = index + 1; j < index + 1001; j++) {
					if (hashes[j].includes(hash[i] + hash[i] + hash[i] + hash[i] + hash[i])) { return true; }
				}
			}
		}
		return false;
	}

	solve(input) {
		let keys = [], secure = [];
		let hashes = [], stretched = [];
		let i = 0;
		let firstIndex = 0, secondIndex = 0;
		while (keys.length < 64 || secure.length < 64) {
			let newHash = md5(input + i++);
			hashes.push(newHash);
			for (let j = 0; j < 2016; j++) {
				newHash = md5(newHash);
			}
			stretched.push(newHash);
			if (hashes.length > 1000 && keys.length < 64 && this.valid(hashes, i - 1001)) {
				keys.push(hashes[i - 1001]);
				if (keys.length === 64) { firstIndex = i - 1001; }
			}
			if (stretched.length > 1000 && secure.length < 64 && this.valid(stretched, i - 1001)) {
				secure.push(stretched[i - 1001]);
				if (secure.length === 64) { secondIndex = i - 1001; }
			}
		}
		this.setState({ solution: `Index to produce 64th key: ${firstIndex}\nHash: ${hashes[firstIndex]}\nIndex to produce 64th stretched key: ${secondIndex}\nHash: ${stretched[secondIndex]}` });
	}
}

export class S14b extends Solver {
}