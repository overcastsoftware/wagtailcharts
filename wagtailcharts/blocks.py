import json

from django import forms
from django.utils.functional import cached_property
from wagtail.core.blocks import (BooleanBlock, CharBlock, ChoiceBlock,
                                 StructBlock, StructValue, TextBlock)
from wagtail.core.blocks.struct_block import StructBlockAdapter
from wagtail.core.telepath import register

CHART_TYPES = (
    ('bar', 'Line/Bar/Area chart'),
    ('pie', 'Pie chart'),
    ('doughnut', 'Doughnut chart'),
    ('radar', 'Radar chart'),
#    ('polarArea', 'Polar chart'),
)

BAR_CHART_TYPES = (
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



class SettingsStructValue(StructValue):
    
    @property
    def config(self):
        return json.dumps(dict(self))


class ChartSettingsBlock(StructBlock):
    y_left_min = CharBlock(required=False, label='Left Y axis minimum value')
    y_left_max = CharBlock(required=False, label='Left Y axis maximum value')
    y_left_step_size = CharBlock(required=False, label='Left Y axis step size')
    y_left_label = CharBlock(required=False, label='Left Y axis label')

    y_right_min = CharBlock(required=False, label='Right Y axis minimum value')
    y_right_max = CharBlock(required=False, label='Right Y axis maximum value')
    y_right_step_size = CharBlock(required=False, label='Right Y axis step size')
    y_right_label = CharBlock(required=False, label='Right Y axis label')
    
    x_label = CharBlock(required=False, label='X axis label')

    stacking = ChoiceBlock(
        choices=(
            ('none', 'No stacking'),
            ('stacked', 'Stacked'),
            ('stacked_100', 'Stacked 100%'),
        ),
        default='none'
    )
    show_legend = BooleanBlock(default=False, required=False)
    legend_position = ChoiceBlock(
        choices=(
            ('top', 'Top'),
            ('bottom', 'Bottom'),
            ('left', 'Left'),
            ('right', 'Right'),
        ), default = 'top',
    )

    class Meta:
        form_template = 'wagtailcharts/blocks/settings.html'
        label = 'Chart Settings'
        value_class = SettingsStructValue


class ChartBlock(StructBlock):


    title = CharBlock()
    chart_type = ChoiceBlock(choices=CHART_TYPES, default='bar')
    datasets = TextBlock(default="[]")
    
    settings = ChartSettingsBlock()

    class Meta:
        icon = 'fa-chart'
        label = 'Chart Block'
        template = 'wagtailcharts/blocks/chart_block.html'
        colors = CHART_COLOR_CHOICES
        bar_chart_types = BAR_CHART_TYPES


class ChartBlockAdapter(StructBlockAdapter):
    js_constructor = 'wagtailcharts.blocks.ChartBlock'


    def js_args(self, block):
        result = super(ChartBlockAdapter, self).js_args(block)
        meta = result[2]
        meta['colors'] = block.meta.colors
        meta['bar_chart_types'] = block.meta.bar_chart_types
        result[2] = meta
        return result


    @cached_property
    def media(self):
        structblock_media = super().media
        return forms.Media(
            js=structblock_media._js + ['wagtailcharts/js/chart-dataset.js', 'wagtailcharts/js/jspreadsheet.js', 'wagtailcharts/js/jsuites.js'],
            css={** structblock_media._css, **{'all': ('wagtailcharts/css/jspreadsheet.css', 'wagtailcharts/css/jspreadsheet.theme.css', 'wagtailcharts/css/jsuites.css', 'wagtailcharts/css/wagtailcharts.css')}}
        )

register(ChartBlockAdapter(), ChartBlock)
