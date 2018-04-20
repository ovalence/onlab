class RouletteWheel {
	constructor(){
		this.distribution = [5,5,5,5,5];
		this.grad = []
		this.max = 100;
		this.result = 0;
		this.graduation();
	}
	graduation(){
		var shares = [];
		var total = 0;
		for(var i = 0; i< this.distribution.length; i++){
			total += this.distribution[i];
		}
		var runningTotal = 0;
		for(var i = 0; i< this.distribution.length; i++){
			shares.push(this.distribution[i]/total);
		}
		for(var i = 0; i< shares.length; i++){
			runningTotal += shares[i];
			this.grad.push(runningTotal);
		}
		return this.grad;
	}
	element(mark){
		for(var i = 0; i<this.grad.length; i++){
			if(mark > this.grad[i]){
				this.result = [mark, i + 1];
			}
		}
		return this.result;
	}
	roll(){
		var div = Math.floor(Math.random() * (this.max - 0) ) + 0;
		var mark = div/100;
		for(var i = 0; i< this.grad.length; i++){
			if(mark > this.grad[i]){
				this.result = [mark, i + 1];
			}
		}
		return this.result;
	}
}