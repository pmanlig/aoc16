import { drawFilledRect } from './Drawing';

export class PixelMap {
	constructor(ctx, pixelSize) {
		this.ctx = ctx;
		this.pixelSize = pixelSize;
	}

	drawPixel(x, y, style) {
		drawFilledRect(this.ctx, this.pixelSize * x, this.pixelSize * y, this.pixelSize * (x + 1), this.pixelSize * (y + 1), style);
	}

	drawMap(map, styles) {
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				this.drawPixel(x, y, styles[map[y][x]]);
			}
		}
	}
}