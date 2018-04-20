class Convolution {
	constructor(){
		this.name= 'Convolution';

		this.matrix = 1;
		this.kernel = 1;
		this.output = 1;

		this.portsName = ['matrix','kernel','output'];
		this.direction = ['input','input','output',];
	}
	assignPorts(){
		this.ports = [this.matrix,this.kernel,this.output];
	}
	execute(){

	}
}
