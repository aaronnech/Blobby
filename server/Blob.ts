/**
 * Created by aaron on 12/12/14.
 */
import Constants = require("./Constants");
import BlobAction = require("./BlobAction");

class Blob {
	private mass : number;
	private velx : number;
	private vely: number;
	private posx : number;
	private posy : number;
	private color : number;

	// constructor for creating a user controlled blob
	constructor(flag : boolean) {
	    this.mass = Constants.DEFAULT_BLOB_MASS;
	    this.velx = 0.0;
	    this.vely = 0.0;
	    this.color = this.generateColor();
	    this.posx = Math.random() * Constants.WORLD_WIDTH;
	    this.posy = Math.random() * Constants.WORLD_HEIGHT;
	}

	// zero argument constructor for creating dummy blobs in random directions
	constructor() {
	    this.mass = Math.random() * Constants.DEFAULT_BLOB_MASS;
	    this.velx = Math.random() * 2 * Constants.MAX_INITIAL_VELOCITY - Constants.MAX_INITIAL_VELOCITY;
	    this.vely = Math.random() * 2 * Constants.MAX_INITIAL_VELOCITY - Constants.MAX_INITIAL_VELOCITY;
	    this.color = this.generateColor();
	    this.posx = Math.random() * Constants.WORLD_WIDTH;
	    this.posy = Math.random() * Constants.WORLD_HEIGHT;
	}

	// constructor for creating a specific dummy blob (jettisoned)
	constructor(m : number, vx : number, vy : number, px : number, py : number) {
		this.mass = m;
		this.velx = vx;
		this.vely = vy;
		this.color = this.generateColor();
		this.posx = px;
		this.posy = py;
	}

	private generateColor() : number {
		return Math.floor(Math.random() * 256) +
			256 * Math.floor(Math.random() * 256) +
			256 * 256 * Math.floor(Math.random() * 256);
	}

	// Return the new blob, or null if there is no new blob
	public update(actions : BlobAction[]) : Blob[] {
		var newBlobs : Blob[] = [];

		for (var i = 0; i < actions.length; i++) {

			//update mass
			var mp : number = getMassPercentage(actions[i].getDuration());
			var newBlobMass : number = mp + this.mass;
			this.mass = (1 - mp) * this.mass;

			// update velocity
		}


		this.posx += this.velx;
		this.posy += this.vely;
		if (this.posy > Constants.WORLD_HEIGHT || this.posy < 0) this.vely *= -1;
		if (this.posx > Constants.WORLD_WIDTH || this.posx < 0) this.velx *= -1;

		return newBlobs;
	}

	private getMassPercentage(duration : number) {
		var mp = 0.5 - (1 / (5 * Math.sqrt(duration) + 1);
		return mp < 0.05 ? 0.05 : mp;
	}

	public toJSON() : any {
		return {
			'x' : this.posx,
			'y' : this.posy,
			'mass' : this.mass
		};
	}


}

export = Blob;