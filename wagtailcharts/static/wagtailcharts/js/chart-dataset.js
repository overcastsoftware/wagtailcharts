class ChartDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {

    var that = this

    /* Hide TextField and display table instead */
    const block = super.render(placeholder, prefix, initialState, initialError);
    const dataSetField = document.getElementById(prefix + '-datasets');
    var table = document.createElement( 'div' );
    table.setAttribute("id", prefix + "-dataset-table")
    dataSetField.parentNode.insertBefore( table, dataSetField.nextSibling );
    dataSetField.style.display = 'none';

    /* Add listener to chartType dropdown to rerender the spreadsheet based on chart type*/
    const chartTypeField = document.getElementById(prefix + '-chart_type');
    chartTypeField.addEventListener('input', function (event) {
      jexcel.destroy(document.getElementById(prefix + "-dataset-table"), false);
      renderSpreadSheet(event.target.value);
    }, false);

    /* Parse the options part of the spreadsheet for storage */
    function parseOptions(spread, chartType){
      let options = {};
      options.title = spread.getColumnData(0);
      options.color = spread.getColumnData(1);
      for (var j=0; j < chart_types[chartType].dataset_options.length; j++){
        options[chart_types[chartType].dataset_options[j]] = spread.getColumnData(j+2);
      }
      return options;
    }

    /* Parse the data part of the spreadsheet for storage */
    function parseData(spread, chartType){
      let data = []
      let spreadData = spread.getData();
      for (var i = 0; i < spreadData.length; i++) {
        data.push(spreadData[i].slice(chart_types[chartType].dataset_options.length+2))
      }
      return data
    }

    /* Build the data for the spreadsheet from data and options based on chart type */
    function buildData(sdata, chartType){
      let data = [];
      let spreadData = sdata["data"];
      let spreadOptions = sdata["options"];
      for (var i=0; i < spreadData.length; i++){
        let row = spreadData[i];
        if (spreadOptions.title){
          row.splice(0,0, spreadOptions.title[i], spreadOptions.color[i])
        } else {
          row.splice(0,0, "", "")
        }
        for ( var j=0; j < chart_types[chartType].dataset_options.length; j++){
          if( spreadOptions[chart_types[chartType].dataset_options[j]]){
            row.splice(2,0, spreadOptions[chart_types[chartType].dataset_options[j]][i])
          }else{
            row.splice(2,0, "")
          }
        }
        data.push(row);
      }
      return data;
    }

    /* Extra settings columns, match strings added to dataset_options on chart type */
    var EXTRA_SETTINGS = {
      type: { type: 'dropdown', title:'Type', width:100, source: this.meta.multi_chart_types.map(x => {return {'id':x[0], 'name':x[1]}}) },
      yaxis: { type: 'dropdown', title:'Y axis', width:100, source: [{'id': 'left', 'name': 'Left'}, {'id': 'right', 'name': 'Right'}]},
    }

    function buildOptionColumns(chartType) {
      // default columns, used for all chart types
      var columns = [
        { type: 'text', title:'Title', width: 120 },
        { type: 'dropdown', title: 'Color', width:100, source: that.meta.colors.map(x => {return {'id':x[0], 'name':x[1], 'color': x[0]}}) },
      ]

      // append extra columns for specific selected chart type
      for( var i = 0; i < chart_types[chartType].dataset_options.length; i++){
        columns.push(EXTRA_SETTINGS[chart_types[chartType].dataset_options[i]])
      }

      return columns
    }

    function renderSpreadSheet(chartType){
      
      let columns = buildOptionColumns(chartType);

      // build spreadsheet
      jspreadsheet(document.getElementById(prefix + "-dataset-table"), {
        data: buildData(JSON.parse(dataSetField.value), chartType),
        columns: columns,
        minDimensions:[columns.length+1,2],
        tableOverflow: true,
        tableWidth: "100%",
        rowDrag: true,
        mergeCells:{
          A1:[columns.length,1]
        },
        updateTable: function(el, cell, x, y, source, value, id) {
          if (x == 0 && y == 0) {
              cell.classList.add('readonly');
              document.querySelector('#' + prefix + '-dataset-table td[data-y="0"]').textContent = "Labels";
          }
        },
        onevent: function(instance, cell, x, y, value) {
          dataSetField.value = JSON.stringify({"options": parseOptions(this, chartType), "data": parseData(this, chartType)});
        }
      });
    }

    renderSpreadSheet(chartTypeField.value);

    return block;
  }
}
window.telepath.register('wagtailcharts.blocks.ChartBlock', ChartDefinition);


$(document).ready(function(){
  $(document).on('click', 'button.button-chart-settings', function(){
      var t = $(this).data('target');
      var $target = $(this).parent().find('#'+t+" .collapsible-target")
      if (!$target.parent().hasClass('collapsed')) {
          $target.parent().addClass('collapsed');
          $target.hide('fast');
      } else {
          $target.parent().removeClass('collapsed');
          $target.show('fast');
      }
  });
});