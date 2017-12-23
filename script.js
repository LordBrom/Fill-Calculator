function lumberOption(num, size, count, lock, min, max) {
	this.num  = num;
	this.size  = size;
	this.count = count;
	this.lock  = lock;
	this.min   = min;
	this.max   = max;
	this.print = function() {
		console.log("Num: " + this.num + ";"
			,"Size: " + this.size + ";"
			,"Count: " + this.count + ";"
			,"Lock: " + this.lock + ";"
			,"Min: " + this.min + ";"
			,"Max: " + this.max + ";"
		);
	}
	this.incCount = function() {
		this.count++;
	}
	this.decCount = function() {
		this.count--;
	}
	this.setCount = function(count) {
		this.count = count;
		this.checkMinMax();
		return this.count
	}
	this.checkMinMax = function() {
		if (this.count > this.max && this.max > 0)
		{
			this.count = this.max;
		}
		if (this.count < this.min)
		{
			this.count = this.min;
		}

	}
}

function optionGroup() {
	this.options = [];
	this.addOption = function(num, size, count, lock, min, max) {
		var newOption = new lumberOption(num, size, count, lock, min, max);
		this.options.push(newOption)
	}
	this.getOptionTotal = function() {
		return calcTotalFromArray(this.options);
	}
	this.getOptionSize = function() {
		return this.options.length;
	}
	this.print = function() {
		this.options.forEach(function(ele){
			ele.print()
		})
	}
	this.getOption = function(num) {
		if (num >= this.options.length) {
			console.error("Option out of bounds", num, this.options.length)
			return false;
		}
		return this.options[num]
	}
	this.incOptionCount = function(num) {
		if (num >= this.options.length) {
			console.error("Option out of bounds", num, this.options.length)
			return false;
		}
		this.options[num].incCount()
	}
	this.decOptionCount = function(num) {
		if (num >= this.options.length) {
			console.error("Option out of bounds", num, this.options.length)
			return false;
		}
		this.options[num].decCount()
	}
	this.isOptionLocked = function(num) {
		if (num >= this.options.length) {
			console.error("Option out of bounds", num, this.options.length)
			return false;
		}
		return this.options[num].lock
	}
	this.getOptionCount = function(num) {
		if (num >= this.options.length) {
			console.error("Option out of bounds", num, this.options.length)
			return false;
		}
		return this.options[num].count
	}
	this.setOptionCount = function(num, count) {
		if (num >= this.options.length) {
			console.error("Option out of bounds", num, this.options.length)
			return false;
		}
		return this.options[num].setCount(count)
	}
	this.getOptionMin = function(num) {
		if (num >= this.options.length) {
			console.error("Option out of bounds", num, this.options.length)
			return false;
		}
		return this.options[num].min
	}
	this.getOptionMax = function(num) {
		if (num >= this.options.length) {
			console.error("Option out of bounds", num, this.options.length)
			return false;
		}
		return this.options[num].max
	}
	this.checkMinMax = function(num) {
		if (num){
			if (num >= this.options.length) {
				console.error("Option out of bounds", num, this.options.length)
				return false;
			}
			this.options[num].checkMinMax()

		} else {
			this.options.forEach(function(ele){
				ele.checkMinMax();
			}); 
		}
	}
}

var calculate = function() {
	var count      = 0;
	var sizeNeeded = parseInt($("#txtSize").val());
	var diff       = $("#txtDiff");
	var finalTotal = $("#txtTotal");
	var sizes      = $(".txtSize");

	var options = [];

	var optGrp = new optionGroup();

	$(sizes).each(function(){
		var thisNum =   $(this).attr('data-optionNum');
		setTotal(thisNum)
		var thisSize =  parseInt($(".txtSize[data-optionNum='" + thisNum + "']").val());
		var thisMax =   parseInt($(".txtMax[data-optionNum='"  + thisNum + "']").val());
		var thisMin =   parseInt($(".txtMin[data-optionNum='"  + thisNum + "']").val());
		var thisLock =           $(".ckbLock[data-optionNum='" + thisNum + "']:checked").length != 0;
		var thisCount = 0;
		if (thisLock)
		{
			thisCount = parseInt($(".txtCount[data-optionNum='" + thisNum + "']").val());
		}

		optGrp.addOption(thisNum,thisSize,thisCount,thisLock,thisMin,thisMax);
	});
	var calcedOptions = recursiveCalc(0, optGrp, sizeNeeded)

	setFromArray(calcedOptions.options)
};

var recursiveCalc = function(index, optGrp, target) {
	var localOptGrp = Object.assign({},arguments[1]);

	if (index >= 100) {return localOptGrp}

	if (localOptGrp.getOptionTotal() >= target) {return localOptGrp}

	var relIndex = index
	if (index >= localOptGrp.getOptionSize()) {relIndex = index % localOptGrp.getOptionSize()}

	if (localOptGrp.isOptionLocked(relIndex)) {
		return recursiveCalc(index + 1, localOptGrp, target);
	}

	var altOptions     = Object.assign({},localOptGrp);
	var changeOption   = Object.assign({},localOptGrp);
	var retOption      = Object.assign({},localOptGrp);

	var noChangeOption = recursiveCalc(index + 1, Object.assign({},localOptGrp), target);

	if (localOptGrp.getOptionTotal() >= target) { return localOptGrp;}

	altOptions.checkMinMax(relIndex);

	if (altOptions.getOptionCount(relIndex) < altOptions.getOptionMax(relIndex) || altOptions.getOptionMax(relIndex) < 0){
		altOptions.incOptionCount(relIndex)
		changeOption = recursiveCalc(index + 1, altOptions, target);
	}

	var aryOptionsTotal     = localOptGrp.getOptionTotal()
	var noChangeOptionTotal = noChangeOption.getOptionTotal()
	var changeOptionTotal   = changeOption.getOptionTotal()
	if ( noChangeOptionTotal <= target && noChangeOptionTotal > aryOptionsTotal) {
		retOption = noChangeOption;
	}

	if (changeOptionTotal <= target && changeOptionTotal > retOption.getOptionTotal()) {
		retOption = changeOption;
	}

	if (retOption.getOptionTotal() >= target) {
		return arguments[1]
	}

	return retOption;
}


var calcTotalFromArray = function(aryOptions) {
	var total = 0;
	aryOptions.forEach(function(ele){
		total += ele.size * ele.count;
	}); 
	return total;
}

var setFromArray = function(aryOptions) {
	aryOptions.forEach(function(ele){
		$(".txtCount[data-optionNum='" + ele.num + "']").val(ele.count)
		setTotal(ele.num)
	}); 
}

var setTotal = function(optionNum){
	var thisSize  = parseInt($(".txtSize[data-optionNum='"  + optionNum + "'").val());
	var thisCount = parseInt($(".txtCount[data-optionNum='" + optionNum + "'").val());
	var thisMax   = parseInt($(".txtMax[data-optionNum='"   + optionNum + "'").val());
	var thisMin   = parseInt($(".txtMin[data-optionNum='"   + optionNum + "'").val());

	if (thisMin > thisMax && thisMax >= 0){
		thisMax = thisMin;
		$(".txtMax[data-optionNum='"   + optionNum + "'").val(thisMax);
	}

	if (thisCount < thisMin){
		thisCount = thisMin;
		$(".txtCount[data-optionNum='" + optionNum + "'").val(thisCount);
	}
	if (thisCount > thisMax && thisMax >= 0){
		thisCount = thisMax;
		$(".txtCount[data-optionNum='" + optionNum + "'").val(thisCount);
	}

	$(".txtTotal[data-optionNum='" + optionNum + "'").val(thisSize * thisCount);

	var total = 0;
	$(".txtSize").each(function(){
		var thisNum = parseInt($(this).attr('data-optionNum'));

		total += parseInt($(".txtTotal[data-optionNum='" + thisNum + "'").val());
	});

	$("#txtTotal").val(total);
	var newDiff = parseInt($("#txtSize").val()) - parseInt($("#txtTotal").val());
	$("#txtDiff").val(newDiff)
}

var arrayClone = function(arySrc) {
	var len = arySrc.length
	var aryNew = [];
	for(var i = 0; i < len; i++)
	{
		aryNew[i] = arySrc[i];
	}
	return(aryNew);
}

var addOption = function() {
	var newOptionNum = $(".txtSize").length + 1
	var html = '';
	html += '<tr>';
    html += '	<td><input type="checkbox" class="ckbLock"        data-optionNum="' + newOptionNum + '"                                    /></td>';
    html += '	<td><input type="textBox"  class="txtSize "       data-optionNum="' + newOptionNum + '" value="1500" onkeyup="setTotal(' + newOptionNum + ')" /></td>';
    html += '	<td><input type="textBox"  class="txtCount"       data-optionNum="' + newOptionNum + '" value="1"    onkeyup="setTotal(' + newOptionNum + ')" /></td>';
    html += '	<td><input type="textBox"  class="txtMax"         data-optionNum="' + newOptionNum + '" value="-1"   onkeyup="setTotal(' + newOptionNum + ')" /></td>';
    html += '	<td><input type="textBox"  class="txtMin"         data-optionNum="' + newOptionNum + '" value="0"    onkeyup="setTotal(' + newOptionNum + ')" /></td>';
    html += '	<td><input type="textBox"  class="txtTotal"       data-optionNum="' + newOptionNum + '" readonly                           /></td>';
    html += '	<td><span onclick="removeOption(' + newOptionNum + ')">X</span></td>';
    html += '</tr>';

    $("#tblOptions").append(html);
}

var removeOption = function(num) {
	$(".txtSize[data-optionNum='" + num + "']").closest('tr').remove();
}