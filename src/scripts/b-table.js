(function () {
    var BTableColumnFilterPrototype = Object.create(HTMLElement.prototype, {
            table: {
                enumerable: true,
                get: function () {
                    var parent = this.parentNode;
                    while (parent && parent.nodeName !== 'TABLE') {
                        parent = parent.parentNode;
                    }
                    return parent;
                }
            },
            thead: {
                enumerable: true,
                get: function () {
                    return this.table.querySelector('thead');
                }
            },
            key: {
                enumerable: true,
                get: function () {
                    return this.parentNode.dataset.key;
                }
            },
            toggle: {
                enumerable: true,
                get: function () {
                    return this.querySelector('a');
                }
            },
            dropdown: {
                enumerable: true,
                get: function () {
                    return this.querySelector('b-dropdown');
                }
            },
            value: {
                enumerable: true,
                get: function () {
                    return this.querySelector('input').value;
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.appendChild(this.template.content.cloneNode(true));
                    this.changeListener = this.valueChanged.bind(this);
                    this.toggle.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleDropdown();
                    }.bind(this));
                }
            },
            toggleDropdown: {
                enumerable: true,
                value: function () {
                    this.dropdown.toggle();
                    var input = this.dropdown.querySelector('input');
                    if (this.dropdown.open) {
                        input.focus();
                        input.addEventListener('change', this.changeListener, false);
                    } else {
                        input.removeEventListener('change', this.changeListener, false);
                    }
                }
            },
            valueChanged: {
                enumerable: true,
                value: function (e) {
                    this.toggleDropdown();
                    this.value ? this.setAttribute('applied', '') : this.removeAttribute('applied');
                    this.thead.applyFilters();
                }
            }
        });
    window.BTableColumnFilter = document.registerElement('b-table-column-filter', { prototype: BTableColumnFilterPrototype });
    Object.defineProperty(BTableColumnFilterPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <a>\u25BC</a> <b-dropdown> <ul> <li><input type="text" value=""></li> </ul> </b-dropdown> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());
(function () {
    var BTableColumnTogglePrototype = Object.create(HTMLElement.prototype, {
            table: {
                enumerable: true,
                get: function () {
                    return document.getElementById(this.getAttribute('for'));
                }
            },
            thead: {
                enumerable: true,
                get: function () {
                    if (!this.table)
                        return;
                    return this.table.querySelector('thead');
                }
            },
            hiddenColumns: {
                enumerable: true,
                get: function () {
                    return [].filter.call(this.querySelectorAll('input'), function (input) {
                        return !input.checked;
                    }).map(function (input) {
                        return input.dataset;
                    });
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    if (!this.table)
                        return;
                    if (this.table.data) {
                        this.render();
                    } else {
                        this.renderListener = this.render.bind(this);
                        this.table.addEventListener('data-set', this.renderListener);
                    }
                }
            },
            render: {
                enumerable: true,
                value: function () {
                    if (this.renderListener) {
                        this.table.removeEventListener('data-set', this.renderListener);
                    }
                    if (!this.thead || !this.thead.columns)
                        return;
                    var ul = document.createElement('ul');
                    this.thead.columns.forEach(function (col) {
                        var li = document.createElement('li'), label = document.createElement('label'), input = document.createElement('input');
                        input.type = 'checkbox';
                        input.checked = true;
                        input.dataset.key = col.key;
                        input.dataset.index = col.index;
                        label.appendChild(input);
                        label.appendChild(document.createTextNode(col.label));
                        li.appendChild(label);
                        ul.appendChild(li);
                        input.addEventListener('change', this.toggle.bind(this), false);
                    }, this);
                    this.appendChild(ul);
                    this.table.addEventListener('data-change', this.restoreHiddenColumns.bind(this));
                }
            },
            toggle: {
                enumerable: true,
                value: function (e) {
                    this.toggleDisplay(e.target.dataset.key, e.target.dataset.index, e.target.checked);
                }
            },
            toggleDisplay: {
                enumerable: true,
                value: function (key, index, show) {
                    var display = show ? 'table-cell' : 'none';
                    th = this.thead.querySelector('th[data-key="' + key + '"]');
                    th.style.display = display;
                    [].forEach.call(this.table.querySelectorAll('td[data-index="' + index + '"]'), function (cell) {
                        cell.style.display = display;
                    });
                }
            },
            restoreHiddenColumns: {
                enumerable: true,
                value: function () {
                    this.hiddenColumns.forEach(function (col) {
                        this.toggleDisplay(col.key, col.index, false);
                    }, this);
                }
            }
        });
    window.BTableColumnToggle = document.registerElement('b-table-column-toggle', { prototype: BTableColumnTogglePrototype });
}());
(function () {
    var BTablePrototype = Object.create(HTMLTableElement.prototype, {
            sortable: {
                enumerable: true,
                get: function () {
                    return this.hasAttribute('sortable');
                }
            },
            data: {
                enumerable: true,
                get: function () {
                    return this._data;
                },
                set: function (data) {
                    var event = this._data ? 'data-change' : 'data-set';
                    if (!this._data) {
                        this._data = data;
                    }
                    this._displayedData = data;
                    this.render(data);
                    this.dispatchEvent(new CustomEvent(event));
                }
            },
            displayedData: {
                enumerable: true,
                get: function () {
                    return this._displayedData;
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                }
            },
            render: {
                enumerable: true,
                value: function (data) {
                    var oldTbody = this.querySelector('tbody');
                    if (oldTbody) {
                        this.removeChild(oldTbody);
                    }
                    var tbody = document.createElement('tbody');
                    this.appendChild(tbody);
                    data.forEach(function (row, index) {
                        this.renderRow(tbody, row, index);
                    }, this);
                }
            },
            renderRow: {
                enumerable: true,
                value: function (tbody, rowData, index) {
                    var row = tbody.insertRow(index);
                    if (Array.isArray(rowData)) {
                        rowData.forEach(function (cellData, cellIndex) {
                            this.renderCell(row, cellData, cellIndex);
                        }, this);
                    } else {
                        Object.keys(rowData).forEach(function (key, cellIndex) {
                            this.renderCell(row, rowData[key], cellIndex);
                        }, this);
                    }
                }
            },
            renderCell: {
                enumerable: true,
                value: function (row, cellData, cellIndex) {
                    var cell = row.insertCell(cellIndex), cellContent = document.createTextNode(cellData);
                    cell.appendChild(cellContent);
                    cell.dataset.index = cellIndex;
                }
            }
        });
    window.BTable = document.registerElement('b-table', {
        prototype: BTablePrototype,
        extends: 'table'
    });
    Object.defineProperty(BTable.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLTableElement.prototype
    });
}());
(function () {
    var BTheadPrototype = Object.create(HTMLTableSectionElement.prototype, {
            table: {
                enumerable: true,
                get: function () {
                    return this.parentNode;
                }
            },
            currentSortKey: {
                enumerable: true,
                get: function () {
                    return this.currentSort ? this.currentSort.dataset.key : null;
                }
            },
            currentSortDirection: {
                enumerable: true,
                get: function () {
                    return this.currentSort ? this.currentSort.getAttribute('sort') : null;
                }
            },
            currentSort: {
                enumerable: true,
                get: function () {
                    return this.querySelector('th[sort]');
                }
            },
            columns: {
                enumerable: true,
                get: function () {
                    return [].map.call(this.querySelectorAll('th'), function (th, index) {
                        return {
                            index: index,
                            key: th.dataset.key,
                            label: th.querySelector('button').textContent
                        };
                    });
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    if (this.table.sortable) {
                        this.addSortListeners();
                    }
                }
            },
            toggleSort: {
                enumerable: true,
                value: function (e) {
                    var th = e.target.parentNode, key = th.dataset.key, direction = th.getAttribute('sort') === 'desc' ? 'asc' : 'desc';
                    if (this.currentSort) {
                        this.currentSort.removeAttribute('sort');
                    }
                    th.setAttribute('sort', direction);
                    this.table.data = this.sort(this.table.displayedData, key, direction);
                }
            },
            sort: {
                enumerable: true,
                value: function (data, key, direction) {
                    var sorted = data.sort(function (a, b) {
                            if (a[key] > b[key])
                                return 1;
                            if (a[key] < b[key])
                                return -1;
                            return 0;
                        });
                    if (direction === 'asc')
                        sorted.reverse();
                    return sorted;
                }
            },
            addSortListeners: {
                enumerable: true,
                value: function () {
                    var buttons = this.querySelectorAll('th button');
                    for (var i = 0; i < buttons.length; i++) {
                        buttons[i].addEventListener('click', this.toggleSort.bind(this), false);
                    }
                }
            },
            applyFilters: {
                enumerable: true,
                value: function () {
                    var data = this.table.data, filters = this.querySelectorAll('b-table-column-filter[applied]');
                    [].forEach.call(filters, function (filter) {
                        var regex = new RegExp(filter.value, 'i', 'g');
                        data = data.filter(function (row) {
                            return row[filter.key].match(regex);
                        }, this);
                    });
                    if (this.currentSort) {
                        data = this.sort(data, this.currentSortKey, this.currentSortDirection);
                    }
                    this.table.data = data;
                }
            }
        });
    window.BThead = document.registerElement('b-thead', {
        prototype: BTheadPrototype,
        extends: 'thead'
    });
    Object.defineProperty(BThead.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLTableSectionElement.prototype
    });
}());