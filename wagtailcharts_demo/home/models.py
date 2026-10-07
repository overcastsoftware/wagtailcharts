from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField
from wagtail.models import Page

from .blocks import ContentBlocks


class HomePage(Page):
    body = StreamField(ContentBlocks())

    content_panels = Page.content_panels + [
        FieldPanel('body'),
    ]
