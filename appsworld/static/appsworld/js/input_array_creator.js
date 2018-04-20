function inputArrays(container_element_id, rows, cols) {
    this.container = document.getElementById(container_element_id);
    this.rows = rows;
    this.cols = cols;
    var innerHTML = "<table id='array_table'>";
    for (var i=0; i< 1; i++ ) {
        innerHTML += "<tr>";
        for (var j=0; j< this.cols; j++) {
            innerHTML += "<th class='table-cell-th'>hello</th>";
        }
        innerHTML += "</tr>";
    }
    for (var i=0; i< this.rows; i++ ) {
        innerHTML += "<tr>";
        for (var j=0; j< this.cols; j++) {
            innerHTML += "<td class='table-cell'><input type='text' class='table-input'/></td>";
        }
        innerHTML += "</tr>";
    }
    this.tableCells = document.getElementsByClassName('table-cell');
    this.tableInputs = document.getElementsByClassName('table-input');
    this.tableHeaders = document.getElementsByClassName('table-cell-th');
    innerHTML += "</table>";
    this.container.innerHTML = innerHTML;
    this.tableElement = document.getElementById('array_table');
    this.setCellInnerHTML = function(rows, cols, text) {
        this.tableCells[(rows*this.cols) + cols].innerHTML = text;
    }
    this.setTableHeader = function(col, text) {
        this.tableHeaders[col].innerHTML = text;
    }
    this.setInputValue = function(rows, cols, text) {
        this.tableInputs[(rows*this.cols) + cols].readOnly = false;
        this.tableInputs[(rows*this.cols) + cols].value = text;
    }
    this.getDataArray = function() {
        var data = []
        for (var i=0; i< this.rows; i++) {
            for (var j=0; j< this.cols; j++) {
                data.push(this.tableInputs[(i*this.cols) + j].value);
            }
        }
        return data;
    }
    this.readOnly = function(rows, cols, boolean) {
        this.tableInputs[(rows*this.cols) + cols].readOnly = boolean;
    }
    this.getInputValue = function(rows, cols) {
        return this.tableInputs[(rows*this.cols) + cols].innerHTML;
    }
}