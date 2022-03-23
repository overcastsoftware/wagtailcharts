from wagtail.core.blocks import (CharBlock, ChoiceBlock, RichTextBlock,
                                 StreamBlock, StructBlock, TextBlock)
from wagtail.embeds.blocks import EmbedBlock
from wagtail.images.blocks import ImageChooserBlock
from wagtailcharts.blocks import CartesianChartBlock as ChartBlock


class ContentBlocks(StreamBlock):
    title = CharBlock()
    #chart_block = ChartBlock()
    chart_block = ChartBlock(template='home/custom_chart.html')
