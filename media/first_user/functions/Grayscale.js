class Grayscale {
	constructor(){
		this.name= 'Grayscale';
		this.image = new Image();
		this.grayscale = new Image();
		this.ports = [this.image, this.grayscale];
		this.param1 = new Object();
		this.param2 = new Object();
		this.param1.name = 'image';
		this.param1.dataType = 'Image';
		this.param1.direction = 'input';
		this.param2.name = 'grayscale';
		this.param2.dataType = 'Image'
		this.param2.direction = 'output';
		//this.execute();
		this.assignPorts();
		this.onchange = false;
	}
	assignPorts(){
		this.param1.value = this.image;
		this.param2.value = this.grayscale;
		this.params = [this.param1, this.param2];
	}
	setParameter(name, value){
        if(name == 'image'){
            this.image = value;
            this.param1.value = this.image;
        }
        if(name == 'grayscale'){
            this.grayscale = value;
            this.param2.value = this.grayscale;
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
    gray(red, green, blue) {
    	return Math.floor(0.30*red + 0.59*green + 0.11*blue);
    }
	execute(){
	    this.grayscale = [];
    	for (var i = 0; i< this.image.height; i++) {
    	    var vec = [];
    		for (var j=0; j< this.image.width; j++) {
                vec.push(this.image[i][j]);
    		}
    		this.grayscale.push(vec);
    	}
    }
}