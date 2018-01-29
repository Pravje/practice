(function (window) {
    "use strict";
    window.TableSorterFilter = function (element) {
        this.element = element;
        this.filtersField = null;
        this.testData = [];
        this.filteredData = [];
        //this.bindetFilters = [];
        this.allowedFiltersVariants = [];
        this.enabledFilters = {};
        this.tableHeader = null;
        this.tableBody = null;
        this.headers = [];
        this.allowedColumns = [];
        this.nextValueId = 0;
        this.isFiltered = false;
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
                'Type': 'Desktop',
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
        this.allowedFiltersVariants = [
            {
                'Type': ['Web', 'Mobile', 'Desktop', 'Support'],
                'Status': ['Done', 'In progress']
            }/*,
            {
                'Status': ['Done', 'In progress']
            }*/
        ];
        this.testData = this.getTestData();
        //this.shownData = this.getTestData();
    };

    TableSorterFilter.prototype.isAllowedColumn = function (column) {
        return this.allowedColumns.indexOf(column) < 0 ? false : true;
    };
    TableSorterFilter.prototype.isAllowedFilter = function (column) {
        console.log('method isAllowedFilter()')
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
        for (var i = 0; i < arr.length; i++)
            row.appendChild(createCell(arr[i]));
        return row;
    }

    TableSorterFilter.prototype.showResult = function () {
        var newBody = document.createElement('tbody');
        var shownResult = this.isFiltered ? this.filteredData : this.testData;
        shownResult.forEach(function (item, i, arr) {
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

    TableSorterFilter.prototype.sortForward = function (column) {
        this.sortByColumn(column);
    };

    TableSorterFilter.prototype.sortBackward = function (column) {
        this.sortByColumn(column);
        this.isFiltered ? this.filteredData.reverse() : this.testData.reverse();
    };

    TableSorterFilter.prototype.sortByColumn = function (column) {
        //console.log('Sorting by \'' + column + '\':');
        this.isFiltered ?  this.filteredData.sort(this.comparatorFactory(column)) : this.testData.sort(this.comparatorFactory(column));
    };

    TableSorterFilter.prototype.doSort = function (target) {
        if (target.getAttribute('sort-direction').localeCompare('backward') === 0) {
            target.setAttribute('sort-direction', 'forward');
            this.sortForward(target.innerText);
        } else {
            target.setAttribute('sort-direction', 'backward');
            this.sortBackward(target.innerText);
        }
    };
    TableSorterFilter.prototype.bindSorters = function () {
        var mainContext = this;
        this.tableHeader.addEventListener('click', function (e) {
            if (e.target.tagName === 'TH') {
                if (mainContext.isAllowedColumn(e.target.innerText)) {
                    if (!e.target.hasAttribute('sort-direction'))
                        !e.target.setAttribute('sort-direction', 'backward');
                    mainContext.doSort(e.target);
                    mainContext.showResult();
                }
            }
        })
    };
    TableSorterFilter.prototype.getFilterFieldgroup = function (field) {
    };

    function getCheckbox(type, value) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('name', type);
        checkbox.setAttribute('value', value);
        return checkbox;
    }

    TableSorterFilter.prototype.getFilterItems = function (filter) {
        filter = {
            'Type': ['Web', 'Mobile', 'Desktop', 'Support']
        };
        var items = [];
        for (var key in filter) {
            filter[key].forEach(function (value) {
                items.push(getCheckbox(key, value));
            })
        }
        return items;
    };

    TableSorterFilter.prototype.getLabelForInput = function (input) {
        var newId = 'checkbox' + this.nextValueId;
        this.nextValueId++;
        var label = document.createElement('label');
        input.setAttribute('id', newId);
        label.setAttribute('for', newId);
        return label;
    };

    TableSorterFilter.prototype.createFilterField = function (filter) {
        var field = document.createElement('fieldset');
        var legend = document.createElement('legend');
        legend.innerText = "Filter by 'Type'";
        field.appendChild(legend);
        var checkboxes = this.getFilterItems(filter);
        var mainContext = this;
        var labels = [];
        checkboxes.forEach(function (checkbox) {
            var label = mainContext.getLabelForInput(checkbox);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(checkbox.getAttribute('value')));
            field.appendChild(label);
            //console.log(label);
        });
        //console.log(field);
        return field;

    };

    TableSorterFilter.prototype.bindFilters = function (filtersField) {
        this.filtersField = filtersField;
        this.filtersField.appendChild(this.createFilterField({}));
        var mainContext = this;
        this.filtersField.addEventListener('change', function (e) {
            mainContext.isFiltered = mainContext.getEnabledFilters();
            if (mainContext.isFiltered) {
                // фильтруєм
                //console.log('фильтруєм ими:');
                //console.log(mainContext.enabledFilters);
                mainContext.filterData();
            }
            mainContext.showResult();
        })
    };

    TableSorterFilter.prototype.filterData = function () {
        var saveIds = [];
        this.filteredData = [];
        var mainContext = this;
        //this.filteredData = Array.from(Object.create(this.testData));
        this.testData.forEach(function (valueObj, index) {
            for (var keys in mainContext.enabledFilters) {
                for (var i = 0; i < mainContext.enabledFilters[keys].length; i++) {
                    if (valueObj[keys].localeCompare(mainContext.enabledFilters[keys][i]) === 0)
                        saveIds.push(index);
                }
            }
        });
        var uIds = [];
        // remove duplicates
        Object.keys(this.enabledFilters).length > 1 ? uIds = uniq_fast(saveIds) : uIds = saveIds;

        for (var i = 0; i < uIds.length; i++){
            this.filteredData.push(this.testData[uIds[i]])
        }
    };

    function uniq_fast(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for (var i = 0; i < len; i++) {
            var item = a[i];
            if (seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }
        return out;
    }

    TableSorterFilter.prototype.getEnabledFilters = function () {
        var filters = this.filtersField.querySelectorAll('input[type=checkbox]:checked');
        if (filters.length > 0) {
            this.enabledFilters = {};
            var mainContext = this;
            filters.forEach(function (checkbox) {
                var column = checkbox.getAttribute('name');
                var value = checkbox.getAttribute('value');
                if (!mainContext.enabledFilters.hasOwnProperty(column)) {
                    mainContext.enabledFilters[column] = [value];
                } else {
                    mainContext.enabledFilters[column].push(value);
                }
            });
            return true;
        }
        return false;
    };

    TableSorterFilter.prototype.filterComparatorsFactory = function (filters) {
        return filters >= 10;
    };

    var filtered = [12, 5, 8, 130, 44].filter(TableSorterFilter.prototype.filterComparatorsFactory);
    //console.log(filtered);

})(window);
