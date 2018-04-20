class Divide {
	constructor(){
		this.name = 'Divide';

		this.dividend = 1;
		this.divisor = 1;
		this.quotient = 1;

		this.portsName = ['dividend','divisor','quotient'];
		this.direction = ['input','input','output'];
	}
	assignPorts(){
		this.ports = [this.dividend,this.divisor,this.quotient];
	}
	setParameter(name, value){
		if(name == 'dividend'){
			this.dividend = value;
		}
		if(name == 'divisor'){
			this.divisor = value;
		}
	}
	execute(){
              this.quotient = this.dividend/this.divisor;
	}
}
