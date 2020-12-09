import './S8.css';
import React from 'react';
import Solver from './Solver';

const screen_width = 50;
const screen_height = 6;
const pixel_size = 10;

class Screen {
	constructor() {
		this.pixels = [];
		for (let y = 0; y < screen_height; y++) {
			for (let x = 0; x < screen_width; x++) {
				this.putXY(x, y, 0);
			}
		}
	}

	getY(y) {
		if (this.pixels[y] === undefined) this.pixels[y] = [];
		return this.pixels[y];
	}

	getXY(x, y) {
		return this.getY(y)[x];
	}

	putXY(x, y, val) {
		this.getY(y)[x] = val;
	}

	rect(i) {
		i = i.substring("rect ".length).split('x');
		let w = parseInt(i[0], 10), h = parseInt(i[1], 10);
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				this.putXY(x, y, 1);
			}
		}
	}

	rotRow(i) {
		i = i.substring("rotate row y=".length).split(" by ");
		let y = parseInt(i[0], 10);
		let val = parseInt(i[1], 10);
		let oldRow = this.getY(y);
		let newRow = [];
		for (let i = 0; i < screen_width; i++) {
			newRow.push(oldRow[(i + screen_width - val) % screen_width]);
		}
		this.pixels[y] = newRow;
	}

	rotCol(i) {
		i = i.substring("rotate column x=".length).split(" by ");
		let x = parseInt(i[0], 10);
		let val = parseInt(i[1], 10);
		let newCol = [];
		for (let i = 0; i < screen_height; i++) {
			newCol.push(this.getXY(x, (i + screen_height - val) % screen_height));
		}
		for (let i = 0; i < screen_height; i++) {
			this.putXY(x, i, newCol[i]);
		}
	}

	parse(i) {
		if (i.startsWith("rect ")) { this.rect(i); }
		if (i.startsWith("rotate row ")) { this.rotRow(i); }
		if (i.startsWith("rotate column ")) { this.rotCol(i); }
	}
}

export class S8a extends Solver {
	step(input, screen) {
		if (input.length === 0) { return; }
		screen.parse(input.shift());
		this.setState({ input: input });
		setTimeout(() => this.step(input, screen), 100);
	}

	solve(input) {
		let s = new Screen();
		input = input.split('\n');
		this.setState({ screen: s, input: input });
		setTimeout(() => this.step(input, s), 100);
	}

	customRender() {
		let id = 0;
		return <div>
			<div>
				Instructions left: {this.state.input && this.state.input.length}<br/>
				Pixels lit: {this.state.screen && this.state.screen.pixels.map(l => l.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)}
			</div>
			{this.state.screen && this.state.screen.pixels.map(l => <div className="line" style={{ height: `${pixel_size}px`, width: `${screen_width * pixel_size}px` }} key={id++}>
				{l.map(p => <div className={p === 0 ? "pixel off" : "pixel on"} key={id++} style={{ height: `${pixel_size}px`, width: `${pixel_size}px` }} />)}
			</div>)}
		</div>;
	}
}

export class S8b extends Solver {
}