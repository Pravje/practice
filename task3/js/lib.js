(function (window) {
    "use strict";
    function getCheckbox(type, value) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('name', type);
        checkbox.setAttribute('value', value);
        return checkbox;
    }

    function createCell(value) {
        var cell = document.createElement('td');
        cell.innerText = value;
        return cell;
    }

    function createRow(arr) {
        var row = document.createElement('tr');
        for (var i = 0; i < arr.length; i++)
            row.appendChild(createCell(arr[i]));
        return row;
    }

    function getTableData(table) {
        return {
            headers: Array.from(table.querySelectorAll('thead th')).map(function (value) {
                return value.innerHTML;
            }),
            content: Array.from(table.querySelectorAll('tbody tr')).map(function (row) {
                return Array.from(row.getElementsByTagName('td')).map(function (cell) {
                    return cell.innerText;
                });
            })
        };
    }

    function tableDataToArrayOfObjects(tableData) {
        let array = [];
        let rowCount = tableData.content.length;
        let cellCount = tableData.content[0].length;
        for (let i = 0; i < rowCount; i++) {
            let entry = {};
            for (let j = 0; j < cellCount; j++) {
                entry[tableData.headers[j]] = tableData.content[i][j];
            }
            array.push(entry);
        }
        return array;
    }
    function swapDayMonth(dateString) {
        return dateString.substr(3, 2)+"/"+dateString.substr(0, 2)+"/"+dateString.substr(6, 4);
    }
    window.API = {
      getCheckbox: getCheckbox,
      createRow: createRow,
      getTableData: getTableData,
      tableDataToArrayOfObjects: tableDataToArrayOfObjects,
      swapDayMonth: swapDayMonth
    };
}(window));