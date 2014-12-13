
import Constants = require("./Constants");
import Blob = require("./Blob");

class CollisionManager {

	constructor() {
	}

	public processGameState(gamestate : Blob[]) : Blob[] {
		var newState = [];
		for (int i = 0; i < gamestate.length; i++) {
			for (int j = i + 1; j < gamestate.length; j++) {
				if (i != j && this.isCollision(gamestate[i], gamestate[j])) {
					var imass = gamestate[i].getMass();
					var jmass = gamestate[j].getMass();
					if (gamestate[i].getType() == Constants.BLOB_TYPE.USER || gamestate[j].getType() == Constants.BLOB_TYPE.USER) {
						if (imass > jmass) {
							gamestate[i].setMass(imass + jmass);
							for (var k = j; k < gamestate.length - 1; k++) {
								gamestate[k] = gamestate[k+1];
							}
							gamestate.splice(0, gamestate.length);
						} else {
							gamestate[j].setMass(imass + jmass);
							for (var k = i; k < gamestate.length - 1; k++) {
								gamestate[k] = gamestate[k+1];
							}
							gamestate.splice(0, gamestate.length);
							i = 0;
							j = 1;
						}
					} else {
						// we dont give a fuck
					}
				}
			}
		}
	}

	private isCollision(first : Blob, second : Blob) {
		var r1 = Math.sqrt(first.getMass / Math.PI);
		var r2 = Math.sqrt(second.getMass / Math.PI);

		var eucDist = Math.sqrt(Math.pow((first.getPosy() - second.getPosy()), 2) + Math.pow((first.getPosy() - second.getPosy()), 2));

		return eucDist < (r1 + r2);
	}

}

export = CollisionManager;