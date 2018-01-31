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
        //console.log(value);
        return cell;
    }

    function createRow(arr) {
        var row = document.createElement('tr');
        for (var i = 0; i < arr.length; i++)
            row.appendChild(createCell(arr[i]));
        return row;
    }


    window.TableSorterFilter = function (table, filtersField) {
        this.table = table;
        this.tableHeader = this.table.querySelector('thead');
        this.filtersField = filtersField;
        this.testData = this.getTestData();
        this.filteredData = [];
        this.enabledFilters = {};
        this.nextValueId = 0;
        this.isFiltered = false;
        this.shownRowsId = [];
        this.originalData = this.getTableData();
        console.log(this.originalData);
        this.bindSorters();
        this.bindFilters();
        this.showResult();
    };

    TableSorterFilter.prototype.getTableData = function () {
        return {
            headers: Array.from(this.table.querySelectorAll('thead tr th')).map(function (value) {
                return value.innerHTML;
            }),
            content: Array.from(this.table.querySelectorAll('tbody tr')).map(function (row) {
                return Array.from(row.getElementsByTagName('td')).map(function (cell) {
                    return cell.innerText;
                });
            })
        };
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

    TableSorterFilter.prototype.showResult = function () {
        var newBody = document.createElement('tbody');
        var shownResult = this.isFiltered ? this.filteredData : this.testData;
        shownResult.forEach(function (item) {
            var cells = [];
            for (var key in item) {
                cells.push(item[key]);
            }
            newBody.appendChild(createRow(cells));
            cells = [];
        });
        this.table.replaceChild(newBody, this.table.querySelector('tbody'));
    };

    TableSorterFilter.prototype.comparatorFactory = function (fieldName, value) {
        var re = /\./g;
        var relp = value.replace(re, "-");
        var val = Date.parse(relp);
        var isDate = !isNaN(val);
        console.log(relp);
        console.log(val);
        console.log(isDate);

        if (isDate) {
            return function (a, b) {
                return Date.parse(a[fieldName]) > Date.parse(b[fieldName]);
            }
        } else if (Number.isInteger(Number(value))) {
            return function (a, b) {
                return a - b;
            }
        } else {
            return function (a, b) {
                return a[fieldName].localeCompare(b[fieldName]);
            }
        }
    };
    TableSorterFilter.prototype.sortByColumn = function (column) {
        if (this.isFiltered) {
            this.filteredData.sort(this.comparatorFactory(column, this.filteredData[0][column]));
        } else {
            this.testData.sort(this.comparatorFactory(column, this.testData[0][column]));
        }
    };

    TableSorterFilter.prototype.sorting = function (target) {
        if (target.getAttribute('sort-direction').localeCompare('backward') === 0) {
            target.setAttribute('sort-direction', 'forward');
            this.sortByColumn(target.innerText);
        } else {
            target.setAttribute('sort-direction', 'backward');
            this.sortByColumn(target.innerText);
            this.isFiltered ? this.filteredData.reverse() : this.testData.reverse();
        }
    };
    TableSorterFilter.prototype.bindSorters = function () {
        var mainContext = this;
        this.tableHeader.addEventListener('click', function (e) {
            if (!e.target.hasAttribute('sort-direction'))
                !e.target.setAttribute('sort-direction', 'backward');
            mainContext.sorting(e.target);
            mainContext.showResult();
        })
    };

    TableSorterFilter.prototype.getFilterItems = function () {
        var filter = {
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
        var newId = this.table.id + '-checkbox' + this.nextValueId;
        this.nextValueId++;
        var label = document.createElement('label');
        input.setAttribute('id', newId);
        label.setAttribute('for', newId);
        return label;
    };

    TableSorterFilter.prototype.createFilterField = function () {
        var field = document.createElement('fieldset');
        var legend = document.createElement('legend');
        legend.innerText = "Filter by 'Type'";
        field.appendChild(legend);
        var checkboxes = this.getFilterItems();
        var mainContext = this;
        checkboxes.forEach(function (checkbox) {
            var label = mainContext.getLabelForInput(checkbox);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(checkbox.getAttribute('value')));
            field.appendChild(label);
        });
        return field;

    };

    TableSorterFilter.prototype.bindFilters = function () {
        var filters = this.createFilterField();
        this.filtersField.appendChild(filters);
        var mainContext = this;
        this.filtersField.addEventListener('change', function (e) {
            mainContext.enabledFilters['Type'] = mainContext.getEnabledFilters(mainContext.filtersField);
            mainContext.isFiltered = mainContext.enabledFilters['Type'].length > 0;
            if (mainContext.isFiltered) {
                mainContext.filterData();
            }
            mainContext.showResult();
        })
    };


    TableSorterFilter.prototype.filterData = function () {
        var shownRowsId = [];
        var saveIds = [];
        this.filteredData = [];
        var mainContext = this;

        this.testData.forEach(function (row, index) {
            for (var keys in mainContext.enabledFilters) {
                for (var i = 0; i < mainContext.enabledFilters[keys].length; i++) {
                    if (!row[keys].localeCompare(mainContext.enabledFilters[keys][i]))
                        saveIds.push(index);
                }
            }
        });
        var uIds = [];
        Object.keys(this.enabledFilters).length > 1 ? uIds = uniq_fast(saveIds) : uIds = saveIds;

        for (var i = 0; i < uIds.length; i++) {
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

    TableSorterFilter.prototype.getEnabledFilters = function (field) {
        return Array.from(field.querySelectorAll(':checked')).map(function (value) {
            return value.getAttribute('value');
        });
    };
}(window));
