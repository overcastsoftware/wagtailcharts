from django import template

register = template.Library()

@register.inclusion_tag('wagtailcharts/tags/render_charts.html')
def render_charts():
    pass
