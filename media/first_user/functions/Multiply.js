class Multiply {
	constructor(){
		this.name = 'Multiply';
		this.multiplicand = 2;
		this.multiplier = 3;
		this.product = -1;
        this.ports = [this.multiplicand, this.multiplier, this.product];
		this.param1 = new Object();
		this.param2 = new Object();
		this.param3 = new Object();
		this.param1.name = 'multiplicand';
		this.param1.dataType = 'scalar';
		this.param1.direction = 'input';
		this.param2.name = 'multiplier';
		this.param2.dataType = 'scalar'
		this.param2.direction = 'input';
		this.param3.name = 'product';
		this.param3.dataType = 'scalar';
		this.param3.direction = 'output';
		this.execute();
		this.assignPorts();
		this.onchange = true;
	}
	assignPorts(){
		this.param1.value = this.multiplicand;
		this.param2.value = this.multiplier;
		this.param3.value = this.product;
		this.params = [this.param1, this.param2, this.param3];
	}
	setParameter(i, func, portNumber){
		if(i == 0){
			this.multiplicand = func.params[portNumber].value;
			this.param1.value = this.multiplicand;
		}
		if(i == 1){
			this.multiplier = func.params[portNumber].value;
			this.param2.value = this.multiplier;
		}
	}
	execute(){
	    this.multiplicand = parseFloat(this.multiplicand);
	    this.multiplier = parseFloat(this.multiplier);
        this.product = this.multiplicand * this.multiplier;
	}
}
