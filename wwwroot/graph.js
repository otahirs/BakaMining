// sources
// https://bl.ocks.org/bsullins/4e6ea24fe0739c88a2fd95125a616a5b
// https://observablehq.com/@foolishhmy/force-directed-graph-network-graph-with-arrowheads-and-lab/2
// https://github.com/LironHazan/directed-graph-flow-experiments

window.DrawGraph = (element, nodes, links, start_node, end_node) => {

    const height = 800;
    const width = 2000;

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
        .attr("id", 'arrowhead-place')
        .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
        .attr('refX', 29) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 13)
        .attr('markerHeight', 13)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#777')
        .style('stroke', 'none');

    svg.append('defs').append('marker')
        .attr("id", 'arrowhead-transition') //diff
        .attr('viewBox', '-0 -5 10 10') 
        .attr('refX', 10) // diff
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 13)
        .attr('markerHeight', 13)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#777')
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
        .force('charge', d3.forceManyBody())
        .force('center', null) //d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(150))
        .force('link', d3.forceLink().links(links)
            .id( d => d.id )
        )
        .force('x', d3.forceX(function(d){
            if (d.id === start_node.id)
                return 0;
            if (d.id === end_node.id)
                return width;
            return width/2;
        }).strength(function(d){
            if (d.id === start_node.id || d.id === end_node.id)
                return 0.8;
            return 0.1;
        }))
        .force('y', d3.forceY(function(d){
             return height/2;
        }).strength(function(d){
            if (d.id === start_node.id || d.id === end_node.id)
                return 0.8;
            return 0.1;
        }))
        .on('tick', tick);

    // add links
    var link = svg.selectAll('.link')
        .data(links)
        .enter().append("path")
        .attr('class', 'link');

    link.filter(d => d.target.type === "place")
        .attr('marker-end', 'url(#arrowhead-place)');

    link.filter(d => d.target.type === "transition")
        .attr('marker-end', 'url(#arrowhead-transition)');
    
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
    
    const trans_width = 40;
    const trans_height = 150;
    node.filter(d => d.type === "transition")
        .append('rect')
        .attr('class', 'transition')
        .attr("width", trans_width)
        .attr("height", trans_height)
        .attr("x", d => -trans_width/2)
        .attr("y", d => -trans_height/2 );
    
    node.append('text')
        .attr("text-anchor", "middle")
        .text(d => d.id);
    
    
    function tick(e) {
        node.attr("transform", d => `translate(${d.x},${d.y})`);

        link.attr("d", function(d) {
            if (d.target.type === 'transition') {
                var inter = pointOnRect(d.source.x, d.source.y,
                    d.target.x - trans_width/2, d.target.y - trans_height/2,
                    d.target.x + trans_width/2, d.target.y + trans_height/2);

                return "M" + d.source.x + "," + d.source.y + "L" + inter.x + "," + inter.y;
            }
            return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
        })
    }

    
    /**
     * Finds the intersection point between
     *     * the rectangle
     *       with parallel sides to the x and y axes
     *     * the half-line pointing towards (x,y)
     *       originating from the middle of the rectangle
     *
     * Note: the function works given min[XY] <= max[XY],
     *       even though minY may not be the "top" of the rectangle
     *       because the coordinate system is flipped.
     *
     * @param (x,y):Number point to build the line segment from
     * @param minX:Number the "left" side of the rectangle
     * @param minY:Number the "top" side of the rectangle
     * @param maxX:Number the "right" side of the rectangle
     * @param maxY:Number the "bottom" side of the rectangle
     * @param check:boolean (optional) whether to treat point inside the rect as error
     * @return an object with x and y members for the intersection
     * @throws if check == true and (x,y) is inside the rectangle
     * @author TWiStErRob
     * @see <a href="https://stackoverflow.com/a/31254199/253468">source</a>
     * @see <a href="https://stackoverflow.com/a/18292964/253468">based on</a>
     */
    function pointOnRect(x, y, minX, minY, maxX, maxY, check) {
        //assert minX <= maxX;
        //assert minY <= maxY;
        if (check && (minX <= x && x <= maxX) && (minY <= y && y <= maxY))
            throw "Point " + [x, y] + "cannot be inside " + "the rectangle: " + [minX, minY] + " - " + [maxX, maxY] + ".";
        var midX = (minX + maxX) / 2;
        var midY = (minY + maxY) / 2;
        // if (midX - x == 0) -> m == ±Inf -> minYx/maxYx == x (because value / ±Inf = ±0)
        var m = (midY - y) / (midX - x);

        if (x <= midX) { // check "left" side
            var minXy = m * (minX - x) + y;
            if (minY <= minXy && minXy <= maxY)
                return {
                    x: minX,
                    y: minXy
                };
        }

        if (x >= midX) { // check "right" side
            var maxXy = m * (maxX - x) + y;
            if (minY <= maxXy && maxXy <= maxY)
                return {
                    x: maxX,
                    y: maxXy
                };
        }

        if (y <= midY) { // check "top" side
            var minYx = (minY - y) / m + x;
            if (minX <= minYx && minYx <= maxX)
                return {
                    x: minYx,
                    y: minY
                };
        }

        if (y >= midY) { // check "bottom" side
            var maxYx = (maxY - y) / m + x;
            if (minX <= maxYx && maxYx <= maxX)
                return {
                    x: maxYx,
                    y: maxY
                };
        }
        // Should never happen :) If it does, please tell me!
        throw "Cannot find intersection for " + [x, y] + " inside rectangle " + [minX, minY] + " - " + [maxX, maxY] + ".";
    }
};