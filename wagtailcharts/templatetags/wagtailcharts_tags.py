from django import template
from django.template.loader import render_to_string

register = template.Library()

@register.simple_tag(takes_context=True)
def render_charts(context):
    return render_to_string('wagtailcharts/tags/render_charts.html', context=context)

@register.filter()
def addspace(val):
    return val.replace("_", " ")
