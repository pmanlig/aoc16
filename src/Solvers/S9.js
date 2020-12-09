// import React from 'react';
import Solver from './Solver';

export class S9a extends Solver {
	stripWhitespace(input) {
		return input.replace(/\s+/g, '');
	}

	decompress(input) {
		let markerPos = input.search(/\(\d+x\d+\)/);
		if (-1 === markerPos) { return input.length; }
		let len = markerPos;
		input = input.substring(markerPos);
		markerPos = input.search(/\)/) + 1;
		let patt = input.match(/^\((\d+)x(\d+)\)/);
		let size = parseInt(patt[1], 10);
		let mul = parseInt(patt[2], 10);
		len += size * mul;
		return len + this.decompress(input.substring(markerPos + size));
	}

	decompress2(input) {
		let markerPos = input.search(/\(\d+x\d+\)/);
		if (-1 === markerPos) { return input.length; }
		let len = markerPos;
		input = input.substring(markerPos);
		markerPos = input.search(/\)/) + 1;
		let patt = input.match(/^\((\d+)x(\d+)\)/);
		let size = parseInt(patt[1], 10);
		let mul = parseInt(patt[2], 10);
		input = input.substring(markerPos);
		return len + mul * this.decompress2(input.substring(0, size)) + this.decompress2(input.substring(size));
	}

	test(s) {
		console.log(`${s}: ${this.decompress2(s)}`);
	}

	solve(input) {
		input = this.stripWhitespace(input);
		this.test("X(8x2)(3x3)ABCY");
		this.test("(27x12)(20x12)(13x14)(7x10)(1x12)A");
		this.test("(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN");
		this.setState({ solution: `Output length(1): ${this.decompress(input)}\nOutput length(2): ${this.decompress2(input)}` });
	}
}

export class S9b extends Solver {
}