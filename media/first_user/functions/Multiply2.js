class Multiply2 {
	constructor(){
		this.name = 'Multiply2';

		this.factor1 = 1;
		this.factor2 = 1;
		this.product = 1;

		this.portsName = ['factor1','factor2','product'];
		this.direction = ['input','input','output'];
		this.direction = ['integer','integer','integer'];
		this.execute();
		this.assignPorts();
		this.onchange = true;
	}
	assignPorts(){
		this.ports = [this.factor1,this.factor2,this.product];
	}
	setParameter(name, value){
		if(name == 'factor1'){
			this.factor1 = value;
		}
		if(name == 'factor2'){
			this.factor2 = value;
		}
	}
	execute(){
        this.product = this.factor1 * this.factor2;
	}
}
