(function (window) {
    "use strict";
    window.TableSorterFilter = function (element) {
        this.element = element;
        this.testData = [];
        this.tableHeader = HTMLHeadElement;
        this.tableBody = HTMLBodyElement;
        this.headers = [];
        this.allowedColumns = [];
        //this.testMethod();
        this.init();
        //this.sortByColumn('Members');
        this.bindSorters();
    };
    TableSorterFilter.prototype.testMethod = function () {
        alert("TableSorterFilter.testMethod(): <-- this")
    };
    TableSorterFilter.prototype.getTestData = function () {
        return [
            {
                'Project name': 'First project',
                'Due date': '13.09.2017',
                'Created': '12.04.2017',
                'Members': 'Oleg',
                'Type': 'Web',
                'Status': 'Done',
                'Customer': 'John'
            },
            {
                'Project name': 'Second project',
                'Due date': '13.03.2017',
                'Created': '12.02.2017',
                'Members': 'John',
                'Type': 'Mobile',
                'Status': 'In progress',
                'Customer': 'Bill'
            },
            {
                'Project name': 'Third project',
                'Due date': '13.01.2017',
                'Created': '10.01.2017',
                'Members': 'Mark',
                'Type': 'desktop',
                'Status': 'Done',
                'Customer': 'David'
            },
            {
                'Project name': 'Fourth project',
                'Due date': '13.04.2017',
                'Created': '12.02.2017',
                'Members': 'Ann',
                'Type': 'Support',
                'Status': 'In progress',
                'Customer': 'Alexandro Rohas'
            },
            {
                'Project name': 'Fifth project',
                'Due date': '13.06.2017',
                'Created': '12.06.2017',
                'Members': 'Katy',
                'Type': 'Mobile',
                'Status': 'In progress',
                'Customer': 'John'
            }
        ];
    };

    TableSorterFilter.prototype.init = function () {
        this.tableHeader = this.element.querySelector('thead');
        this.tableBody = this.element.querySelector('tbody');
        //this.headers = this.tableHeader.querySelectorAll('tr th');
        this.allowedColumns = ['Project name', 'Due date', 'Created', 'Members', 'Type', 'Status', 'Customer'];
        this.testData = this.getTestData();
        //this.shownData = this.getTestData();
    };

    TableSorterFilter.prototype.isAllowedColumn = function (Column) {
        return this.allowedColumns.indexOf(Column) < 0 ? false : true;
    };
    TableSorterFilter.prototype.comparatorFactory = function (fieldName) {
        return function (a, b) {
            //console.log('compare(' + a[fieldName] + ",  " + b[fieldName] + ') = ' + a[fieldName].localeCompare(b[fieldName]));
            return a[fieldName].localeCompare(b[fieldName]);
        }
    };

    function compareString(a, b) {
        return a.localeCompare(b);
    }

    TableSorterFilter.prototype.sortForward = function (Column) {
        this.sortByColumn(Column);
    };

    TableSorterFilter.prototype.sortBackward = function (Column) {
        this.sortByColumn(Column);
        this.testData.reverse();
    };

    TableSorterFilter.prototype.sortByColumn = function (Column) {
        //console.clear();
        //this.logResult();
        //console.log('Sorting by \'' + Column + '\':');
        /*var arr = this.testData;
        arr.forEach(function(item, i, arr) {
            console.log( i + ": " + item + " массив:");
            //console.log(arr);
            var row = '';
            for (var key in arr[i]) {
                row+= arr[i][key] + '\t';
            }

            var row = '';
            for (var key in item) {
                row+= item[key] + '\t';
            }
            console.log(row);
        });*/
        this.testData.sort(this.comparatorFactory(Column));
        //this.logResult();
    };


    TableSorterFilter.prototype.getRowValues = function (object) {
        Object.keys(object).map(function (objectKey, index) {
            var value = object[objectKey];
            console.log(value);
            return value;
        });
    };
    TableSorterFilter.prototype.logResult = function () {
        for (var i = 0; i < this.testData.length; i++) {
            var row = '';
            for (var key in this.testData[i]) {
                row += this.testData[i][key] + '\t';
            }
            console.log(row);
        }
    };

    function createCell(value) {
        var cell = document.createElement('td');
        cell.innerText = value;
        //console.log(value);
        return cell;
    }
    function createRow(arr) {
        var row = document.createElement('tr');
        for(var i = 0; i < arr.length; i++)
            row.appendChild(createCell(arr[i]));
        return row;
    }
    TableSorterFilter.prototype.showResult = function () {
        var newBody = document.createElement('tbody');
        this.testData.forEach(function(item, i, arr) {
            var cells = [];
            for (var key in item) {
                cells.push(item[key]);
            }
            newBody.appendChild(createRow(cells));
            cells = [];
        });
        //console.log(newBody);
        this.element.replaceChild(newBody, this.tableBody);
        this.tableBody = this.element.querySelector('tbody');
    };


    TableSorterFilter.prototype.doSort = function (target) {
        if(target.getAttribute('sort-direction').localeCompare('backward') === 0){
            target.setAttribute('sort-direction','forward');
            this.sortForward(target.innerText);
        } else {
            target.setAttribute('sort-direction','backward');
            this.sortBackward(target.innerText);
        }
    };
    TableSorterFilter.prototype.bindSorters = function () {
        var mainContext = this;
        this.tableHeader.addEventListener('click', function (e) {
            if (e.target.tagName === 'TH') {
                if(mainContext.isAllowedColumn(e.target.innerText)){
                    if(!e.target.hasAttribute('sort-direction'))
                        !e.target.setAttribute('sort-direction','backward');
                    mainContext.doSort(e.target);
                    //mainContext.sortByColumn(e.target.innerText);
                    mainContext.showResult();
                }
            }
        })
        /*var headers = [];
        for (var key in this.testData[0]) {
            headers.push(key);
        }
        console.log(headers);*/
        /*var mainContext = this;
        this.headers.forEach(function (value) {
            value.addEventListener('click',function () {
                this.style.backgroundColor = '#999';
                mainContext.sortByColumn(this.innerText);
            })
        })*/
    }

})(window);
