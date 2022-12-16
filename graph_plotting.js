Graph.prototype.ForcesAlgorithm = function(niter = 1000) {
	let d0 = 0.2;
	let k = 1, alpha = 2;
	let dt = 0.05;
	
	let N = this.vertices.length;
	for(let i = 0; i < N; ++i){
		this.vertices[i].vx = 0;
		this.vertices[i].vy = 0;
	}
	let minx, maxx, miny, maxy;
	for(let it = 0; it < niter; ++it){
		minx = Infinity;
		maxx = -Infinity;
		miny = Infinity;
		maxy = -Infinity;
		for(let i = 0; i < N; ++i){
			let ax = 0, ay = 0;
			for(let j in this.vertices[i].connections){
				let x = this.vertices[i].x - this.vertices[j].x;
				let y = this.vertices[i].y - this.vertices[j].y;
				let d = Math.sqrt(x*x + y*y);
				
				ax += - k * x * (d-d0) - alpha * this.vertices[i].vx;
				ay += - k * y * (d-d0) - alpha * this.vertices[i].vy;
			}
			this.vertices[i].vx += ax * dt;
			this.vertices[i].vy += ay * dt;
			this.vertices[i].x += this.vertices[i].vx * dt;
			this.vertices[i].y += this.vertices[i].vy * dt;
			if(this.vertices[i].x < minx) minx = this.vertices[i].x;
			if(this.vertices[i].y < miny) miny = this.vertices[i].y;
			if(this.vertices[i].x > maxx) maxx = this.vertices[i].x;
			if(this.vertices[i].y > maxy) maxy = this.vertices[i].y;
		}
	}
	for(let i = 0; i < N; ++i){
		this.vertices[i].x = (this.vertices[i].x - minx)/(maxx - minx) * 0.9 + 0.05;
		this.vertices[i].y = (this.vertices[i].y - miny)/(maxy - miny) * 0.9 + 0.05;
	}
}
	
