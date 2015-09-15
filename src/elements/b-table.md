{
  title: "Tables",
  element: 'b-table',
  category: "elements",
  section: "data",
  order: 2
}

# b-table

`b-table` transforms a classic HTML table into a full-featured datagrid.

## Usage

```html
<b-table-column-toggle for="sample"></b-table-column-toggle>
<table is="b-table" id="sample" sortable>
    <thead is="b-thead">
        <tr>
            <th data-key="id"><button>ID</button></th>
            <th data-key="firstname">
                <button>Firstname</button>
                <b-table-column-filter></b-table-column-filter>
            </th>
            <th data-key="lastname">
                <button>Lastname</button>
                <b-table-column-filter></b-table-column-filter>
            </th>
            <th data-key="email">
                <button>Email</button>
                <b-table-column-filter></b-table-column-filter>
            </th>
        </tr>
    </thead>
</table>

<script type="text/javascript">
    window.addEventListener('WebComponentsReady', function() {
        var table = document.querySelector('table');
        table.data = [ 
            { 
              "id" : 0,
              "firstname" : "David",
              "lastname" : "Anderson",
              "email" : "l.rodriguez@miller.com"
            },
            { 
              "id" : 1,
              "firstname" : "Jeffrey",
              "lastname" : "Gonzalez",
              "email" : "g.anderson@moore.com"
            },
            ...
        ];
    });
</script>
```