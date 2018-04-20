class RandomString {
	constructor(){
		this.name= 'RandomString';
		this.stringLength = 10;
		this.charString = "QWERTYUIOPASDFGHJKLZXCVBNMETAOINSRHLDCETA";
		this.randomString = [];
		this.ports = [this.stringLength, this.charString, this.randomString];
		this.param1 = new Object();
		this.param2 = new Object();
		this.param3 = new Object();
		this.param1.name = 'stringLength';
		this.param1.dataType = 'scalar';
		this.param1.direction = 'input';
		this.param2.name = 'charString';
		this.param2.dataType = 'matrix'
		this.param2.direction = 'input';
		this.param3.name = 'randomString';
		this.param3.dataType = 'matrix';
		this.param3.direction = 'output';
		this.execute();
		this.assignPorts();
		this.onchange = true;
	}
	assignPorts(){
		this.param1.value = this.stringLength;
		this.param2.value = this.charString;
		this.param3.value = this.randomString;
		this.params = [this.param1, this.param2, this.param3];
	}
	setParameter(i, value){
        if(i == 0){
            this.stringLength = value;
            this.param1.value = this.stringLength;
        }
        if(i == 1){
            this.charString = value;
            this.param2.value = this.charString;
        }
        if(i == 2){
            this.randomString = value;
            this.param3.value = this.randomString;
        }
	}
	/*
	updateOutputs(){
	    for(var i=0; i<this.ports.length; i++){
	        if(this.direction[i] == 'output'){
	            this.ports[i] =
	        }
	    }
	}
	*/
	getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
	execute(){
	    this.randomString = [];
	    this.stringLength = parseInt(this.stringLength);
        for (var i=0; i<this.stringLength; i++) {
            this.randomString.push(this.charString.charAt(this.getRndInteger(0,this.charString.length-1)));
        }
    }
}