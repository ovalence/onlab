class Subtraction4 {
	constructor(){
		this.name = 'Subtraction4';

		this.minuend = 1;
		this.subtrahend = 1;
		this.difference = 1;

		this.portsName = ['minuend','subtrahend','difference'];
		this.direction = ['input','input','output'];
	}
	assignPorts(){
		this.ports = [this.minuend,this.subtrahend,this.difference];
	}
	setParameter(name, value){
		if(name == 'minuend'){
			this.minuend = value;
		}
		if(name == 'subtrahend'){
			this.subtrahend = value;
		}
	}
	execute(){

	}
}
