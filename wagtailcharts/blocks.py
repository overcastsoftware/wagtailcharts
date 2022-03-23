from wagtail.core.blocks import StructBlock, CharBlock, TextBlock, ChoiceBlock
from wagtail.core.blocks.struct_block import StructBlockAdapter
from django.utils.functional import cached_property
from wagtail.core.telepath import register
from django import forms

CHART_TYPES = (
    ('bar', 'Line/Bar/Area chart'),
    ('pie', 'Pie chart'),
    ('doughnut', 'Doughnut chart'),
    ('radar', 'Radar chart'),
    ('polar', 'Polar chart')
)

class CartesianChartBlock(StructBlock):
    title = CharBlock()
    chart_type = ChoiceBlock(choices=CHART_TYPES)
    datasets = TextBlock(default="[]")

    class Meta:
        icon = 'fa-chart'
        label = 'Cartesian Chart Block'
        template = 'blocks/cartesian_chart_block.html'


class CartesianChartAdapter(StructBlockAdapter):
    js_constructor = 'streams.blocks.ChartBlock'


    def js_args(self, block):
        result = super(CartesianChartAdapter, self).js_args(block)
        meta = result[2]
        meta['colors'] = block.meta.colors
        meta['chart_types'] = block.meta.chart_types
        result[2] = meta
        return result


    @cached_property
    def media(self):
        structblock_media = super().media
        return forms.Media(
            js=structblock_media._js + ['wagtail_charts/js/chart-dataset.js', 'wagtail_charts/js/jspreadsheet.js', 'wagtail_charts/js/jsuites.js'],
            css={** structblock_media._css, **{'all': ('wagtail_charts/css/jspreadsheet.css', 'wagtail_charts/css/jspreadsheet.theme.css', 'wagtail_charts/css/jsuites.css')}}
        )

register(CartesianChartAdapter(), CartesianChartBlock)