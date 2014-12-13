import Blob = require("./Blob");

class CollisionManager {

	public static isCollision(first : Blob, second : Blob) {
		var r1 = Math.sqrt(first.getMass() / Math.PI);
		var r2 = Math.sqrt(second.getMass() / Math.PI);

		var eucDist = Math.sqrt(Math.pow((first.getPosy() - second.getPosy()), 2) + Math.pow((first.getPosx() - second.getPosx()), 2));

		return eucDist < (r1 + r2);
	}

}

export = CollisionManager;