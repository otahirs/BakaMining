// sources
// https://bl.ocks.org/bsullins/4e6ea24fe0739c88a2fd95125a616a5b
// https://observablehq.com/@foolishhmy/force-directed-graph-network-graph-with-arrowheads-and-lab/2
// https://github.com/LironHazan/directed-graph-flow-experiments

window.DrawGraph = (element, nodes, links, start_node, end_node) => {

    const height = 1000;
    const width = 700;

    var svg = d3.select(element).append('svg')
        .classed("svg-container", true)
        .call(d3.zoom().on("zoom", (event, d) => {
            svg.attr("transform", event.transform)
        }))
        .append("g");

    //appending little triangles, path object, as arrowhead
    //The <defs> element is used to store graphical objects that will be used at a later time
    //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
    svg.append('defs').append('marker')
        .attr("id", 'arrowhead')
        .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
        .attr('refX', 17) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 13)
        .attr('markerHeight', 13)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');

    var drag_handler = d3.drag()
        .on("start", (event, d) => {
            if (!event.active) force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        })
    // .on("end", (event, d) => {
    //     if (!event.active) force.alphaTarget(0);
    //     d.fx = null;
    //     d.fy = null;
    // })

    var force = d3.forceSimulation(nodes)
        .force('charge', null)//d3.forceManyBody())
        .force('center', null) //d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(150))
        .force('link', d3.forceLink().links(links)
            .id( d => d.id )
        )
        .force('y', d3.forceY(function(d){
            if (d.id === start_node.id)
                return 0;
            if (d.id === end_node.id)
                return height;
            return d.y;
        }).strength(function(d){
            if (d.id === start_node.id || d.id === end_node.id)
                return 0.8;
            return 0.1;
        }))
        .force('x', d3.forceX(function(d){
             return width/2;
        }))
        .on('tick', tick);

    // add links
    var link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('marker-end', 'url(#arrowhead)'); //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.

    // add nodes
    var node = svg.selectAll('.node')
        .data(force.nodes())
        .enter()
        .append("g")
        .attr("class", "node")
        .call(drag_handler);

    node.filter(d => d.type === "place")
        .append('circle')        
        .attr('class', 'place')
        .attr('r', 50);
    
    node.filter(d => d.type === "transition")
        .append('rect')
        .attr('class', 'transition')
        .attr("width", 200)
        .attr("height", 40)
        .attr("x", d => -200/2)
        .attr("y", d => -40/2 );
    
    node.append('text')
        .attr("text-anchor", "middle")
        .text(d => d.id);
    
    
    function tick(e) {
        node.attr("transform", d => `translate(${d.x},${d.y})`);
        
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
    }
};