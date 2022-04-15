from wagtail.core.blocks import (CharBlock, ChoiceBlock, RichTextBlock,
                                 StreamBlock, StructBlock, TextBlock)
from wagtail.embeds.blocks import EmbedBlock
from wagtail.images.blocks import ImageChooserBlock
from wagtailcharts.blocks import ChartBlock

COLORS = (
    ('#1f83b4', 'Blue'),
    ('#12a2a8', 'Eastern Blue'),
    ('#2ca030', 'Forest green'),
    ('#78a641', 'Sushi'),
    ('#bcbd22', 'Key Lime Pie'),
    ('#ffbf50', 'Texas rose'),
    ('#ffaa0e', 'Yellow sea'),
    ('#ff7f0e', 'Flamenco'),
    ('#d63a3a', 'Valencia'),
    ('#c7519c', 'Mulberry'),
    ('#ba43b4', 'Fuchsia Pink'),
    ('#8a60b0', 'Wisteria'),
    ('#6f63bb', 'Blue Violet'),
)

CHART_TYPES = (
    ('line', 'Línurit'),
)
class ContentBlocks(StreamBlock):
    title = CharBlock()
    chart_block = ChartBlock(colors=COLORS, chart_types=CHART_TYPES)
