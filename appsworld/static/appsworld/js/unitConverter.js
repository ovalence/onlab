function unitConverter(_magnitude, _fromUnit, _toUnit){
	var multiplier;
	var divisor;
	if (_fromUnit == "m"){
		multiplier = 1;
	}
	if (_fromUnit == "km"){
		multiplier = 1000;
	}
	if (_fromUnit == "mi"){
		multiplier = 1609.344;
	}	
	if (_fromUnit == "nmi"){
		multiplier = 1852;
	}
	if (_fromUnit == "cm"){
		multiplier = 0.01;
	}
	if (_fromUnit == "in"){
		multiplier = 0.0254;
	}
	if (_fromUnit == "ft"){
		multiplier = 0.3048;
	}
	if (_fromUnit == "yd"){
		multiplier = 0.9144;
	}
	if (_fromUnit == "s"){
		multiplier = 1;
	}	
	if (_fromUnit == "min"){
		multiplier = 60;
	}
	if (_fromUnit == "h"){
		multiplier = (60*60);
	}	
	if (_fromUnit == "s^2"){
		multiplier = 1**2;
	}	
	if (_fromUnit == "min^2"){
		multiplier = 60**2;
	}
	if (_fromUnit == "h^2"){
		multiplier = (60*60)**2;
	}


	if (_toUnit == "m"){
		divisor = 1;
	}
	if (_toUnit == "km"){
		divisor = 1000;
	}
	if (_toUnit == "mi"){
		divisor = 1609.344;
	}	
	if (_toUnit == "nmi"){
		divisor = 1852;
	}
	if (_toUnit == "cm"){
		divisor = 0.01;
	}
	if (_toUnit == "in"){
		divisor = 0.0254;
	}
	if (_toUnit == "ft"){
		divisor = 0.3048;
	}
	if (_toUnit == "yd"){
		divisor = 0.9144;
	}
	if (_toUnit == "s"){
		divisor = 1;
	}	
	if (_toUnit == "min"){
		divisor = 60;
	}
	if (_toUnit == "h"){
		divisor = (60*60);
	}
	if (_toUnit == "s^2"){
		divisor = 1**2;
	}	
	if (_toUnit == "min^2"){
		divisor = 60**2;
	}
	if (_toUnit == "h^2"){
		divisor = (60*60)**2;
	}
	return ((_magnitude*multiplier)/divisor);
}
