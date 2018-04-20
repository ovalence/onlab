class Cvt1dto2d {
	constructor(){
		this.name= 'Cvt1dto2d';
		this.width = 10;
		this.array = [["H"], ["E"], ["L"], ["L"], ["O"], ["W"], ["O"], ["R"], ["L"], ["D"]];
		this.array2d = [];
		this.ports = [this.width, this.array, this.array2d];
		this.param1 = new Object();
		this.param2 = new Object();
		this.param3 = new Object();
		this.param1.name = 'width';
		this.param1.dataType = 'scalar';
		this.param1.direction = 'input';
		this.param2.name = 'array';
		this.param2.dataType = 'matrix';
		this.param2.direction = 'input';
		this.param3.name = 'array2d';
		this.param3.dataType = 'matrix';
		this.param3.direction = 'output';
		this.execute();
		this.assignPorts();
		this.onchange = true;
	}
	assignPorts(){
		this.param1.value = this.width;
		this.param2.value = this.array;
		this.param3.value = this.array2d;
		this.params = [this.param1, this.param2, this.param3];
	}
	setParameter(name, value){
        if(name == 'width'){
            this.width = value;
            this.param1.value = this.width;
        }
        if(name == 'array'){
            this.array = value;
            this.param2.value = this.array;
        }
        if(name == 'array2d'){
            this.array2d = value;
            this.param3.value = this.array2d;
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

	execute(){
	    this.width = parseInt(this.width);
	    this.array2d = [];
        for(var i = 0; i<this.width; i++){
            var vec = [];
            for(var j = 0; j < (Math.floor(this.array.length/this.width)); j++){
                vec.push(0);
            }
            this.array2d.push(vec);
        }

        for(var i = 0; i<(this.array.length*this.array[0].length); i++){
            this.array2d[Math.floor(i/this.array2d.length)][Math.floor(i/this.array2d.length) + (i%this.array2d.length)] = this.array[Math.floor(i/this.array.length)][Math.floor(i/this.array.length) + (i%this.array.length)]
        }
    }
}
