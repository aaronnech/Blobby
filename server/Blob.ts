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
	private id : string;
	private blobType : number;

	// constructor for creating a user controlled blob
	constructor(flag : number, i ?: string, m ?: number, vx ?: number, vy ?: number, px ?: number, py ?: number) {
		switch (flag) {
		    case Constants.BLOB_TYPE.USER: {
			    this.mass = Constants.DEFAULT_BLOB_MASS;
			    this.velx = 0.0;
			    this.vely = 0.0;
			    this.color = this.generateColor();
			    this.posx = Math.random() * Constants.WORLD_WIDTH;
			    this.posy = Math.random() * Constants.WORLD_HEIGHT;
			    this.id = i;
			    this.blobType = flag;
		        break;
		    }
		    case Constants.BLOB_TYPE.JETTISONED: {
		    	this.mass = m;
				this.velx = vx;
				this.vely = vy;
				this.color = this.generateColor();
				this.posx = px;
				this.posy = py;
				this.id = i;
				this.blobType = flag;
		    	break;
		    }
		    default: {
			    this.mass = Math.random() * Constants.DEFAULT_BLOB_MASS;
			    this.velx = Math.random() * 2 * Constants.MAX_INITIAL_VELOCITY - Constants.MAX_INITIAL_VELOCITY;
			    this.vely = Math.random() * 2 * Constants.MAX_INITIAL_VELOCITY - Constants.MAX_INITIAL_VELOCITY;
			    this.color = this.generateColor();
			    this.posx = Math.random() * Constants.WORLD_WIDTH;
			    this.posy = Math.random() * Constants.WORLD_HEIGHT;
			    this.id = i;
			    this.blobType = flag;
		    }
		}
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
			var m2 : number = this.getMassPercentage(actions[i].getDuration()) * this.mass;
			var m1 : number = this.mass - m2;

			// calculate velocity of new blob
			var v2x : number = Constants.MAX_INITIAL_VELOCITY / 2 * Math.cos(actions[i].getDirection());
			var v2y : number = Constants.MAX_INITIAL_VELOCITY / 2 * Math.sin(actions[i].getDirection());

			// calculate new velocity
			var v1x : number = (this.mass * this.velx - m2 * v2x) / m1;
			var v1y : number = (this.mass * this.vely - m2 * v2y) / m1;


            // calculate position of new blob
            var dist : number = Math.sqrt(m1 / Math.PI) + Math.sqrt(m2 / Math.PI) + 1.0;
            var nX : number = Math.cos(actions[i].getDirection()) * dist + this.posx;
            var nY : number = Math.sin(actions[i].getDirection()) * dist + this.posy;

			// update current blob's stats
			this.mass = m1;
			this.velx = v1x;
			this.vely = v1y;

			// Create new blob with the properties
			newBlobs[newBlobs.length] = new Blob(Constants.BLOB_TYPE.JETTISONED, null, m2, v2x, v2y, nX, nY);
		}

		this.posx += this.velx;
		this.posy += this.vely;
		if (this.posy > Constants.WORLD_HEIGHT || this.posy < 0) this.vely *= -1;
		if (this.posx > Constants.WORLD_WIDTH || this.posx < 0) this.velx *= -1;

		return newBlobs;
	}

	private getMassPercentage(duration : number) {
		var mp = 0.5 - (1 / (5 * Math.sqrt(duration) + 1));
		return mp < 0.05 ? 0.05 : mp;
	}

	public toJSON() : any {
		return {
			'x' : this.posx,
			'y' : this.posy,
			'vx' : this.velx,
			'vy' : this.vely,
			'mass' : this.mass,
			'color' : this.color,
			'id' : this.id
		};
	}

	public setMass(newMass) : void {
		this.mass = newMass;
	}

	/*GETTERS*/

	public getMass() : number {
		return this.mass;
	}

	public getPosx() : number {
		return this.posx;
	}

	public getPosy() : number {
		return this.posy;
	}

	public getType() : number {
		return this.blobType;
	}



}

export = Blob;