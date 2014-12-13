/**
 * Created by aaron on 12/12/14.
 */
import Constants = require("./Constants");

class Blob {
	private static DEFAULT_MASS : number = 100.0;
	private mass : number;
	private velx : number;
	private vely: number;
	private posx : number;
	private posy : number;
	private color : number;

	// Width and height of the game board
	constructor() {
	    this.mass = DEFAULT_MASS;
	    this.velx = 0.0;
	    this.vely = 0.0;
	    this.color = this.generateColor() + 256 * this.generateColor() + 256 * 256 * this.generateColor();
	    this.posx = Math.random() * Constants.WORLD_WIDTH;
	    this.posy = Math.random() * Constants.WORLD_HEIGHT;
	}

	generateColor() : number {
		return Math.floor(Math.random() * 256);
	}

	update() : void {
		this.posx += this.velx;
		this.posy += this.vely;
		if (this.posy > Constants.WORLD_HEIGHT || this.posy < 0) this.vely *= -1;
		if (this.posx > Constants.WORLD_WIDTH || this.posx < 0) this.velx *= -1;
	}




}

export = Blob;