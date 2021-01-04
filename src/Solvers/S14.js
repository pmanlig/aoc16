//import React from 'react';
import Solver from './Solver';
import { md5 } from '../util/md5';

class Hash {
	constructor(salt, index) {
		this.salt = salt;
		this.index = index;
		this.hash = md5(salt + index);
		this.stretched = this.hash;
		for (let n = 0; n < 2016; n++) {
			this.stretched = md5(this.stretched);
		}
	}

	nextHash() {
		if (this.next === undefined) { this.next = new Hash(this.salt, this.index + 1); }
		return this.next;
	}

	valid() {
		let m = this.hash.match(/([a-z0-9])\1\1/);
		if (null != m) {
			let x = m[0] + m[0][0] + m[0][0];
			for (let n = this.nextHash(); n.index <= this.index + 1000; n = n.nextHash()) {
				if (n.hash.includes(x)) {
					return true;
				}
			}
		}
		return false;
	}

	validStretched() {
		let m = this.stretched.match(/([a-z0-9])\1\1/);
		if (null != m) {
			let x = m[0] + m[0][0] + m[0][0];
			for (let n = this.nextHash(); n.index <= this.index + 1000; n = n.nextHash()) {
				if (n.stretched.includes(x)) {
					return true;
				}
			}
		}
		return false;
	}
}

export class S14a extends Solver {
	generate(hash, keys, secure) {
		const keys_needed = 64;
		for (let i = 0; i < 100; i++) {
			if (keys.length < keys_needed && hash.valid()) {
				keys.push(hash.hash);
				if (keys.length >= keys_needed) {
					this.setState({ hash: hash.index, firstIndex: hash.index, hash1: hash.hash });
				}
			}
			if (secure.length < keys_needed && hash.validStretched()) {
				secure.push(hash.stretched);
				if (secure.length >= keys_needed) {
					this.setState({ hash: hash.index, secondIndex: hash.index, hash2: hash.stretched });
				}
			}
			if (keys.length >= keys_needed && secure.length >= keys_needed) { return; }
			hash = hash.nextHash();
		}
		this.setState({ hash: hash.index });
		setTimeout(() => this.generate(hash, keys, secure), 1);
	}

	solve(input) {
		// input = "abc";
		setTimeout(() => this.generate(new Hash(input, 0), [], []), 1);
	}

	customRender() {
		let { hash, firstIndex, secondIndex, hash1, hash2 } = this.state;
		return <div>
			<p>Hash index calculated: {hash}</p>
			<p>Index to produce 64th key: {firstIndex}</p>
			<p>Hash: {hash1}</p>
			<p>Index to produce 64th stretched key: {secondIndex}</p>
			<p>Stretched hash: {hash2}</p>
		</div>;
	}
}

export class S14b extends Solver {
}