(function (window) {
    "use strict";

    window.TableSorterFilter = function (table, filtersField) {
        this.table = table;
        this.filtersField = filtersField;
        this.originalData = getTableData(this.table);
        this.testData = tableDataToArrayOfObjects(this.originalData);
        this.isFiltered = false;
        this.filteredData = [];
        this.enabledFilters = {};
        this.nextValueId = 0;
        this.bindSorters();
        this.bindFilter('Type');
    };
    window.TableSorterFilter.prototype = {
        showResult: function () {
            var newBody = document.createElement('tbody');
            var shownResult = this.isFiltered ? this.filteredData : this.testData;
            shownResult.forEach(function (item) {
                var cells = [];
                for (var key in item) {
                    cells.push(item[key]);
                }
                newBody.appendChild(createRow(cells));
            });
            this.table.replaceChild(newBody, this.table.querySelector('tbody'));
        },
        comparatorFactory: function (fieldName, value) {
            var re = /\./g;
            var relp = value.replace(re, "-");
            var val = Date.parse(relp);
            var isDate = !isNaN(val);
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
        },
        sortByColumn: function (column) {
            if (this.isFiltered) {
                this.filteredData.sort(this.comparatorFactory(column, this.filteredData[0][column]));
                return this.filteredData;
            } else {
                this.testData.sort(this.comparatorFactory(column, this.testData[0][column]));
                return this.testData;
            }
        },
        sorting: function (target) {
            if (target.getAttribute('sort-direction').localeCompare('backward') === 0) {
                target.setAttribute('sort-direction', 'forward');
                this.sortByColumn(target.innerText);
            } else {
                target.setAttribute('sort-direction', 'backward');
                this.sortByColumn(target.innerText).reverse();
            }
        },
        bindSorters: function () {
            var mainContext = this;
            this.table.querySelector('thead').addEventListener('click', function (e) {
                if (!e.target.hasAttribute('sort-direction'))
                    !e.target.setAttribute('sort-direction', 'backward');
                mainContext.sorting(e.target);
                mainContext.showResult();
            })
        },
        getFilterValues: function (filterName) {
            var cellId = this.originalData.headers.indexOf(filterName);
            var filterValues = new Set();
            this.originalData.content.forEach(function (row) {
                filterValues.add(row[cellId])
            });
            return filterValues;
        },
        createFilterItems: function (filterName) {
            var items = [];
            this.getFilterValues(filterName).forEach(function (value) {
                items.push(getCheckbox(filterName, value))
            });
            return items;
        },
        getLabelForInput: function (input) {
            var newId = this.table.id + '-checkbox' + this.nextValueId;
            this.nextValueId++;
            var label = document.createElement('label');
            input.setAttribute('id', newId);
            label.setAttribute('for', newId);
            return label;
        },
        createFilterField: function (filterName) {
            var field = document.createElement('fieldset');
            var legend = document.createElement('legend');
            legend.innerText = "Filter by " + filterName;
            field.appendChild(legend);
            var checkboxes = this.createFilterItems(filterName);
            var mainContext = this;
            checkboxes.forEach(function (checkbox) {
                var label = mainContext.getLabelForInput(checkbox);
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(checkbox.getAttribute('value')));
                field.appendChild(label);
            });
            return field;
        },
        bindFilter: function (filterName) {
            var filter = this.createFilterField(filterName);
            this.filtersField.appendChild(filter);
            var mainContext = this;
            filter.addEventListener('change', function (e) {
                mainContext.enabledFilters = mainContext.getEnabledFilters(filterName);
                mainContext.isFiltered = mainContext.enabledFilters.length > 0;
                if (mainContext.isFiltered) {
                    mainContext.filterData(filterName);
                }
                mainContext.showResult();
            })
        },
        filterData: function (filterName) {
            var shownRowsIdSet = new Set();
            this.filteredData = [];
            var mainContext = this;
            this.testData.forEach(function (row, index) {
                for (var i = 0; i < mainContext.enabledFilters.length; i++) {
                    if (row[filterName].localeCompare(mainContext.enabledFilters[i]) === 0)
                        shownRowsIdSet.add(index);
                }
            });
            shownRowsIdSet.forEach(function (id) {
                mainContext.filteredData.push(mainContext.testData[id])
            });
        },
        getEnabledFilters: function (filterName) {
            return Array.from(this.filtersField.querySelectorAll('[name=' + filterName + ']:checked')).map(function (value) {
                return value.getAttribute('value');
            });

        }
    };
}(window));
