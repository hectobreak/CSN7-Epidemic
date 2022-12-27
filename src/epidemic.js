class Vertex {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.connections = new Array;
        this.memory = new Object;
    }
    isVulnerable(t){
        let state = this.memory[t % 2];
        if(state === undefined) {
            if(this.memory[(t+1)%2] !== undefined) return this.isVulnerable(t+1);
            return true;
        }
        if(!state.infected && !state.recovered) return true;
        return false;
    }
    isInfected(t){
        if(this.isRecovered(t)) return false;
        let state = this.memory[t % 2];
        if(state === undefined) {
            if(this.memory[(t+1)%2] !== undefined) return this.isInfected(t+1);
            return false;
        }
        if(state.infected) return true;
        return false;
    }
    isRecovered(t, recurse = true){
        let state = this.memory[t % 2];
        if(state !== undefined && state.recovered) return true;
        if(state === undefined || this.memory[(t+1)%2] !== undefined && recurse) {
            if(this.memory[(t+1)%2] !== undefined) return this.isRecovered(t+1, false);
            return false;
        }
        return false;
    }
    selfInfect(t){
        if(!this.isVulnerable(t)) return;
        this.memory[(t+1)%2] = { infected: true, recovered: false };
    }
    recover(t, gamma){
        if(!this.isInfected(t)) return;
        if(Math.random() > gamma) return;
        this.memory[(t+1)%2] = { infected: false, recovered: immuneRecovered };
    }
    infect(t, beta, verts){
        if(!this.isInfected(t)) return;
        for(let i of this.connections){
            if(Math.random() > beta) continue;
            verts[i].selfInfect(t);
        }
    }
}

function fisheryates(vec){
    for(let i = 0; i < vec.length; ++i){
        let j = Math.floor( Math.random() * (vec.length - i) ) + i;
        [vec[i], vec[j]] = [vec[j], vec[i]];
    }
    return vec;
}

function range(f, t){
    let arr = new Array;
    for(let i = f; i < t; ++i) arr.push(i);
    return arr;
}

function vecpush(obj, name, val){
    if(obj[name] === undefined) obj[name] = new Array;
    obj[name].push(val);
}

class Graph {
    constructor(){
        this.vertices = new Array;
        this.t = 0;
        this.stats = new Object;
    }
    add(x, y){
        this.vertices.push( new Vertex(x, y) );
        return this.vertices.length - 1;
    }
    connect(i, j){
        this.vertices[i].connections.push(j);
        this.vertices[j].connections.push(i);
    }
    simulationStep(gamma, beta){
        this.t++;
        for(let vert of this.vertices){
            let state = vert.memory[(this.t)%2];
            if(state === undefined) continue;
            vert.memory[(this.t+1)%2] = { infected: state.infected, recovered: state.recovered };
        }
        for(let vert of this.vertices){
            vert.infect(this.t, beta, this.vertices);
            vert.recover(this.t, gamma);
        }
        let V = 0, I = 0, R = 0;
        for(let vert of this.vertices){
            if(vert.isVulnerable(this.t)) V++;
            if(vert.isInfected(this.t)) I++;
            if(vert.isRecovered(this.t)) R++;
        }
        vecpush(this.stats, "V", V / this.vertices.length);
        vecpush(this.stats, "I", I / this.vertices.length);
        vecpush(this.stats, "R", R / this.vertices.length);
    }
    draw(canvas, rad = 0.025){
        let ctx = canvas.getContext("2d");
        let w = canvas.width, h = canvas.height;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#000000";
        for(let vert of this.vertices){
            for(let j of vert.connections){
                let neig = this.vertices[j];
                ctx.beginPath();
                ctx.moveTo( vert.x * w, vert.y * h );
                ctx.lineTo( neig.x * w, neig.y * h );
                ctx.stroke();
            }
        }
        for(let vert of this.vertices){
            ctx.beginPath();
            ctx.arc( vert.x * w, vert.y * h, Math.min(w, h) * rad, 0, 2 * Math.PI );
            ctx.fillStyle = vert.isVulnerable(this.t) ? "#00FF00" : vert.isInfected(this.t) ? "#FF0000" : "#666666";
            ctx.fill();
            ctx.stroke();
        }
    }
    infectRandom(p0){
        let r = fisheryates(range(0, this.vertices.length));
        for(let i = 0; i < p0; ++i){
            this.vertices[r[i]].selfInfect(this.t);
        }
    }
}

Graph.uniformGrid = function(dim){
    let G = new Graph();
    let grid = new Array;
    for(let i = 0; i < dim; ++i){
        grid[i] = new Array;
        let x = (i + 1) / (dim + 1);
        for(let j = 0; j < dim; ++j){
            let y = (j + 1) / (dim + 1);
            grid[i][j] = G.add(x, y);
            if(i > 0) G.connect( grid[i][j], grid[i-1][j] );
            if(j > 0) G.connect( grid[i][j], grid[i][j-1] );
        }
    }
    return G;
}

Graph.starGraph = function(nver){
    let G = new Graph();
    let center = G.add(0.5, 0.5);
    for(let i = 1; i < nver; ++i){
        let angle = 2 * Math.PI * (i - 1) / (nver - 1);
        let v = G.add( 0.5 + 0.45 * Math.cos(angle), 0.5 + 0.45 * Math.sin(angle) );
        G.connect(center, v);
    }
    return G;
}


Graph.completeGraph = function(nver){
    let G = new Graph();
    for(let i = 0; i < nver; ++i){
        let angle = 2 * Math.PI * i / nver;
        let v = G.add( 0.5 + 0.45 * Math.cos(angle), 0.5 + 0.45 * Math.sin(angle) );
        for(let j = 0; j < v; ++j)
            G.connect(v, j);
    }
    return G;
}

Graph.erdosRenyi = function(nver, p){
	let G = new Graph();
    for(let i = 0; i < nver; ++i){
		G.add( Math.random() * 0.9 + 0.05, Math.random() * 0.9 + 0.05 );
	}
	for(let i = 0; i < nver; ++i){
		for(let j = i+1; j < nver; ++j){
			if(Math.random() > p) continue;
			G.connect(i, j);
		}
	}
	G.ForcesAlgorithm();
	return G;
}
