import json

from django import forms
from django.utils.functional import cached_property
from wagtail.core.blocks import (BooleanBlock, CharBlock, ChoiceBlock,
                                 StructBlock, StructValue, TextBlock)
import wagtail

if wagtail.VERSION[0] < 3:
    from wagtail.core.blocks.struct_block import StructBlockAdapter
else:
    from wagtail.blocks.struct_block import StructBlockAdapter

from wagtail.core.telepath import register

CHART_TYPES = (
    ('line', 'Line Chart'),
    ('bar', 'Vertical Bar Chart'),
    ('bar_horizontal', 'Horizontal Bar Chart'),
    ('area', 'Area Chart'),
    ('multi', 'Combo Line/Bar/Area Chart'),
    ('pie', 'Pie Chart'),
    ('doughnut', 'Doughnut Chart'),
    ('radar', 'Radar Chart'),
    ('polar', 'Polar Chart'),
    #('scatter', 'Scatter Chart'),
    #('bubble', 'Bubble Chart')
)

MULTI_CHART_TYPES = (
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

    def __init__(self, chart_types=CHART_TYPES, **kwargs):
        super().__init__(**kwargs)
        self.chart_types = chart_types
        chart_type_block = ChoiceBlock(choices=chart_types, label='Chart Type', required=True, default=chart_types[0][0])
        chart_type_block.set_name('chart_type')
        self.child_blocks['chart_type'] = chart_type_block
        self.child_blocks.move_to_end('chart_type', last=False)

    title = CharBlock()
    #chart_type = ChoiceBlock(choices=self.chart_types, default='bar')
    datasets = TextBlock(default='{"data":[], "options":{}}')
    
    settings = ChartSettingsBlock()

    class Meta:
        icon = 'fa-chart'
        label = 'Chart Block'
        template = 'wagtailcharts/blocks/chart_block.html'
        colors = CHART_COLOR_CHOICES
        multi_chart_types = MULTI_CHART_TYPES


class ChartBlockAdapter(StructBlockAdapter):
    js_constructor = 'wagtailcharts.blocks.ChartBlock'

    def js_args(self, block):
        result = super(ChartBlockAdapter, self).js_args(block)
        meta = result[2]
        meta['colors'] = block.meta.colors
        meta['multi_chart_types'] = block.meta.multi_chart_types
        result[2] = meta
        return result


    @cached_property
    def media(self):
        structblock_media = super().media
        return forms.Media(
            js=structblock_media._js + ['wagtailcharts/js/chart-types.js', 'wagtailcharts/js/chart-dataset.js', 'wagtailcharts/js/jspreadsheet.js', 'wagtailcharts/js/jsuites.js'],
            css={** structblock_media._css, **{'all': ('wagtailcharts/css/jspreadsheet.css', 'wagtailcharts/css/jspreadsheet.theme.css', 'wagtailcharts/css/jsuites.css', 'wagtailcharts/css/wagtailcharts.css')}}
        )

register(ChartBlockAdapter(), ChartBlock)
