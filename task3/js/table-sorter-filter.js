(function (window) {
    "use strict";

    window.TableSorterFilter = function (table, filtersField) {
        this.table = table;
        this.filtersField = filtersField;

        this.originalData = API.getTableData(this.table);
        this.testData = API.tableDataToArrayOfObjects(this.originalData);

        this.isFiltered = false;
        this.filteredData = [];
        this.enabledFilters = [];
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
                newBody.appendChild(API.createRow(cells));
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
                filterValues.add(row[cellId]);
            });
            return Array.from(filterValues);
        },
        createFilterItems: function (filterName) {
            return this.getFilterValues(filterName).map( (value) => API.getCheckbox(filterName, value));
        },
        createFilterField: function (filterName) {
            var field = document.createElement('fieldset');
            var legend = document.createElement('legend');
            legend.innerText = "Filter by " + filterName;
            field.appendChild(legend);

            this.createFilterItems(filterName).forEach(function (checkbox) {
                var label = document.createElement('label');
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(checkbox.value));
                field.appendChild(label);
            });
            return field;
        },
        bindFilter: function (filterName) {
            var filter = this.createFilterField(filterName);
            this.filtersField.appendChild(filter);

            filter.addEventListener('change', function () {
              this.enabledFilters = this.getEnabledFilters(filterName);
              this.isFiltered = this.enabledFilters.length > 0;
              if (this.isFiltered) {
                this.filterData(filterName);
              }
              this.showResult();
            }.bind(this));
        },
        filterData: function (filterName) {
            this.filteredData = this.testData.filter(function (item) {
                return this.enabledFilters.indexOf(item[filterName]) >= 0
            }.bind(this)) || [];
        },
        getEnabledFilters: function () {
            return Array.from(this.filtersField.querySelectorAll(':checked')).map(function (value) {
                return value.getAttribute('value');
            });
        }
    };
}(window));
