class ChartDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    /* Limtit metrictype selections based on category */
    const block = super.render(placeholder, prefix, initialState, initialError);
    const dataSetField = document.getElementById(prefix + '-datasets');
    var table = document.createElement( 'div' );
    table.setAttribute("id", prefix + "-dataset-table")
    dataSetField.parentNode.insertBefore( table, dataSetField.nextSibling );
    dataSetField.style.display = 'none';

    var spread = null;

    var changed = function(instance, cell, x, y, value) {
      if(spread !== null){
        dataSetField.value = JSON.stringify(spread.getData());
        console.log(dataSetField.value)
      }
    }


    spread = jspreadsheet(document.getElementById(prefix + "-dataset-table"), {
      data: JSON.parse(dataSetField.value),
      columns: [
          { type: 'text', title:'Title', width:120 },
          { type: 'dropdown', title:'Type', width:200, source:[ "Line", "Bar", "Area" ] },
          { type: 'color', title: 'Color', width:200 }
      ],
      minDimensions:[20,2],
      tableOverflow: true,
      tableWidth: "100%",
      mergeCells:{
        A1:[3,1]
      },
      updateTable: function(el, cell, x, y, source, value, id) {
        if (x == 0 && y == 0) {
            cell.innerHTML = "Labels ->";
            cell.classList.add('readonly');
            cell.style.textAlign = 'right';
        }
      },
      onchange: changed
    });

    return block;
  }
}
window.telepath.register('streams.blocks.ChartBlock', ChartDefinition);
