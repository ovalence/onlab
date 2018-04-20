class Add2 {
	constructor(){
		this.name = 'Add2';

		this.addend1 = 1;
		this.addend2 = 1;
		this.sum = 1;

		this.portsName = ['addend1','addend2','sum'];
		this.direction = ['input','input','output'];		execute();
		assignPorts();
	}
	assignPorts(){
		this.ports = [this.addend1,this.addend2,this.sum];
	}
	setParameter(name, value){
		if(name == 'addend1'){
			this.addend1 = value;
		}
		if(name == 'addend2'){
			this.addend2 = value;
		}
	}
	execute(){
this.sum = this.addend1 + this.addend2;
	}
}
