class Add {
	constructor(){
		this.name = 'Add';
		this.addend1 = 6;
		this.addend2 = 3;
		this.sum = new Number(-1);;
        this.ports = [this.addend1, this.addend2, this.sum];
		this.param1 = new Object();
		this.param2 = new Object();
		this.param3 = new Object();
		this.param1.name = 'addend1';
		this.param1.dataType = 'scalar';
		this.param1.direction = 'input';
		this.param2.name = 'addend2';
		this.param2.dataType = 'scalar'
		this.param2.direction = 'input';
		this.param3.name = 'sum';
		this.param3.dataType = 'scalar';
		this.param3.direction = 'output';
		this.execute();
		this.assignPorts();
		this.onchange = true;
	}
	assignPorts(){
		this.param1.value = this.addend1;
		this.param2.value = this.addend2;
		this.param3.value = this.sum;
		this.params = [this.param1, this.param2, this.param3];
	}
	setParameter(i, value){
		if(i == 0){
			this.addend1 = value;
			this.param1.value = this.addend1;
		}
		if(i == 1){
			this.addend2 = func.params[portNumber].value;
			this.param2.value = this.addend2;
		}
	}
	execute(){
	    this.addend1 = parseFloat(this.addend1);
	    this.addend2 = parseFloat(this.addend2);
        this.sum = this.addend1 + this.addend2;
	}
}
