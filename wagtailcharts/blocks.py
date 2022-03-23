from django import forms
from django.utils.functional import cached_property
from wagtail.core.blocks import CharBlock, ChoiceBlock, StructBlock, TextBlock
from wagtail.core.blocks.struct_block import StructBlockAdapter
from wagtail.core.telepath import register

CHART_TYPES = (
    ('bar', 'Bar'),
    ('line', 'Line'),
    ('area', 'Area'),
)

CHART_COLOR_CHOICES = (
    ('#e6023b', 'Red'),
    ('#195c94', 'Blue'),
    ('#4caba5', 'Cyan'),
    ('#f47b27', 'Orange'),
    ('#8e50bd', 'Purple'),
    ('#4a4a4a', 'Grey'),
)


class CartesianChartBlock(StructBlock):
    title = CharBlock()
    # chart_type = ChoiceBlock(choices=CHART_TYPES)
    datasets = TextBlock(default="[]")

    class Meta:
        icon = 'fa-chart'
        label = 'Cartesian Chart Block'
        template = 'wagtailcharts/blocks/cartesian_chart_block.html'
        colors = CHART_COLOR_CHOICES
        chart_types = CHART_TYPES

class CartesianChartAdapter(StructBlockAdapter):
    js_constructor = 'streams.blocks.ChartBlock'


    def js_args(self, block):
        result = super(CartesianChartAdapter, self).js_args(block)
        print(result)
        meta = result[2]
        print(block.meta)
        print(dir(block.meta))
        meta['colors'] = block.meta.colors
        meta['chart_types'] = block.meta.chart_types
        result[2] = meta
        print(result)
        return result


    @cached_property
    def media(self):
        structblock_media = super().media
        return forms.Media(
            js=structblock_media._js + ['wagtailcharts/js/chart-dataset.js', 'wagtailcharts/js/jspreadsheet.js', 'wagtailcharts/js/jsuites.js'],
            css={** structblock_media._css, **{'all': ('wagtailcharts/css/jspreadsheet.css', 'wagtailcharts/css/jspreadsheet.theme.css', 'wagtailcharts/css/jsuites.css')}}
        )

register(CartesianChartAdapter(), CartesianChartBlock)
