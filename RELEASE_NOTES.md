## Version x.x
* Default chart block template updated with aria labels, a fallback paragraph and a comment about overriding the template.
* Tested against Wagtail 6.1
* Added a callback option to block so that the developer can create custom callbacks to customize the chart config, per block.

## Version 0.4
* Added support for Wagtail 6.0
* Tested against django 5.0
* Breaking changes to stacked charts, they were always reversing the dataset and legend.
  It is now optional to reverse the legend for the chart with a setting.

## Version 0.3.3
* Fixed a regression from release 0.3.2 when using multiple charts on same page.

## Version 0.3.2
* Added support for external HTML legend
* Fixed bug in doughnut chart

## Version 0.3.1
* Added options for border width and border color for pie charts
* Added support for Wagtail 5
* Removed support for Wagtail <3

## Version 0.3
* Added Waterfall Chart
* Added DataLabels
* Added options for:
  * grid display
  * axis display
  * y tick precision
  * datalabel and tooltip precision
* Added grouping of options into multiple collapsible panels with buttons
* Multiple bugfixes

## Version 0.2
* Added support for Wagtail 3.0

## Version 0.1
* Initial release
