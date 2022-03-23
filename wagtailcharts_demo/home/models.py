from django.db import models
from wagtail.admin.edit_handlers import (FieldPanel, FieldRowPanel,
                                         InlinePanel, MultiFieldPanel,
                                         PageChooserPanel, StreamFieldPanel)
from wagtail.core.fields import RichTextField, StreamField
from wagtail.core.models import Page

from .blocks import ContentBlocks


class HomePage(Page):
    body = StreamField(ContentBlocks())

    content_panels = Page.content_panels + [
        StreamFieldPanel('body'),
    ]
