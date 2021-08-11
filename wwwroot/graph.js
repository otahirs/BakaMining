

window.UpdateGraph = (dotString) => {
    window.graphviz.renderDot(dotString);
}

window.DrawGraph = (element, dotString) => {
    
    var graph = d3.select(element);
    
    window.graphviz = graph.graphviz()
        .width(element.offsetWidth)
        .transition(function () {
            return d3.transition("main")
                .ease(d3.easeLinear)
                .duration(750);
        })
        .renderDot(dotString);

    window.addEventListener('resize', () =>
    {
        graph.select('svg').attr('width', element.offsetWidth);
    });
};