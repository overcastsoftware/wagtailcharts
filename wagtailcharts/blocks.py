from wagtail.core.blocks import StructBlock, CharBlock, TextBlock
from wagtail.core.blocks.struct_block import StructBlockAdapter
from django.utils.functional import cached_property
from wagtail.core.telepath import register
from django import forms


class CartesianChartBlock(StructBlock):
    title = CharBlock()
    datasets = TextBlock(default="[]")

    class Meta:
        icon = 'fa-chart'
        label = 'Cartesian Chart Block'
        template = 'blocks/cartesian_chart_block.html'


class CartesianChartAdapter(StructBlockAdapter):
    js_constructor = 'streams.blocks.ChartBlock'

    @cached_property
    def media(self):
        structblock_media = super().media
        print(structblock_media)
        return forms.Media(
            js=structblock_media._js + ['wagtail_charts/js/chart-dataset.js', 'wagtail_charts/js/jspreadsheet.js', 'wagtail_charts/js/jsuites.js'],
            css={** structblock_media._css, **{'all': ('wagtail_charts/css/jspreadsheet.css', 'wagtail_charts/css/jspreadsheet.theme.css', 'wagtail_charts/css/jsuites.css')}}
        )

register(CartesianChartAdapter(), CartesianChartBlock)