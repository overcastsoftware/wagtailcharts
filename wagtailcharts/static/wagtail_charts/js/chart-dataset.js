class ChartDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    
    /* Hide TextField and display table instead */
    const block = super.render(placeholder, prefix, initialState, initialError);
    const dataSetField = document.getElementById(prefix + '-datasets');
    var table = document.createElement( 'div' );
    table.setAttribute("id", prefix + "-dataset-table")
    dataSetField.parentNode.insertBefore( table, dataSetField.nextSibling );
    dataSetField.style.display = 'none';

    function removeEmptyColumnsAndRows(spread){
      // Lets remove empty rows
      let data = spread.getData();
      for(let i=0; i < data.length; i++){
        let row = spread.getRowData(i);
        if(row.every(function(e){ return e === "" || e === undefined})){
          spread.deleteRow(i);
        }
      }
      // Then remove empty columns
      data = spread.getData();
      for(let i=0; i < data[0].length; i++){
        let col = spread.getColumnData(i);
        if(col.every(function(e){ return e === "" || e === undefined})){
          spread.deleteColumn(i);
        }
      }
    }

    /* Update TextField on changes */
    var spread = null;
    // var changed = function(instance, cell, x, y, value) {
    //   if(spread !== null){
        
    //     dataSetField.value = JSON.stringify((spread));
    //   }
    // }

    spread = jspreadsheet(document.getElementById(prefix + "-dataset-table"), {
      data: JSON.parse(dataSetField.value),
      columns: [
          { type: 'text', title:'Title', width:120 },
          { type: 'dropdown', title:'Type', width:100, source: this.meta.chart_types.map(x => {return {'id':x[0], 'name':x[1]}}) },
          { type: 'dropdown', title: 'Color', width:100, source: this.meta.colors.map(x => {return {'id':x[0], 'name':x[1], 'color': x[0]}}) }
      ],
      minDimensions:[20,2],
      tableOverflow: true,
      tableWidth: "100%",
      mergeCells:{
        A1:[3,1]
      },
      updateTable: function(el, cell, x, y, source, value, id) {
        if (x == 0 && y == 0) {
            cell.classList.add('readonly');
            document.querySelector('td[data-y="0"]').textContent = "Labels";
        }
      },
      //onchange: changed
    });

    return block;
  }
}
window.telepath.register('streams.blocks.ChartBlock', ChartDefinition);
