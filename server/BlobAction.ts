/*
A class that specifies any of the actions a blob can take (jettisoning off part of itself
to move)
*/
class BlobAction {
	private direction : number;
	private duration : number;

	constructor(dx, dy, dur) {
		this.duration = dur;
		this.direction = Math.atan2(dy, dx);
	}

	public getDuration() : number {
		return this.duration;
	}

	public getDirection() : number {
		return this.direction;
	}
}

export = BlobAction;