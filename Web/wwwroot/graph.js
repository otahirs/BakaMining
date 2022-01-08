

window.RenderGraph = (dotString) => {
    window.graphviz.renderDot(dotString);
}

window.InitGraph = (element) => {
    
    var graph = d3.select(element);
    
    window.graphviz = graph.graphviz()
        .fit(true)
        .transition(function () {
            return d3.transition("main")
                .ease(d3.easeLinear)
                .duration(750);
        });
};