from django import template
from django.template.loader import render_to_string

register = template.Library()

@register.simple_tag
def render_charts():
    return render_to_string('wagtailcharts/tags/render_charts.html')

@register.filter()
def addspace(val):
    return val.replace("_", " ")
